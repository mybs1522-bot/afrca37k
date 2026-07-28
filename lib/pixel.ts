declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
    _fbq?: any;
  }
}

const META_PIXEL_ID = '2219202925544751';
const META_ACCESS_TOKEN = 'EAADE6Lnxf9MBSBGvJs8oC06YIuc1y8siRWiu9fE7JcU2oxpZCYS2Cxwwj28xyTCQJfgSwzZA7CwyqgG1ZC7hBHbedUBt2a2QhtZCGGj0nGiFJBUIAcBijaZBmZBDZBQNzTqbzamWrYd49gxPErYbF3DodmnZBruCm2nuE9bMLZCg27N1nNHybbKZCYg9IC6LN0nNEP3QZDZD';

/**
 * SHA-256 Hashing helper for Meta CAPI compliance
 */
export const sha256 = async (str: string): Promise<string> => {
  if (!str) return '';
  const text = str.trim().toLowerCase();
  if (!text) return '';
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  } catch (err) {
    return '';
  }
};

/**
 * Cookie extraction helper for _fbp and _fbc
 */
const getCookie = (name: string): string | undefined => {
  if (typeof document === 'undefined') return undefined;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
  return undefined;
};

/**
 * Generates a unique event ID for Meta Browser + Server Deduplication
 */
export const generateEventId = (prefix: string = 'evt'): string => {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
};

/**
 * Sends a server-side Conversions API (CAPI) event directly to Meta Graph API
 */
export const sendCapiEvent = async (
  eventName: string,
  eventId: string,
  customData?: Record<string, any>,
  userData?: { email?: string; phone?: string; name?: string }
) => {
  try {
    const eventTime = Math.floor(Date.now() / 1000);
    const fbp = getCookie('_fbp');
    const fbc = getCookie('_fbc');

    const hashedEmail = userData?.email ? await sha256(userData.email) : undefined;
    const hashedPhone = userData?.phone ? await sha256(userData.phone) : undefined;
    const hashedFirstName = userData?.name ? await sha256(userData.name.split(' ')[0]) : undefined;
    const hashedLastName = userData?.name && userData.name.split(' ').length > 1 
      ? await sha256(userData.name.split(' ').slice(1).join(' ')) 
      : undefined;

    const payload = {
      data: [
        {
          event_name: eventName,
          event_time: eventTime,
          event_id: eventId,
          event_source_url: typeof window !== 'undefined' ? window.location.href : '',
          action_source: 'website',
          user_data: {
            em: hashedEmail ? [hashedEmail] : undefined,
            ph: hashedPhone ? [hashedPhone] : undefined,
            fn: hashedFirstName ? [hashedFirstName] : undefined,
            ln: hashedLastName ? [hashedLastName] : undefined,
            fbp: fbp || undefined,
            fbc: fbc || undefined,
            client_user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined
          },
          custom_data: customData
        }
      ]
    };

    const endpoint = `https://graph.facebook.com/v19.0/${META_PIXEL_ID}/events?access_token=${encodeURIComponent(META_ACCESS_TOKEN)}`;

    fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    }).catch(err => {
      console.warn('CAPI dispatch notice:', err);
    });
  } catch (err) {
    // Fail gracefully
  }
};

/**
 * Universal Meta Event Dispatcher (Fires Browser Pixel + Server CAPI with Deduplication)
 */
export const trackEvent = (
  eventName: string,
  customData?: Record<string, any>,
  userData?: { email?: string; phone?: string; name?: string },
  customEventId?: string
) => {
  const eventId = customEventId || generateEventId(eventName.toLowerCase());

  // 1. Fire Browser Meta Pixel with eventID for deduplication
  if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
    if (customData) {
      window.fbq('track', eventName, customData, { eventID: eventId });
    } else {
      window.fbq('track', eventName, {}, { eventID: eventId });
    }
  }

  // 2. Dispatch Server CAPI Event with exact same event_id
  sendCapiEvent(eventName, eventId, customData, userData);

  return eventId;
};

/**
 * Standard Meta Pixel Events
 */

// 1. PageView
export const trackPageView = () => {
  return trackEvent('PageView');
};

