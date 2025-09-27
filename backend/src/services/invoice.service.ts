import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInvoiceInput, CreateInvoiceDetailInput, InvoiceSearchInput, BulkInvoiceInput } from '../graphql/inputs/invoice.input';
import { ExtListhoadon, ExtDetailhoadon, InvoiceSearchResult, DatabaseSyncResult, InvoiceStats } from '../graphql/models/invoice.model';
import { Decimal } from '@prisma/client/runtime/library';
import axios from 'axios';
import https from 'https';
import { BackendConfigService } from './backend-config.service';

@Injectable()
export class InvoiceService {
  private readonly logger = new Logger(InvoiceService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: BackendConfigService
  ) {
    // Validate configuration on startup
    this.configService.validateConfiguration();
  }

  /**
   * Extract detail parameters from invoice data
   */
  private extractDetailParams(invoice: any): {
    nbmst: string;
    khhdon: string;
    shdon: string;
    khmshdon: string;
  } | null {
    try {
      const nbmst = invoice.nbmst || invoice.msttcgp;
      const khhdon = invoice.khhdon || invoice.khmshdon;
      const shdon = invoice.shdon;
      const khmshdon = invoice.khmshdon;

      if (!nbmst || !khhdon || !shdon || !khmshdon) {
        this.logger.warn('Missing required parameters for detail fetching:', {
          nbmst: !!nbmst,
          khhdon: !!khhdon,
          shdon: !!shdon,
          khmshdon: !!khmshdon
        });
        return null;
      }

      return { nbmst, khhdon, shdon, khmshdon };
    } catch (error) {
      this.logger.error('Error extracting detail params:', error);
      return null;
    }
  }

