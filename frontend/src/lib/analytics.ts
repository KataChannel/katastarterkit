/**
 * Facebook Pixel Tracking Helpers
 * Use these functions to track custom events throughout the application
 */

declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
  }
}

export const fbPixel = {
  // Standard Events
  track: (eventName: string, data?: Record<string, any>) => {
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', eventName, data);
    }
  },

  trackCustom: (eventName: string, data?: Record<string, any>) => {
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('trackCustom', eventName, data);
    }
  },

  // E-commerce Events
  viewContent: (data?: { content_name?: string; content_ids?: string[]; content_type?: string; value?: number; currency?: string }) => {
    fbPixel.track('ViewContent', data);
  },

  search: (data?: { search_string?: string; content_ids?: string[]; value?: number; currency?: string }) => {
    fbPixel.track('Search', data);
  },

  addToCart: (data?: { content_ids?: string[]; content_name?: string; content_type?: string; value?: number; currency?: string }) => {
    fbPixel.track('AddToCart', data);
  },

  addToWishlist: (data?: { content_ids?: string[]; content_name?: string; value?: number; currency?: string }) => {
    fbPixel.track('AddToWishlist', data);
  },

  initiateCheckout: (data?: { content_ids?: string[]; num_items?: number; value?: number; currency?: string }) => {
    fbPixel.track('InitiateCheckout', data);
  },

  addPaymentInfo: (data?: { content_ids?: string[]; value?: number; currency?: string }) => {
    fbPixel.track('AddPaymentInfo', data);
  },

  purchase: (data?: { content_ids?: string[]; value: number; currency: string; num_items?: number }) => {
    fbPixel.track('Purchase', data);
  },

  // Lead Events
  lead: (data?: { content_name?: string; value?: number; currency?: string }) => {
    fbPixel.track('Lead', data);
  },

  completeRegistration: (data?: { content_name?: string; value?: number; currency?: string; status?: string }) => {
    fbPixel.track('CompleteRegistration', data);
  },

  // Other Events
  contact: (data?: { content_name?: string }) => {
    fbPixel.track('Contact', data);
  },

  submitApplication: (data?: { content_name?: string }) => {
    fbPixel.track('SubmitApplication', data);
  },

  pageView: () => {
    fbPixel.track('PageView');
  },
};

/**
 * Google Analytics Tracking Helpers
 */
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

export const gtag = {
  event: (eventName: string, eventParams?: Record<string, any>) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', eventName, eventParams);
    }
  },

  pageView: (url: string) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', process.env.NEXT_PUBLIC_GA_ID || '', {
        page_path: url,
      });
    }
  },

  // E-commerce Events
  purchase: (transactionId: string, value: number, currency: string, items: any[]) => {
    gtag.event('purchase', {
      transaction_id: transactionId,
      value: value,
      currency: currency,
      items: items,
    });
  },

  addToCart: (value: number, currency: string, items: any[]) => {
    gtag.event('add_to_cart', {
      value: value,
      currency: currency,
      items: items,
    });
  },

  viewItem: (value: number, currency: string, items: any[]) => {
    gtag.event('view_item', {
      value: value,
      currency: currency,
      items: items,
    });
  },

  beginCheckout: (value: number, currency: string, items: any[]) => {
    gtag.event('begin_checkout', {
      value: value,
      currency: currency,
      items: items,
    });
  },
};

/**
 * TikTok Pixel Tracking Helpers
 */
declare global {
  interface Window {
    ttq?: {
      track: (eventName: string, data?: Record<string, any>) => void;
      page: () => void;
      identify: (data: Record<string, any>) => void;
    };
  }
}

export const ttqPixel = {
  track: (eventName: string, data?: Record<string, any>) => {
    if (typeof window !== 'undefined' && window.ttq) {
      window.ttq.track(eventName, data);
    }
  },

  page: () => {
    if (typeof window !== 'undefined' && window.ttq) {
      window.ttq.page();
    }
  },

  // E-commerce Events
  viewContent: (data?: { content_id?: string; content_type?: string; content_name?: string; value?: number; currency?: string }) => {
    ttqPixel.track('ViewContent', data);
  },

  addToCart: (data?: { content_id?: string; content_type?: string; content_name?: string; value?: number; currency?: string; quantity?: number }) => {
    ttqPixel.track('AddToCart', data);
  },

  initiateCheckout: (data?: { content_id?: string; value?: number; currency?: string; quantity?: number }) => {
    ttqPixel.track('InitiateCheckout', data);
  },

  completePayment: (data?: { content_id?: string; value: number; currency: string; quantity?: number }) => {
    ttqPixel.track('CompletePayment', data);
  },

  search: (data?: { search_string?: string }) => {
    ttqPixel.track('Search', data);
  },
};

/**
 * Universal tracker - tracks across all enabled platforms
 */
export const trackEvent = {
  pageView: (url?: string) => {
    fbPixel.pageView();
    if (url) gtag.pageView(url);
    ttqPixel.page();
  },

  viewContent: (productId: string, productName: string, value?: number, currency: string = 'VND') => {
    fbPixel.viewContent({
      content_ids: [productId],
      content_name: productName,
      content_type: 'product',
      value,
      currency,
    });

    if (value) {
      gtag.viewItem(value, currency, [{
        item_id: productId,
        item_name: productName,
      }]);
    }

    ttqPixel.viewContent({
      content_id: productId,
      content_name: productName,
      content_type: 'product',
      value,
      currency,
    });
  },

  addToCart: (productId: string, productName: string, value: number, currency: string = 'VND', quantity: number = 1) => {
    fbPixel.addToCart({
      content_ids: [productId],
      content_name: productName,
      content_type: 'product',
      value,
      currency,
    });

    gtag.addToCart(value, currency, [{
      item_id: productId,
      item_name: productName,
      quantity,
      price: value,
    }]);

    ttqPixel.addToCart({
      content_id: productId,
      content_name: productName,
      content_type: 'product',
      value,
      currency,
      quantity,
    });
  },

  initiateCheckout: (value: number, currency: string = 'VND', items: any[]) => {
    fbPixel.initiateCheckout({
      content_ids: items.map(item => item.id),
      num_items: items.length,
      value,
      currency,
    });

    gtag.beginCheckout(value, currency, items.map(item => ({
      item_id: item.id,
      item_name: item.name,
      quantity: item.quantity,
      price: item.price,
    })));

    ttqPixel.initiateCheckout({
      value,
      currency,
      quantity: items.length,
    });
  },

  purchase: (orderId: string, value: number, currency: string = 'VND', items: any[]) => {
    fbPixel.purchase({
      content_ids: items.map(item => item.id),
      value,
      currency,
      num_items: items.length,
    });

    gtag.purchase(orderId, value, currency, items.map(item => ({
      item_id: item.id,
      item_name: item.name,
      quantity: item.quantity,
      price: item.price,
    })));

    ttqPixel.completePayment({
      value,
      currency,
      quantity: items.length,
    });
  },

  search: (searchTerm: string) => {
    fbPixel.search({
      search_string: searchTerm,
    });

    gtag.event('search', {
      search_term: searchTerm,
    });

    ttqPixel.search({
      search_string: searchTerm,
    });
  },

  completeRegistration: (method?: string) => {
    fbPixel.completeRegistration({
      content_name: 'Registration',
      status: 'completed',
    });

    gtag.event('sign_up', {
      method: method || 'email',
    });
  },

  contact: () => {
    fbPixel.contact({
      content_name: 'Contact Form',
    });

    gtag.event('generate_lead', {
      value: 0,
      currency: 'VND',
    });
  },
};
