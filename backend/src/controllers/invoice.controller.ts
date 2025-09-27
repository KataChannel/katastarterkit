import { Controller, Post, Get, Body, Param, Query, UseGuards, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { $Enums } from '@prisma/client';
import { InvoiceService } from '../services/invoice.service';
import { CreateInvoiceInput, CreateInvoiceDetailInput, InvoiceSearchInput, BulkInvoiceInput } from '../graphql/inputs/invoice.input';

@Controller('api/invoices')
@UseGuards(JwtAuthGuard, RolesGuard)
export class InvoiceController {
  private readonly logger = new Logger(InvoiceController.name);

  constructor(private readonly invoiceService: InvoiceService) {}

  /**
   * Create a new invoice
   */
  @Post()
  @Roles($Enums.UserRoleType.ADMIN, $Enums.UserRoleType.USER)
  async createInvoice(@Body() input: CreateInvoiceInput) {
    try {
      this.logger.log('REST: Creating invoice');
      return await this.invoiceService.createInvoice(input);
    } catch (error) {
      this.logger.error('REST: Error creating invoice:', error.message);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * Create invoice details
   */
  @Post(':id/details')
  @Roles($Enums.UserRoleType.ADMIN, $Enums.UserRoleType.USER)
  async createInvoiceDetails(
    @Param('id') invoiceId: string,
    @Body() details: CreateInvoiceDetailInput[]
  ) {
    try {
      this.logger.log(`REST: Creating details for invoice ${invoiceId}`);
      return await this.invoiceService.createInvoiceDetails(invoiceId, details);
    } catch (error) {
      this.logger.error('REST: Error creating invoice details:', error.message);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * Get invoice by ID
   */
  @Get(':id')
  @Roles($Enums.UserRoleType.ADMIN, $Enums.UserRoleType.USER)
  async getInvoice(@Param('id') id: string) {
    try {
      this.logger.log(`REST: Getting invoice ${id}`);
      return await this.invoiceService.getInvoiceById(id);
    } catch (error) {
      this.logger.error(`REST: Error getting invoice ${id}:`, error.message);
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  /**
   * Search invoices with filters
   */
  @Get()
  @Roles($Enums.UserRoleType.ADMIN, $Enums.UserRoleType.USER)
  async searchInvoices(@Query() query: any) {
    try {
      // Helper function to parse and validate dates
      const parseDate = (dateString: string): Date | undefined => {
        if (!dateString || dateString.trim() === '') {
          return undefined;
        }
        
        const parsed = new Date(dateString);
        return isNaN(parsed.getTime()) ? undefined : parsed;
      };

      // Convert query parameters to search input
      const input: InvoiceSearchInput = {
        page: parseInt(query.page) || 0,
        size: parseInt(query.size) || 20,
        sortBy: query.sortBy || 'tdlap',
        sortOrder: query.sortOrder || 'desc',
        nbmst: query.nbmst,
        nmmst: query.nmmst,
        khmshdon: query.khmshdon,
        shdon: query.shdon,
        tthai: query.tthai,
        fromDate: parseDate(query.fromDate),
        toDate: parseDate(query.toDate),
      };

      this.logger.log('REST: Searching invoices');
      return await this.invoiceService.searchInvoices(input);
    } catch (error) {
      this.logger.error('REST: Error searching invoices:', error.message);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * Check if invoice exists
   */
  @Get('exists/:nbmst/:khmshdon/:shdon')
  @Roles($Enums.UserRoleType.ADMIN, $Enums.UserRoleType.USER)
  async invoiceExists(
    @Param('nbmst') nbmst: string,
    @Param('khmshdon') khmshdon: string,
    @Param('shdon') shdon: string
  ) {
    try {
      this.logger.log(`REST: Checking invoice existence: ${nbmst}-${khmshdon}-${shdon}`);
      return { exists: await this.invoiceService.invoiceExists(nbmst, khmshdon, shdon) };
    } catch (error) {
      this.logger.error('REST: Error checking invoice existence:', error.message);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * Bulk create invoices
   */
  @Post('bulk')
  @Roles($Enums.UserRoleType.ADMIN, $Enums.UserRoleType.USER)
  async bulkCreateInvoices(@Body() input: BulkInvoiceInput) {
    try {
      this.logger.log(`REST: Bulk creating ${input.invoices.length} invoices`);
      return await this.invoiceService.bulkCreateInvoices(input);
    } catch (error) {
      this.logger.error('REST: Error in bulk create:', error.message);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * Synchronize external API data with database
   */
  @Post('sync')
  @Roles($Enums.UserRoleType.ADMIN, $Enums.UserRoleType.USER)
  async syncInvoices(@Body() body: { invoiceData: any[], detailsData: any[] }) {
    try {
      this.logger.log('REST: Starting invoice sync from external API');
      
      const { invoiceData, detailsData } = body;
      
      // Convert API data to our input format
      const convertedInvoices: CreateInvoiceInput[] = invoiceData.map(invoice => ({
        idServer: invoice.id,  // Assuming 'id' is the unique identifier from external API
        nbmst: invoice.nbmst,
        khmshdon: invoice.khmshdon,
        khhdon: invoice.khhdon,
        shdon: invoice.shdon,
        cqt: invoice.cqt,
        hdon: invoice.hdon,
        hthdon: invoice.hthdon,
        htttoan: invoice.htttoan,
        idtbao: invoice.idtbao,
        khdon: invoice.khdon,
        khhdgoc: invoice.khhdgoc,
        khmshdgoc: invoice.khmshdgoc,
        mst: invoice.mst,
        nban: invoice.nban,
        nlap: invoice.nlap,
        nmua: invoice.nmua,
        nnt: invoice.nnt,
        shddauky: invoice.shddauky,
        shdkmdauky: invoice.shdkmdauky,
        tdlap: invoice.tdlap ? new Date(invoice.tdlap) : undefined,
        tgia: invoice.tgia || 0,
        tgtcthue: invoice.tgtcthue || 0,
        tgtthue: invoice.tgtthue || 0,
        tgtttbso: invoice.tgtttbso || 0,
        tthai: invoice.tthai,
        // Add other fields as needed from the external API
      }));

      // Create invoices and their details
      const syncResult = await this.invoiceService.bulkCreateInvoices({
        invoices: convertedInvoices,
        skipExisting: true,
      });

      // Handle details separately if needed
      if (detailsData && detailsData.length > 0) {
        this.logger.log(`Processing ${detailsData.length} invoice details`);
        // Details would need to be linked to created invoices
        // This would require more complex mapping logic
      }      
      return syncResult;
    } catch (error) {
      this.logger.error('REST: Error syncing invoices:', error.message);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Get database statistics
   */
  @Get('stats/summary')
  @Roles($Enums.UserRoleType.ADMIN, $Enums.UserRoleType.USER)
  async getStats() {
    try {
      this.logger.log('REST: Getting invoice statistics');
      return await this.invoiceService.getStats();
    } catch (error) {
      this.logger.error('REST: Error getting stats:', error.message);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}