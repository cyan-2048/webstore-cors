// taken from here https://github.com/ConzorKingKong/cors-preflight-template

/**
 * This snippet supports requests with GET, POST, HEAD, or OPTIONS methods from any origin.
 * These requests are able to view the Content-Type header only.
 * Change the corHeaders below to modify the type of requests and headers
 * to accept
 */
const allowedMethods = "GET, OPTIONS";
const corsHeaders = {
  "Access-Control-Allow-Origin": "https://store.bananahackers.net",
  "Access-Control-Allow-Methods": allowedMethods,
  "Access-Control-Allow-Headers": "Content-Type",
};

function handleOptions(request) {
  if (
    request.headers.get("Origin") !== null &&
    request.headers.get("Access-Control-Request-Method") !== null &&
    allowedMethods.includes(
      request.headers.get("Access-Control-Request-Method")
    ) &&
    request.headers.get("Access-Control-Request-Headers") !== null
  ) {
    // Handle CORS pre-flight request.
    return new Response(null, {
      headers: corsHeaders,
    });
  } else {
    // Handle standard OPTIONS request.
    return new Response(null, {
      headers: {
        Allow: allowedMethods,
      },
    });
  }
}

/**
 *
 * @param {Request} request
 * @returns
 */
async function handleRequest(request) {
  if (request.method === "OPTIONS") {
    return handleOptions(request);
  } else if (allowedMethods.includes(request.method)) {
    // Pass-through to origin.

    const u = new URL(request.url);

    const url = u.searchParams.get("url");

    if (url) {
      try {
        const resp = await fetch(url, {
          headers: {
            Accept: "application/json",
          },
        });

        if (resp.ok) {
          const json = await resp.json();

          return new Response(JSON.stringify(json), {
            "Content-Type": "application/json",
            ...corsHeaders,
          });
        }
      } catch {}
    }

    return new Response(null, { status: 404 });
  }

  return new Response(null, {
    status: 405,
    statusText: "Method Not Allowed",
  });
}

addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request));
});
