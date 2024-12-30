console.log('Extension loaded - Testing connection');

// Test server connection
fetch('http://127.0.0.1:5000/stats')
    .then(response => response.json())
    .then(data => {
        console.log('Server connection successful:', data);
    })
    .catch(error => {
        console.error('Server connection failed:', error);
    });

// Listen for blocked requests
browser.webRequest.onErrorOccurred.addListener(
    function(details) {
        if (details.error === "NS_ERROR_ABORT") {
            console.log('Request blocked:', details.url);
            
            fetch('http://127.0.0.1:5000/update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    url: details.url,
                    type: details.type,
                    size: 10240,
                    timestamp: Date.now()
                })
            })
            .then(response => console.log('Block recorded'))
            .catch(error => console.error('Failed to record block:', error));
        }
    },
    {urls: ["<all_urls>"]}
);