// 2. ViewContent
export const trackViewContent = (params?: { content_name?: string; content_category?: string; value?: number; currency?: string }) => {
  return trackEvent('ViewContent', {
    content_name: 'Avada 12-Course Architecture Bundle',
    content_category: 'Architecture & 3D Design Education',
    value: 37000,
    currency: 'NGN',
    ...params
  });
};

// 3. InitiateCheckout
export const trackInitiateCheckout = (params?: { content_name?: string; value?: number; currency?: string; num_items?: number }) => {
  return trackEvent('InitiateCheckout', {
    content_name: 'Avada 12-Course Architecture Bundle',
    value: 37000,
    currency: 'NGN',
    num_items: 12,
    ...params
  });
};

// 4. Lead
export const trackLead = (params?: { content_name?: string; value?: number; currency?: string }, userData?: { email?: string; phone?: string; name?: string }) => {
  return trackEvent('Lead', {
    content_name: 'Avada Course Student Lead',
    value: 37000,
    currency: 'NGN',
    ...params
  }, userData);
};

// 5. AddPaymentInfo
export const trackAddPaymentInfo = (params?: { content_name?: string; value?: number; currency?: string }, userData?: { email?: string; phone?: string; name?: string }) => {
  return trackEvent('AddPaymentInfo', {
    content_name: 'Avada 12-Course Architecture Bundle',
    value: 37000,
    currency: 'NGN',
    ...params
  }, userData);
};

// 6. Purchase
export const trackPurchase = (params?: { value?: number; currency?: string; content_name?: string; transaction_id?: string }, userData?: { email?: string; phone?: string; name?: string }) => {
  return trackEvent('Purchase', {
    value: 37000,
    currency: 'NGN',
    content_name: 'Avada 12-Course Architecture Bundle',
    ...params
  }, userData);
};

// 7. CompleteRegistration
export const trackCompleteRegistration = (params?: { content_name?: string; status?: boolean }, userData?: { email?: string; phone?: string; name?: string }) => {
  return trackEvent('CompleteRegistration', {
    content_name: 'Avada Student Access',
    status: true,
    ...params
  }, userData);
};

// 8. Contact
export const trackContact = (params?: { method?: string; content_name?: string }) => {
  return trackEvent('Contact', {
    method: 'WhatsApp',
    content_name: 'WhatsApp Support',
    ...params
  });
};

// 9. AddToCart
export const trackAddToCart = (params?: { content_name?: string; value?: number; currency?: string }) => {
  return trackEvent('AddToCart', {
    content_name: 'Avada Architecture Course',
    value: 37000,
    currency: 'NGN',
    ...params
  });
};

// 10. AddToWishlist
export const trackAddToWishlist = (params?: { content_name?: string }) => {
  return trackEvent('AddToWishlist', {
    content_name: 'Avada Architecture Course',
    ...params
  });
};

// 11. Search
export const trackSearch = (search_string?: string) => {
  return trackEvent('Search', { search_string });
};

// 12. Schedule
export const trackSchedule = (params?: Record<string, any>) => {
  return trackEvent('Schedule', params);
};

// 13. StartTrial
export const trackStartTrial = (params?: { value?: string | number; currency?: string; predicted_ltv?: string | number }) => {
  return trackEvent('StartTrial', {
    value: '0.00',
    currency: 'USD',
    predicted_ltv: '0.00',
    ...params
  });
};

// 14. SubmitApplication
export const trackSubmitApplication = (params?: Record<string, any>, userData?: { email?: string; phone?: string; name?: string }) => {
  return trackEvent('SubmitApplication', params, userData);
};

// 15. Subscribe
export const trackSubscribe = (params?: { value?: string | number; currency?: string; predicted_ltv?: string | number }) => {
  return trackEvent('Subscribe', {
    value: '37000',
    currency: 'NGN',
    predicted_ltv: '37000',
    ...params
  });
};

// 16. CustomizeProduct
export const trackCustomizeProduct = (params?: Record<string, any>) => {
  return trackEvent('CustomizeProduct', params);
};

// 17. Donate
export const trackDonate = (params?: Record<string, any>) => {
  return trackEvent('Donate', params);
};

// 18. FindLocation
export const trackFindLocation = (params?: Record<string, any>) => {
  return trackEvent('FindLocation', params);
};
