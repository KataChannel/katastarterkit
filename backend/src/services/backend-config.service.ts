import { Injectable, Logger } from '@nestjs/common';

export interface BackendInvoiceConfig {
  bearerToken: string;
  apiBaseUrl: string;
  timeout: number;
  sslVerification: boolean;
  // Rate limiting configuration
  batchSize: number;
  delayBetweenBatches: number;
  delayBetweenDetailCalls: number;
  maxRetries: number;
}

@Injectable()
export class BackendConfigService {
  private readonly logger = new Logger(BackendConfigService.name);
  
  /**
   * Get invoice API configuration from environment variables
   */
  getInvoiceConfig(): BackendInvoiceConfig {
    const bearerToken = this.getBearerToken();
    const apiBaseUrl = process.env.INVOICE_API_BASE_URL || 'https://hoadondientu.gdt.gov.vn:30000';
    const timeout = parseInt(process.env.INVOICE_API_TIMEOUT || '30000');
    const sslVerification = process.env.INVOICE_API_SSL_VERIFICATION !== 'false'; // Default to true, set to false in .env to disable
    
    // Rate limiting configuration
    const batchSize = parseInt(process.env.INVOICE_API_BATCH_SIZE || '5');
    const delayBetweenBatches = parseInt(process.env.INVOICE_API_DELAY_BETWEEN_BATCHES || '2000');
    const delayBetweenDetailCalls = parseInt(process.env.INVOICE_API_DELAY_BETWEEN_CALLS || '500');
    const maxRetries = parseInt(process.env.INVOICE_API_MAX_RETRIES || '3');

    return {
      bearerToken,
      apiBaseUrl,
      timeout,
      sslVerification,
      batchSize,
      delayBetweenBatches,
      delayBetweenDetailCalls,
      maxRetries
    };
  }

  /**
   * Get Bearer Token from environment with fallback logic
   */
  getBearerToken(): string {
    // Try main token first
    const mainToken = process.env.INVOICE_API_BEARER_TOKEN;
    if (mainToken && mainToken !== 'your-actual-bearer-token-here') {
      return mainToken;
    }

    // Try default token
    const defaultToken = process.env.DEFAULT_BEARER_TOKEN;
    if (defaultToken && defaultToken !== 'your-default-bearer-token-here') {
      return defaultToken;
    }

    // Log warning if no valid token is found
    this.logger.warn('⚠️  No valid Bearer Token configured for Invoice API');
    this.logger.warn('Please set INVOICE_API_BEARER_TOKEN or DEFAULT_BEARER_TOKEN in your .env file');
    this.logger.warn('External API calls to fetch invoice details will likely fail');

    return '';
  }

  /**
   * Validate if Bearer Token is configured properly
   */
  isTokenConfigured(): boolean {
    const token = this.getBearerToken();
    return token.length > 0 && 
           token !== 'your-actual-bearer-token-here' && 
           token !== 'your-default-bearer-token-here';
  }

  /**
   * Get complete API endpoint for detail fetching
   */
  getDetailApiEndpoint(): string {
    const config = this.getInvoiceConfig();
    return `${config.apiBaseUrl}/query/invoices/detail`;
  }

  /**
   * Validate configuration and log status
   */
  validateConfiguration(): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!this.isTokenConfigured()) {
      errors.push('Bearer Token not configured or using placeholder value');
    }

    const config = this.getInvoiceConfig();
    
    if (!config.apiBaseUrl.startsWith('http')) {
      errors.push(`Invalid API Base URL: ${config.apiBaseUrl}`);
    }

    if (config.timeout < 1000 || config.timeout > 120000) {
      errors.push(`Invalid timeout: ${config.timeout}ms (should be 1000-120000)`);
    }

    const isValid = errors.length === 0;
    
    if (isValid) {
      this.logger.log('✅ Invoice API configuration is valid');
      this.logger.log(`📡 API Endpoint: ${this.getDetailApiEndpoint()}`);
      this.logger.log(`⏱️  Timeout: ${config.timeout}ms`);
      this.logger.log(`🔑 Token configured: ${this.isTokenConfigured() ? 'Yes' : 'No'}`);
    } else {
      this.logger.error('❌ Invoice API configuration errors:');
      errors.forEach(error => this.logger.error(`  - ${error}`));
    }

    return { isValid, errors };
  }
}