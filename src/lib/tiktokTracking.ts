// TikTok Pixel + Server-side Events API tracking
const PIXEL_ID = "7633422565775720465";

declare global {
  interface Window {
    ttq: any;
    TiktokAnalyticsObject: string;
  }
}

// SHA-256 hash for advanced matching
async function sha256(value: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(value.trim().toLowerCase());
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// Initialize TikTok Pixel (called once)
export function initTikTokPixel() {
  if (window.ttq) return;

  // TikTok Pixel base code
  const w = window as any;
  const d = document;
  const t = "ttq";
  w.TiktokAnalyticsObject = t;
  const ttq = (w[t] = w[t] || []);
  ttq.methods = [
    "page", "track", "identify", "instances", "debug", "on", "off",
    "once", "ready", "alias", "group", "enableCookie", "disableCookie",
    "holdConsent", "revokeConsent", "grantConsent",
  ];
  ttq.setAndDefer = function (t: any, e: string) {
    t[e] = function () {
      t.push([e].concat(Array.prototype.slice.call(arguments, 0)));
    };
  };
  for (let i = 0; i < ttq.methods.length; i++) {
    ttq.setAndDefer(ttq, ttq.methods[i]);
  }
  ttq.instance = function (e: string) {
    const n = ttq._i[e] || [];
    for (let o = 0; o < ttq.methods.length; o++) {
      ttq.setAndDefer(n, ttq.methods[o]);
    }
    return n;
  };
  ttq.load = function (e: string, n?: number) {
    const r = "https://analytics.tiktok.com/i18n/pixel/events.js";
    const o = n ? "?sdkid=" + n + "&lib=" + e : "?s=1&lib=" + e;
    ttq._i = ttq._i || {};
    ttq._i[e] = [];
    ttq._i[e]._u = r + o;
    ttq._t = ttq._t || {};
    ttq._t[e] = +new Date();
    ttq._o = ttq._o || {};
    ttq._o[e] = n || {};
    const script = d.createElement("script");
    script.type = "text/javascript";
    script.async = true;
    script.src = r + o;
    const first = d.getElementsByTagName("script")[0];
    first.parentNode?.insertBefore(script, first);
  };

  ttq.load(PIXEL_ID);
  ttq.page();
}

// Browser-side PageView
export function tiktokPageView() {
  if (window.ttq) {
    window.ttq.page();
  }
  tiktokServerEvent("PageView");
}

// Browser-side Identify (advanced matching)
export async function tiktokIdentify(email?: string, phone?: string) {
  if (!window.ttq) return;
  const identifyData: Record<string, string> = {};
  if (email) identifyData.sha256_email = await sha256(email);
  if (phone) identifyData.sha256_phone_number = await sha256(phone.replace(/\D/g, ""));
  if (Object.keys(identifyData).length > 0) {
    window.ttq.identify(identifyData);
  }
}

// Browser-side InitiateCheckout
export function tiktokInitiateCheckout(value: number, contentId: string, contentName: string) {
  if (window.ttq) {
    window.ttq.track("InitiateCheckout", {
      value,
      currency: "BRL",
      content_type: "product",
      content_id: contentId,
      content_name: contentName,
      quantity: 1,
    });
  }
  tiktokServerEvent("InitiateCheckout", {
    value,
    currency: "BRL",
    content_type: "product",
    content_id: contentId,
    content_name: contentName,
  });
}

// Browser-side CompletePayment
export function tiktokCompletePayment(value: number, contentId: string, contentName: string) {
  if (window.ttq) {
    window.ttq.track("CompletePayment", {
      value,
      currency: "BRL",
      content_type: "product",
      content_id: contentId,
      content_name: contentName,
      quantity: 1,
    });
  }
  tiktokServerEvent("CompletePayment", {
    value,
    currency: "BRL",
    content_type: "product",
    content_id: contentId,
    content_name: contentName,
  });
}

// Server-side event via Edge Function
export function tiktokServerEvent(eventName: string, properties?: Record<string, any>) {
  const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
  if (!projectId) return;

  const url = `https://${projectId}.supabase.co/functions/v1/tiktok-events`;
  const params = new URLSearchParams(window.location.search);
  const utmParams: Record<string, string> = {};
  params.forEach((v, k) => { utmParams[k] = v; });

  const payload = {
    event: eventName,
    url: window.location.href,
    referrer: document.referrer,
    userAgent: navigator.userAgent,
    properties: {
      ...properties,
      currency: "BRL",
      content_type: "product",
    },
    utm: Object.keys(utmParams).length > 0 ? utmParams : undefined,
  };

  fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }).catch(() => {});
}
