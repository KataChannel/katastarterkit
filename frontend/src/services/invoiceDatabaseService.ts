import { InvoiceData, ExtListhoadon, ExtDetailhoadon } from '@/types/invoice';

export interface DatabaseSyncResult {
  success: boolean;
  invoicesSaved: number;
  detailsSaved: number;
  errors: string[];
  message: string;
}

export class InvoiceDatabaseService {
  private static readonly API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

  /**
   * Map API invoice data to database format
   */
  private static mapApiToDatabase(apiInvoice: InvoiceData): Partial<ExtListhoadon> {
    return {
      // Use existing ID if available, otherwise let database generate
      ...(apiInvoice.id && { id: apiInvoice.id }),
      
      // Basic Invoice Info
      nbmst: apiInvoice.nbmst || apiInvoice.msttcgp,
      khmshdon: apiInvoice.khmshdon,
      shdon: apiInvoice.shdon,
      nbten: apiInvoice.tentcgp,
      nbdchi: apiInvoice.dctcgp,
      
      // Buyer Information
      nmmst: apiInvoice.msttmua,
      nmten: apiInvoice.tenxmua,
      nmdchi: apiInvoice.dcxmua,
      
      // Amounts
      tgtcthue: apiInvoice.tgtcthue,
      tgtthue: apiInvoice.tgtthue,
      tgtttbso: apiInvoice.tgtttbso,
      tgtttbchu: apiInvoice.tgtttchu,
      
      // Status and timing
      tthai: apiInvoice.tghdon,
      tdlap: apiInvoice.tdlap ? new Date(this.parseDate(apiInvoice.tdlap)) : undefined,
      
      // Additional fields - using correct database field names
      htttoan: apiInvoice.pthuc,
      gchu: apiInvoice.mtdieu,
      
      // Meta fields
      ladhddt: true, // This is always electronic invoice
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  /**
   * Parse date string from API (handles DD/MM/YYYY format)
   */
  private static parseDate(dateStr: string): string {
    try {
      if (dateStr.includes('/')) {
        // DD/MM/YYYY format
        const [day, month, year] = dateStr.split('/');
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      }
      // Already in ISO format
      return dateStr;
    } catch (error) {
      console.error('Error parsing date:', error);
      return new Date().toISOString();
    }
  }

  /**
   * Save single invoice to database
   */
  static async saveInvoice(apiInvoice: InvoiceData): Promise<{ success: boolean; id?: string; error?: string }> {
    try {
      const invoiceData = this.mapApiToDatabase(apiInvoice);
      
      const response = await fetch(`${this.API_BASE_URL}/invoices`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(invoiceData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return { success: true, id: result.id };
    } catch (error: any) {
      console.error('Error saving invoice:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Save invoice details to database
   */
  static async saveInvoiceDetails(
    invoiceId: string, 
    details: ExtDetailhoadon[]
  ): Promise<{ success: boolean; count: number; error?: string }> {
    try {
      const detailsData = details.map(detail => ({
        ...detail,
        idhdon: invoiceId,
        createdAt: new Date(),
        updatedAt: new Date()
      }));

      const response = await fetch(`${this.API_BASE_URL}/invoices/${invoiceId}/details`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ details: detailsData }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return { success: true, count: result.count || details.length };
    } catch (error: any) {
      console.error('Error saving invoice details:', error);
      return { success: false, count: 0, error: error.message };
    }
  }

  /**
   * Sync multiple invoices with database
   */
  static async syncInvoices(
    apiInvoices: InvoiceData[],
    includeDetails: boolean = false
  ): Promise<DatabaseSyncResult> {
    const result: DatabaseSyncResult = {
      success: true,
      invoicesSaved: 0,
      detailsSaved: 0,
      errors: [],
      message: ''
    };

    for (const apiInvoice of apiInvoices) {
      try {
        // Save invoice
        const invoiceResult = await this.saveInvoice(apiInvoice);
        
        if (invoiceResult.success && invoiceResult.id) {
          result.invoicesSaved++;
          
          // Optionally save details
          if (includeDetails) {
            try {
              // We would need to fetch details first
              // This is a placeholder for the detail fetching logic
              // In practice, you'd call InvoiceDetailApiService here
              result.detailsSaved += 0; // Placeholder
            } catch (detailError: any) {
              result.errors.push(`Details error for invoice ${apiInvoice.shdon}: ${detailError.message}`);
            }
          }
        } else {
          result.errors.push(`Failed to save invoice ${apiInvoice.shdon}: ${invoiceResult.error}`);
        }
      } catch (error: any) {
        result.errors.push(`Error processing invoice ${apiInvoice.shdon}: ${error.message}`);
      }
    }

    // Set overall success based on results
    result.success = result.errors.length === 0;
    result.message = result.success 
      ? `Successfully synced ${result.invoicesSaved} invoices`
      : `Synced ${result.invoicesSaved} invoices with ${result.errors.length} errors`;

    return result;
  }

  /**
   * Check if invoice exists in database
   */
  static async invoiceExists(nbmst: string, khmshdon: string, shdon: string): Promise<boolean> {
    try {
      const response = await fetch(
        `${this.API_BASE_URL}/invoices/exists?nbmst=${nbmst}&khmshdon=${khmshdon}&shdon=${shdon}`
      );
      
      if (!response.ok) {
        return false;
      }
      
      const result = await response.json();
      return result.exists === true;
    } catch (error) {
      console.error('Error checking invoice existence:', error);
      return false;
    }
  }

  /**
   * Get invoice from database
   */
  static async getInvoice(id: string): Promise<ExtListhoadon | null> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/invoices/${id}`);
      
      if (!response.ok) {
        return null;
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching invoice:', error);
      return null;
    }
  }

  /**
   * Get invoice details from database
   */
  static async getInvoiceDetails(invoiceId: string): Promise<ExtDetailhoadon[]> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/invoices/${invoiceId}/details`);
      
      if (!response.ok) {
        return [];
      }
      
      const result = await response.json();
      return result.details || [];
    } catch (error) {
      console.error('Error fetching invoice details:', error);
      return [];
    }
  }

  /**
   * Search invoices in database
   */
  static async searchInvoices(params: {
    nbmst?: string;
    fromDate?: string;
    toDate?: string;
    page?: number;
    size?: number;
  }): Promise<{ invoices: ExtListhoadon[]; total: number }> {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.nbmst) queryParams.set('nbmst', params.nbmst);
      if (params.fromDate) queryParams.set('fromDate', params.fromDate);
      if (params.toDate) queryParams.set('toDate', params.toDate);
      if (params.page) queryParams.set('page', params.page.toString());
      if (params.size) queryParams.set('size', params.size.toString());

      const response = await fetch(`${this.API_BASE_URL}/invoices/search?${queryParams.toString()}`);
      
      if (!response.ok) {
        throw new Error(`Search failed with status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error searching invoices:', error);
      return { invoices: [], total: 0 };
    }
  }

  /**
   * Get database statistics
   */
  static async getDatabaseStats(): Promise<{
    totalInvoices: number;
    totalDetails: number;
    lastSyncDate?: Date;
  }> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/invoices/stats`);
      
      if (!response.ok) {
        throw new Error(`Stats request failed with status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching database stats:', error);
      return { totalInvoices: 0, totalDetails: 0 };
    }
  }
}

export default InvoiceDatabaseService;