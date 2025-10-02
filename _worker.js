// Cloudflare Pages "full worker" that serves MkDocs statics
// and proxies /apps/* to your Dash backend.

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Proxy all Dash routes
    if (url.pathname.startsWith('/apps/')) {
      // Configure your backend URL in Pages → Settings → Environment Variables
      // Example: DASH_BACKEND=https://mechanical-handbook-dash.onrender.com
      const backend = env.DASH_BACKEND; 
      const target = new URL(backend + url.pathname + url.search);

      // Pass through method, headers, and body
      const init = {
        method: request.method,
        headers: request.headers,
        body: ['GET','HEAD'].includes(request.method) ? undefined : request.body,
        redirect: 'follow',
      };

      const resp = await fetch(target, init);

      // (Optional) avoid caching dynamic responses
      const newHeaders = new Headers(resp.headers);
      newHeaders.set('Cache-Control', 'no-store');

      return new Response(resp.body, { status: resp.status, headers: newHeaders });
    }

    // Static MkDocs assets from the Pages bucket
    return env.ASSETS.fetch(request);
  }
}
