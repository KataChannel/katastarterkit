import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInvoiceInput, CreateInvoiceDetailInput, InvoiceSearchInput, BulkInvoiceInput } from '../graphql/inputs/invoice.input';
import { ExtListhoadon, ExtDetailhoadon, InvoiceSearchResult, DatabaseSyncResult, InvoiceStats } from '../graphql/models/invoice.model';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class InvoiceService {
  private readonly logger = new Logger(InvoiceService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Convert Decimal to number safely
   */
  private decimalToNumber(value: Decimal | null | undefined): number {
    if (!value) return 0;
    return value instanceof Decimal ? value.toNumber() : Number(value);
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
      tgtttsach: this.decimalToNumber(invoice.tgtttsach),
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
        const existing = await this.prisma.ext_listhoadon.findFirst({
          where: {
            nbmst: data.nbmst,
            khmshdon: data.khmshdon,
            shdon: data.shdon,
          },
        });

        if (existing) {
          this.logger.warn(`Invoice already exists: ${data.nbmst}-${data.khmshdon}-${data.shdon}`);
          return this.convertInvoice(existing);
        }
      }

      const invoice = await this.prisma.ext_listhoadon.create({
        data: {
          ...data,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
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
              idhdon: invoiceId,
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
        if (filters.fromDate) {
          where.tdlap.gte = filters.fromDate;
        }
        if (filters.toDate) {
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
   * Bulk create invoices
   */
  async bulkCreateInvoices(input: BulkInvoiceInput): Promise<DatabaseSyncResult> {
    const result: DatabaseSyncResult = {
      success: true,
      invoicesSaved: 0,
      detailsSaved: 0,
      errors: [],
      message: '',
    };

    try {
      for (const invoiceData of input.invoices) {
        try {
          // Skip existing if requested
          if (input.skipExisting && invoiceData.nbmst && invoiceData.khmshdon && invoiceData.shdon) {
            const exists = await this.invoiceExists(invoiceData.nbmst, invoiceData.khmshdon, invoiceData.shdon);
            if (exists) {
              continue;
            }
          }

          const invoice = await this.createInvoice(invoiceData);
          result.invoicesSaved++;

          // Note: Details would be handled separately via the detail creation endpoint
          // This is just for invoice headers
        } catch (error) {
          result.errors.push(`Failed to create invoice ${invoiceData.shdon}: ${error.message}`);
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
          ...data,
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