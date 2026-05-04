const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const PIXEL_ID = "7633422565775720465";
const TIKTOK_EVENTS_URL = "https://business-api.tiktok.com/open_api/v1.3/event/track/";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const accessToken = Deno.env.get("TIKTOK_ACCESS_TOKEN");
  if (!accessToken) {
    console.error("TIKTOK_ACCESS_TOKEN not configured");
    return new Response(JSON.stringify({ error: "Token not configured" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const body = await req.json();
    const { event, url, referrer, userAgent, properties, utm } = body;

    if (!event) {
      return new Response(JSON.stringify({ error: "event is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const eventData: Record<string, any> = {
      event: event,
      event_time: Math.floor(Date.now() / 1000),
      event_id: crypto.randomUUID(),
      page: {
        url: url || "",
        referrer: referrer || "",
      },
    };

    if (userAgent) {
      eventData.user = { ...eventData.user, user_agent: userAgent };
    }

    // Add UTM params as context
    if (utm) {
      eventData.page.url_params = utm;
    }

    // Add properties (value, currency, content_type, etc.)
    if (properties) {
      eventData.properties = {
        currency: properties.currency || "BRL",
        content_type: properties.content_type || "product",
      };
      if (properties.value !== undefined) {
        eventData.properties.value = String(properties.value);
      }
      if (properties.content_id) {
        eventData.properties.contents = [
          {
            content_id: properties.content_id,
            content_name: properties.content_name || "",
            content_type: "product",
            quantity: 1,
            price: properties.value || 0,
          },
        ];
      }
    }

    const payload = {
      pixel_code: PIXEL_ID,
      event_source: "web",
      event_source_id: PIXEL_ID,
      data: [eventData],
    };

    console.log(`Sending TikTok event: ${event}`);

    const res = await fetch(TIKTOK_EVENTS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Token": accessToken,
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(10000),
    });

    const data = await res.json();
    console.log(`TikTok API response: ${res.status}`, JSON.stringify(data));

    return new Response(JSON.stringify({ success: true, tiktok: data }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("TikTok Events error:", error);
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
