addEventListener('fetch', event => {
      event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
      const url = new URL(request.url)

      let targetUrl = url.searchParams.get('url')

      if (!targetUrl) {
            const pathname = url.pathname.slice(1)
            if (pathname) {
                  targetUrl = pathname + url.search
            }
      }

      if (!targetUrl) {
            return new Response(
                  JSON.stringify({ error: 'No URL provided. Use ?url=https://example.com or /https://example.com' }),
                  {
                        status: 400,
                        headers: {
                              'Content-Type': 'application/json',
                              'Access-Control-Allow-Origin': '*',
                              'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                              'Access-Control-Allow-Headers': 'Content-Type'
                        }
                  }
            )
      }

      if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
            targetUrl = 'https://' + targetUrl
      }

      try {
            const response = await fetch(targetUrl, {
                  method: request.method,
                  headers: request.headers,
                  body: request.body
            })

            const corsHeaders = {
                  'Access-Control-Allow-Origin': '*',
                  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                  'Access-Control-Max-Age': '86400'
            }

            if (request.method === 'OPTIONS') {
                  return new Response(null, {
                        status: 200,
                        headers: corsHeaders
                  })
            }

            const newResponse = new Response(response.body, response)

            Object.keys(corsHeaders).forEach(key => {
                  newResponse.headers.set(key, corsHeaders[key])
            })

            return newResponse
      } catch (error) {
            return new Response(
                  JSON.stringify({ error: 'Failed to fetch: ' + error.message }),
                  {
                        status: 500,
                        headers: {
                              'Content-Type': 'application/json',
                              'Access-Control-Allow-Origin': '*',
                              'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                              'Access-Control-Allow-Headers': 'Content-Type'
                        }
                  }
            )
      }
}