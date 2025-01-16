const form = document.getElementById('shortenForm');
const urlInput = document.getElementById('urlInput');
const resultDiv = document.getElementById('result');
const totalLinks = document.getElementById('totalLinks');
const mostShortenedUrl = document.getElementById('mostShortenedUrl');
const totalClicks = document.getElementById('totalClicks');

document.addEventListener('DOMContentLoaded', () => {
    fetchStats(); // Statistiken abrufen, sobald die Seite geladen wurde
  });

// Event Listener für die URL-Kürzung
form.addEventListener('submit', async (e) => {
    e.preventDefault(); // Verhindert das Neuladen der Seite
    console.log('Form submitted');

    const longUrl = urlInput.value;
    if (!longUrl) return;

    try {
    const response = await fetch('http://localhost:5000/shorten', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: longUrl }),
    });

    if (response.ok) {
        const data = await response.json();
        const shortUrl = data.shorten_url;
        console.log('Short URL:', shortUrl);

        resultDiv.innerHTML = `Shortened URL: <a href="${shortUrl}" target="_blank">${shortUrl}</a>`;
    } else {
        const error = await response.json();
        resultDiv.innerHTML = `Error: ${error.error}`;
    }
    } catch (error) {
    resultDiv.innerHTML = `Error: Could not connect to the server.`;
    }
});

setInterval(() => {
    console.log('Auto-updating stats...');
    fetchStats();
    }, 30000); // 30.000 Millisekunden = 30 Sekunden

async function fetchStats() {
    try {
        // Total Links
        const totalLinksResponse = await fetch('http://localhost:5000/stats/total_links');
        const totalLinksData = await totalLinksResponse.json();
        totalLinks.textContent = totalLinksData.total_links;
    
        // Most Clicked Shortlink
        const mostClickedResponse = await fetch('http://localhost:5000/stats/most_clicked');
        const mostClickedData = await mostClickedResponse.json();
        if (mostClickedData.short_url) {
            totalClicks.innerHTML = `<a href="http://localhost:5000/${mostClickedData.short_url}" target="_blank">${mostClickedData.short_url}</a> (${mostClickedData.click_count} clicks)`;
        } else {
        totalClicks.textContent = "No data available";
        }
    
    }
catch (error) {
    totalLinks.textContent = "Error";
    mostShortenedUrl.textContent = "Error";
    totalClicks.textContent = "Error";
    }
}

  