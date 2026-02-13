addEventListener('fetch', event => {
      event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
      let url = new URL(request.url);

      // Change the hostname to your backend service
      url.hostname = "proxy.aiyyer.xyz"; // Replace with your backend domain
      url.protocol = "https"; // Ensures secure connection

      // Create a new request preserving method and headers
      let newRequest = new Request(url, request);

      // Fetch and return the response from your backend
      return fetch(newRequest);
}