  /**
   * Fetch invoice details from external API
   */
  private async fetchInvoiceDetails(
    params: {
      nbmst: string;
      khhdon: string;
      shdon: string;
      khmshdon: string;
    },
    bearerToken?: string
  ): Promise<any[]> {
    try {
      // Use provided bearerToken or fallback to environment config
      const effectiveToken = bearerToken || this.configService.getBearerToken();
      const config = this.configService.getInvoiceConfig();
      
      if (!effectiveToken || effectiveToken.length === 0) {
        this.logger.warn('No Bearer Token provided from frontend or environment');
        this.logger.warn('Invoice detail fetching will likely fail due to authentication');
      }
      
      const queryParams = new URLSearchParams({
        nbmst: params.nbmst,
        khhdon: params.khhdon,
        shdon: params.shdon,
        khmshdon: params.khmshdon
      });

      const url = `${this.configService.getDetailApiEndpoint()}?${queryParams.toString()}`;
      this.logger.log(`Fetching invoice details from: ${url}`);
      this.logger.log(`Using token from: ${bearerToken ? 'frontend' : 'environment'}`);
      
      // Create HTTPS agent to handle SSL certificate issues
      const httpsAgent = new https.Agent({
        rejectUnauthorized: config.sslVerification, // Use config setting for SSL verification
        keepAlive: true,
        timeout: config.timeout
      });

      if (!config.sslVerification) {
        this.logger.log('🔓 SSL certificate verification is disabled for external API calls');
      }

      const response = await axios.get(url, {
        timeout: config.timeout,
        httpsAgent: httpsAgent, // Use custom HTTPS agent
        headers: {
          'Authorization': `Bearer ${effectiveToken}`,
          'User-Agent': 'Mozilla/5.0 (compatible; InvoiceService/1.0)',
          'Content-Type': 'application/json'
        }
      });

      if (response.data && response.data.datas) {
        return response.data.datas;
      }

      return [];
    } catch (error: any) {
      const effectiveToken = bearerToken || this.configService.getBearerToken();
      const tokenSource = bearerToken ? 'frontend' : 'environment';
      const hasValidToken = effectiveToken && effectiveToken.length > 0;
      
      this.logger.error('Error fetching invoice details:', {
        error: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        hasValidToken,
        tokenSource,
        endpoint: this.configService.getDetailApiEndpoint(),
        params
      });
      
      // Specific error handling for different types of errors
      if (error.message?.includes('unable to verify the first certificate')) {
        this.logger.error('🔒 SSL Certificate verification failed');
        this.logger.log('✅ Applied SSL certificate bypass - request should now work');
        this.logger.warn('⚠️  Note: SSL verification is disabled for this external API');
      } else if (error.response?.status === 409) {
        this.logger.warn('🚦 Server overload (409 Conflict) - Too many requests');
        this.logger.log('💡 Rate limiting is applied, will retry with backoff delay');
        throw error; // Re-throw to trigger retry logic in bulkCreateInvoices
      } else if (error.response?.status === 429) {
        this.logger.warn('🚦 Rate limit exceeded (429 Too Many Requests)');
        this.logger.log('💡 Rate limiting is applied, will retry with backoff delay');
        throw error; // Re-throw to trigger retry logic in bulkCreateInvoices
      } else if (error.response?.status === 401) {
        this.logger.error('🔐 Authentication failed - Bearer Token may be invalid or expired');
        if (tokenSource === 'frontend') {
          this.logger.error('💡 Please check the Bearer Token in your frontend configuration (ketoan/listhoadon)');
        } else {
          this.logger.error('💡 Please check INVOICE_API_BEARER_TOKEN in your .env file');
        }
      } else if (error.response?.status === 403) {
        this.logger.error('🚫 Access forbidden - Bearer Token may not have sufficient permissions');
      } else if (error.response?.status === 404) {
        this.logger.warn('📋 No details found for this invoice');
      } else if (error.response?.status === 500 || error.response?.status === 502 || error.response?.status === 503) {
        this.logger.warn('🔧 Server error from external API - May be temporary');
        this.logger.log('💡 Will retry with backoff delay');
        throw error; // Re-throw to trigger retry logic
      } else if (error.code === 'ECONNABORTED') {
        this.logger.error('⏱️  Request timeout - External API is not responding');
        throw error; // Re-throw to trigger retry logic
      } else if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
        this.logger.error('🌐 Network error - Cannot reach external API');
      } else if (error.code === 'CERT_HAS_EXPIRED') {
        this.logger.error('📅 SSL Certificate has expired');
        this.logger.log('✅ SSL verification bypass should handle this issue');
      } else if (error.code === 'SELF_SIGNED_CERT_IN_CHAIN') {
        this.logger.error('🔗 Self-signed certificate in chain');
        this.logger.log('✅ SSL verification bypass should handle this issue');
      }
      
      return [];
    }
  }

  /**
   * Save invoice details to database
   */
  private async saveInvoiceDetails(invoiceIdServer: string, details: any[]): Promise<number> {
    try {
      if (!details || details.length === 0) {
        this.logger.log('No details to save');
        return 0;
      }

      const savedDetails = [];
      for (const detail of details) {
        try {
          const detailData = {
            idServer: detail.id || `${invoiceIdServer}_${detail.stt || Math.random()}`,
            idhdonServer: invoiceIdServer,
            dgia: detail.dgia ? new Decimal(detail.dgia) : null,
            dvtinh: detail.dvtinh || null,
            ltsuat: detail.ltsuat ? new Decimal(detail.ltsuat) : null,
            sluong: detail.sluong ? new Decimal(detail.sluong) : null,
            stbchu: detail.stbchu || null,
            stckhau: detail.stckhau ? new Decimal(detail.stckhau) : null,
            stt: detail.stt ? parseInt(detail.stt) : null,
            tchat: detail.tchat || null,
            ten: detail.ten || null,
            thtcthue: detail.thtcthue ? new Decimal(detail.thtcthue) : null,
            thtien: detail.thtien ? new Decimal(detail.thtien) : null,
            tlckhau: detail.tlckhau ? new Decimal(detail.tlckhau) : null,
            tsuat: detail.tsuat ? new Decimal(detail.tsuat) : null,
            tthue: detail.tthue ? new Decimal(detail.tthue) : null,
            sxep: detail.sxep ? parseInt(detail.sxep) : null,
            dvtte: detail.dvtte || null,
            tgia: detail.tgia ? new Decimal(detail.tgia) : null,
            tthhdtrung: detail.tthhdtrung || null,
            createdAt: new Date(),
            updatedAt: new Date()
          };

          const savedDetail = await this.prisma.ext_detailhoadon.create({
            data: detailData
          });

          savedDetails.push(savedDetail);
        } catch (detailError: any) {
          this.logger.error('Error saving individual detail:', {
            error: detailError.message,
            detail: detail.stt || 'unknown'
          });
        }
      }

      this.logger.log(`Successfully saved ${savedDetails.length} out of ${details.length} details`);
      return savedDetails.length;
    } catch (error: any) {
      this.logger.error('Error saving invoice details:', error);
      return 0;
    }
  }

  /**
   * Automatically fetch and save invoice details
   */
  private async autoFetchAndSaveDetails(invoice: any, bearerToken?: string): Promise<number> {
    try {
      // Extract parameters from invoice
      const detailParams = this.extractDetailParams(invoice);
      if (!detailParams) {
        this.logger.warn(`Cannot extract detail parameters for invoice ${invoice.shdon}`);
        return 0;
      }

      // Fetch details from external API using provided bearerToken
      const details = await this.fetchInvoiceDetails(detailParams, bearerToken);
      if (details.length === 0) {
        this.logger.log(`No details found for invoice ${invoice.shdon}`);
        return 0;
      }

      // Save details to database
      const savedCount = await this.saveInvoiceDetails(invoice.idServer, details);
      this.logger.log(`Auto-saved ${savedCount} details for invoice ${invoice.shdon}`);
      
      return savedCount;
    } catch (error: any) {
      this.logger.error(`Error auto-fetching details for invoice ${invoice.shdon}:`, error);
      return 0;
    }
  }

  /**
   * Convert Decimal to number safely
   */
  private decimalToNumber(value: Decimal | null | undefined): number {
    if (!value) return 0;
    return value instanceof Decimal ? value.toNumber() : Number(value);
  }

  /**
   * Normalize invoice data to ensure proper types for database schema
   */
  private normalizeInvoiceData(data: any): any {
    if (!data) return data;
    
    // Helper function to safely convert to string
    const toStringOrNull = (value: any): string | null => {
      if (value === null || value === undefined) return null;
      return String(value);
    };
    
    return {
      ...data,
      // Convert all string fields that might receive integers or other types
      khmshdon: toStringOrNull(data.khmshdon),
      khhdon: toStringOrNull(data.khhdon), 
      shdon: toStringOrNull(data.shdon),
      cqt: toStringOrNull(data.cqt),
      hdon: toStringOrNull(data.hdon),
      hthdon: toStringOrNull(data.hthdon), // This was causing the current error
      htttoan: toStringOrNull(data.htttoan),
      idtbao: toStringOrNull(data.idtbao),
      khdon: toStringOrNull(data.khdon),
      khhdgoc: toStringOrNull(data.khhdgoc),
      khmshdgoc: toStringOrNull(data.khmshdgoc),
      lhdgoc: toStringOrNull(data.lhdgoc),
      mhdon: toStringOrNull(data.mhdon),
      mtdiep: toStringOrNull(data.mtdiep),
      mtdtchieu: toStringOrNull(data.mtdtchieu),
      nbdchi: toStringOrNull(data.nbdchi),
      chma: toStringOrNull(data.chma),
      chten: toStringOrNull(data.chten),
      nbhdktso: toStringOrNull(data.nbhdktso),
      nbhdso: toStringOrNull(data.nbhdso),
      nblddnbo: toStringOrNull(data.nblddnbo),
      nbptvchuyen: toStringOrNull(data.nbptvchuyen),
      nbstkhoan: toStringOrNull(data.nbstkhoan),
      nbten: toStringOrNull(data.nbten),
      nbtnhang: toStringOrNull(data.nbtnhang),
      nbtnvchuyen: toStringOrNull(data.nbtnvchuyen),
      ncma: toStringOrNull(data.ncma),
      nky: toStringOrNull(data.nky),
      nmdchi: toStringOrNull(data.nmdchi),
      nmmst: toStringOrNull(data.nmmst),
      nmstkhoan: toStringOrNull(data.nmstkhoan),
      nmten: toStringOrNull(data.nmten),
      nmtnhang: toStringOrNull(data.nmtnhang),
      nmtnmua: toStringOrNull(data.nmtnmua),
      nmttkhac: toStringOrNull(data.nmttkhac),
      pban: toStringOrNull(data.pban),
      ptgui: toStringOrNull(data.ptgui),
      shdgoc: toStringOrNull(data.shdgoc),
      tchat: toStringOrNull(data.tchat),
      tgtttbchu: toStringOrNull(data.tgtttbchu),
      thdon: toStringOrNull(data.thdon),
      tlhdon: toStringOrNull(data.tlhdon),
      ttcktmai: toStringOrNull(data.ttcktmai),
      tthai: toStringOrNull(data.tthai),
      tttbao: toStringOrNull(data.tttbao),
      ttxly: toStringOrNull(data.ttxly),
      tvandnkntt: toStringOrNull(data.tvandnkntt),
      mhso: toStringOrNull(data.mhso),
      mkhang: toStringOrNull(data.mkhang),
      nbsdthoai: toStringOrNull(data.nbsdthoai),
      nbdctdtu: toStringOrNull(data.nbdctdtu),
      nbfax: toStringOrNull(data.nbfax),
      nbwebsite: toStringOrNull(data.nbwebsite),
      nmsdthoai: toStringOrNull(data.nmsdthoai),
      nmdctdtu: toStringOrNull(data.nmdctdtu),
      nmcmnd: toStringOrNull(data.nmcmnd),
      nmcks: toStringOrNull(data.nmcks),
      bhphap: toStringOrNull(data.bhphap),
      hddunlap: toStringOrNull(data.hddunlap),
      gchdgoc: toStringOrNull(data.gchdgoc),
      bhpldo: toStringOrNull(data.bhpldo),
      bhpcbo: toStringOrNull(data.bhpcbo),
      unhiem: toStringOrNull(data.unhiem),
      mstdvnunlhdon: toStringOrNull(data.mstdvnunlhdon),
      tdvnunlhdon: toStringOrNull(data.tdvnunlhdon),
      nbmdvqhnsach: toStringOrNull(data.nbmdvqhnsach),
      nbsqdinh: toStringOrNull(data.nbsqdinh),
      nbncqdinh: toStringOrNull(data.nbncqdinh),
      nbcqcqdinh: toStringOrNull(data.nbcqcqdinh),
      nbhtban: toStringOrNull(data.nbhtban),
      nmmdvqhnsach: toStringOrNull(data.nmmdvqhnsach),
      nmddvchden: toStringOrNull(data.nmddvchden),
      nbtnban: toStringOrNull(data.nbtnban),
      dcdvnunlhdon: toStringOrNull(data.dcdvnunlhdon),
      thtttoan: toStringOrNull(data.thtttoan),
      msttcgp: toStringOrNull(data.msttcgp),
      gchu: toStringOrNull(data.gchu),
      kqcht: toStringOrNull(data.kqcht),
      nmshchieu: toStringOrNull(data.nmshchieu),
      nmnchchieu: toStringOrNull(data.nmnchchieu),
      nmnhhhchieu: toStringOrNull(data.nmnhhhchieu),
      nmqtich: toStringOrNull(data.nmqtich),
      nmstttoan: toStringOrNull(data.nmstttoan),
      nmttttoan: toStringOrNull(data.nmttttoan),
      hdhhdvu: toStringOrNull(data.hdhhdvu),
      qrcode: toStringOrNull(data.qrcode),
      ttmstten: toStringOrNull(data.ttmstten),
      ladhddtten: toStringOrNull(data.ladhddtten),
      hdxkhau: toStringOrNull(data.hdxkhau),
      hdxkptquan: toStringOrNull(data.hdxkptquan),
      hdonLquans: toStringOrNull(data.hdonLquans),
      tthdclquan: toStringOrNull(data.tthdclquan),
      pdndungs: toStringOrNull(data.pdndungs),
      hdtbssrses: toStringOrNull(data.hdtbssrses),
      hdTrung: toStringOrNull(data.hdTrung),
      hdcttchinh: toStringOrNull(data.hdcttchinh),
      
      // Ensure other fields maintain their original types
      // Decimal fields should remain as numbers/decimals
      // DateTime fields should remain as Date objects
      // Boolean fields should remain as booleans
    };
  }

  /**
   * Convert Prisma invoice to GraphQL model
   */
  private convertInvoice(invoice: any): ExtListhoadon {
    return {
      ...invoice,
      tgia: this.decimalToNumber(invoice.tgia),
      tgtcthue: this.decimalToNumber(invoice.tgtcthue),
      tgtthue: this.decimalToNumber(invoice.tgtthue),
      tgtttbso: this.decimalToNumber(invoice.tgtttbso),
      details: invoice.details ? invoice.details.map((detail: any) => this.convertDetail(detail)) : [],
    };
  }

  /**
   * Convert Prisma detail to GraphQL model
   */
  private convertDetail(detail: any): ExtDetailhoadon {
    return {
      ...detail,
      dgia: this.decimalToNumber(detail.dgia),
      tgia: this.decimalToNumber(detail.tgia),
      ltsuat: this.decimalToNumber(detail.ltsuat),
      sluong: this.decimalToNumber(detail.sluong),
      tgtcthue: this.decimalToNumber(detail.tgtcthue),
      tgthue: this.decimalToNumber(detail.tgthue),
      tsuat: this.decimalToNumber(detail.tsuat),
    };
  }

  /**
   * Create a new invoice
   */
  async createInvoice(data: CreateInvoiceInput): Promise<ExtListhoadon> {
    try {
      // Check for existing invoice to prevent duplicates
      if (data.nbmst && data.khmshdon && data.shdon) {
        const normalizedData = this.normalizeInvoiceData(data);
        const existing = await this.prisma.ext_listhoadon.findFirst({
          where: {
            nbmst: data.nbmst,
            khmshdon: normalizedData.khmshdon,
            shdon: normalizedData.shdon,
          },
        });

        if (existing) {
          this.logger.warn(`Invoice already exists: ${data.nbmst}-${data.khmshdon}-${data.shdon}`);
          return this.convertInvoice(existing);
        }
      }

      // Generate idServer if not provided
      const idServer = data.idServer || 
        (data.nbmst && data.khmshdon && data.shdon ? 
          `${data.nbmst}_${data.khmshdon}_${data.shdon}` : 
          undefined);

      // Transform data to ensure proper types for Prisma schema
      const transformedData = {
        ...this.normalizeInvoiceData(data),
        idServer,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const invoice = await this.prisma.ext_listhoadon.create({
        data: transformedData,
        include: {
          details: true,
        },
      });

      this.logger.log(`Created invoice: ${invoice.id}`);
      return this.convertInvoice(invoice);
    } catch (error) {
      this.logger.error('Error creating invoice:', error);
      throw new BadRequestException('Failed to create invoice');
    }
  }

  /**
   * Create invoice details
   */
  async createInvoiceDetails(invoiceId: string, details: CreateInvoiceDetailInput[]): Promise<ExtDetailhoadon[]> {
    try {
      console.log('Creating details for invoice:', invoiceId, details);
      
      // Verify invoice exists
      const invoice = await this.prisma.ext_listhoadon.findUnique({
        where: { id: invoiceId },
      });

      if (!invoice) {
        throw new NotFoundException(`Invoice with ID ${invoiceId} not found`);
      }

      // Create details in batch
      const createdDetails = await Promise.all(
        details.map(detail => 
          this.prisma.ext_detailhoadon.create({
            data: {
              ...detail,
              idServer: invoiceId, // Add the required idServer field
              invoice: {
                connect: { id: invoiceId }
              },
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          })
        )
      );

      this.logger.log(`Created ${createdDetails.length} details for invoice ${invoiceId}`);
      return createdDetails.map(detail => this.convertDetail(detail));
    } catch (error) {
      this.logger.error('Error creating invoice details:', error);
      throw new BadRequestException('Failed to create invoice details');
    }
  }

  /**
   * Get invoice by ID
   */
  async getInvoiceById(id: string): Promise<ExtListhoadon> {
    try {
      const invoice = await this.prisma.ext_listhoadon.findUnique({
        where: { id },
        include: {
          details: {
            orderBy: { stt: 'asc' },
          },
        },
      });

      if (!invoice) {
        throw new NotFoundException(`Invoice with ID ${id} not found`);
      }

      return this.convertInvoice(invoice);
    } catch (error) {
      this.logger.error(`Error getting invoice ${id}:`, error);
      throw error;
    }
  }

  /**
   * Search invoices with pagination and filters
   */
  async searchInvoices(input: InvoiceSearchInput): Promise<InvoiceSearchResult> {
    try {
      const { page = 0, size = 20, sortBy = 'tdlap', sortOrder = 'desc', ...filters } = input;

      // Log input for debugging
      this.logger.debug('Invoice search input:', {
        page,
        size,
        sortBy,
        sortOrder,
        fromDate: filters.fromDate?.toISOString(),
        toDate: filters.toDate?.toISOString(),
        otherFilters: { ...filters, fromDate: undefined, toDate: undefined }
      });

      // Build where clause
      const where: any = {};

      if (filters.nbmst) {
        where.nbmst = { contains: filters.nbmst, mode: 'insensitive' };
      }

      if (filters.nmmst) {
        where.nmmst = { contains: filters.nmmst, mode: 'insensitive' };
      }

      if (filters.khmshdon) {
        where.khmshdon = { contains: filters.khmshdon, mode: 'insensitive' };
      }

      if (filters.shdon) {
        where.shdon = { contains: filters.shdon, mode: 'insensitive' };
      }

      if (filters.tthai) {
        where.tthai = filters.tthai;
      }

      if (filters.fromDate || filters.toDate) {
        where.tdlap = {};
        
        if (filters.fromDate && !isNaN(filters.fromDate.getTime())) {
          where.tdlap.gte = filters.fromDate;
        }
        
        if (filters.toDate && !isNaN(filters.toDate.getTime())) {
          where.tdlap.lte = filters.toDate;
        }
      }

      // Execute queries
      const [invoices, total] = await Promise.all([
        this.prisma.ext_listhoadon.findMany({
          where,
          include: {
            details: {
              take: 5, // Limit details for list view
              orderBy: { stt: 'asc' },
            },
          },
          orderBy: { [sortBy]: sortOrder },
          skip: page * size,
          take: size,
        }),
        this.prisma.ext_listhoadon.count({ where }),
      ]);

      const totalPages = Math.ceil(total / size);

      return {
        invoices: invoices.map(invoice => this.convertInvoice(invoice)),
        total,
        page,
        size,
        totalPages,
      };
    } catch (error) {
      this.logger.error('Error searching invoices:', error);
      throw new BadRequestException('Failed to search invoices');
    }
  }

  /**
   * Check if invoice exists
   */
  async invoiceExists(nbmst: string, khmshdon: string, shdon: string): Promise<boolean> {
    try {
      const count = await this.prisma.ext_listhoadon.count({
        where: {
          nbmst,
          khmshdon,
          shdon,
        },
      });

      return count > 0;
    } catch (error) {
      this.logger.error('Error checking invoice existence:', error);
      return false;
    }
  }

  /**
   * Add delay between API calls to prevent server overload
   */
  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Bulk create invoices with rate limiting to prevent 409 errors
   */
  async bulkCreateInvoices(input: BulkInvoiceInput): Promise<DatabaseSyncResult> {
    const result: DatabaseSyncResult = {
      success: true,
      invoicesSaved: 0,
      detailsSaved: 0,
      errors: [],
      message: '',
    };

    // Get rate limiting configuration from config service
    const config = this.configService.getInvoiceConfig();
    const BATCH_SIZE = config.batchSize;
    const DELAY_BETWEEN_BATCHES = config.delayBetweenBatches;
    const DELAY_BETWEEN_DETAIL_CALLS = config.delayBetweenDetailCalls;
    const MAX_RETRIES = config.maxRetries;

    try {
      this.logger.log(`Starting bulk creation of ${input.invoices.length} invoices with rate limiting`);
      this.logger.log(`Rate limiting config - Batch size: ${BATCH_SIZE}, Delay between batches: ${DELAY_BETWEEN_BATCHES}ms, Detail call delay: ${DELAY_BETWEEN_DETAIL_CALLS}ms, Max retries: ${MAX_RETRIES}`);

      // Process invoices in batches to prevent server overload
      for (let i = 0; i < input.invoices.length; i += BATCH_SIZE) {
        const batch = input.invoices.slice(i, i + BATCH_SIZE);
        const batchNumber = Math.floor(i / BATCH_SIZE) + 1;
        const totalBatches = Math.ceil(input.invoices.length / BATCH_SIZE);

        this.logger.log(`Processing batch ${batchNumber}/${totalBatches} (${batch.length} invoices)`);

        // Process current batch
        for (const invoiceData of batch) {
          try {
            // Skip existing if requested
            if (input.skipExisting && invoiceData.nbmst && invoiceData.khmshdon && invoiceData.shdon) {
              const exists = await this.invoiceExists(
                invoiceData.nbmst, 
                String(invoiceData.khmshdon), 
                String(invoiceData.shdon)
              );
              if (exists) {
                this.logger.debug(`Skipping existing invoice: ${invoiceData.shdon}`);
                continue;
              }
            }

            const invoice = await this.createInvoice(invoiceData);
            this.logger.log('Created invoice in bulk:', {
              id: invoice.id,
              idServer: invoice.idServer,
              shdon: invoice.shdon
            });
            
            // Automatically fetch and save invoice details with retry logic
            if (input.includeDetails !== false) {
              let retryCount = 0;
              let detailsSaved = 0;

              while (retryCount <= MAX_RETRIES) {
                try {
                  // Add delay before detail API call to prevent rate limiting
                  if (retryCount > 0) {
                    const retryDelay = DELAY_BETWEEN_DETAIL_CALLS * Math.pow(2, retryCount); // Exponential backoff
                    this.logger.log(`Retrying detail fetch for invoice ${invoice.shdon} (attempt ${retryCount + 1}/${MAX_RETRIES + 1}) after ${retryDelay}ms delay`);
                    await this.delay(retryDelay);
                  } else {
                    await this.delay(DELAY_BETWEEN_DETAIL_CALLS);
                  }

                  detailsSaved = await this.autoFetchAndSaveDetails(invoice, input.bearerToken);
                  result.detailsSaved += detailsSaved;
                  
                  if (detailsSaved > 0) {
                    const tokenSource = input.bearerToken ? 'frontend' : 'environment';
                    this.logger.log(`Auto-fetched ${detailsSaved} details for invoice ${invoice.shdon} using token from ${tokenSource}`);
                  }
                  
                  break; // Success, exit retry loop

                } catch (detailError: any) {
                  retryCount++;
                  
                  // Check if it's a rate limiting error (409, 429, etc.)
                  const isRateLimitError = detailError.response?.status === 409 || 
                                         detailError.response?.status === 429 ||
                                         detailError.code === 'ECONNABORTED' ||
                                         detailError.message?.includes('timeout');

                  if (isRateLimitError && retryCount <= MAX_RETRIES) {
                    this.logger.warn(`Rate limit/timeout error for invoice ${invoice.shdon}, will retry (${retryCount}/${MAX_RETRIES}): ${detailError.message}`);
                    continue; // Try again with backoff
                  } else {
                    this.logger.error(`Failed to auto-fetch details for invoice ${invoice.shdon} after ${retryCount} attempts:`, detailError);
                    result.errors.push(`Failed to fetch details for invoice ${invoice.shdon}: ${detailError.message}`);
                    break; // Give up on this invoice
                  }
                }
              }
            }

            result.invoicesSaved++;

          } catch (error) {
            this.logger.error(`Failed to create invoice ${invoiceData.shdon}:`, error);
            result.errors.push(`Failed to create invoice ${invoiceData.shdon}: ${error.message}`);
          }
        }

        // Add delay between batches (except for the last batch)
        if (i + BATCH_SIZE < input.invoices.length) {
          this.logger.log(`Batch ${batchNumber} completed. Waiting ${DELAY_BETWEEN_BATCHES}ms before next batch...`);
          await this.delay(DELAY_BETWEEN_BATCHES);
        }
      }


      result.success = result.errors.length === 0;
      result.message = result.success 
        ? `Successfully created ${result.invoicesSaved} invoices`
        : `Created ${result.invoicesSaved} invoices with ${result.errors.length} errors`;

      this.logger.log(`Bulk operation completed: ${result.message}`);
      return result;
    } catch (error) {
      this.logger.error('Error in bulk create operation:', error);
      throw new BadRequestException('Bulk create operation failed');
    }
  }

  /**
   * Get database statistics
   */
  async getStats(): Promise<InvoiceStats> {
    try {
      const [invoiceCount, detailCount, totals, lastInvoice] = await Promise.all([
        this.prisma.ext_listhoadon.count(),
        this.prisma.ext_detailhoadon.count(),
        this.prisma.ext_listhoadon.aggregate({
          _sum: {
            tgtttbso: true,
            tgtthue: true,
          },
        }),
        this.prisma.ext_listhoadon.findFirst({
          orderBy: { createdAt: 'desc' },
          select: { createdAt: true },
        }),
      ]);

      return {
        totalInvoices: invoiceCount,
        totalDetails: detailCount,
        totalAmount: this.decimalToNumber(totals._sum.tgtttbso),
        totalTax: this.decimalToNumber(totals._sum.tgtthue),
        lastSyncDate: lastInvoice?.createdAt,
      };
    } catch (error) {
      this.logger.error('Error getting stats:', error);
      throw new BadRequestException('Failed to get database statistics');
    }
  }

  /**
   * Delete invoice (for cleanup/testing)
   */
  async deleteInvoice(id: string): Promise<boolean> {
    try {
      await this.prisma.ext_listhoadon.delete({
        where: { id },
      });

      this.logger.log(`Deleted invoice: ${id}`);
      return true;
    } catch (error) {
      this.logger.error(`Error deleting invoice ${id}:`, error);
      return false;
    }
  }

  /**
   * Update invoice
   */
  async updateInvoice(id: string, data: Partial<CreateInvoiceInput>): Promise<ExtListhoadon> {
    try {
      const invoice = await this.prisma.ext_listhoadon.update({
        where: { id },
        data: {
          ...this.normalizeInvoiceData(data),
          updatedAt: new Date(),
        },
        include: {
          details: true,
        },
      });

      this.logger.log(`Updated invoice: ${id}`);
      return this.convertInvoice(invoice);
    } catch (error) {
      this.logger.error(`Error updating invoice ${id}:`, error);
      throw new BadRequestException('Failed to update invoice');
    }
  }
}