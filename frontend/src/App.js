import React, { useEffect, useState } from "react";

function App() {

  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [analytics, setAnalytics] = useState([]);

  const generateShortUrl = async () => {

    if (!url) {
      alert("Please enter a URL");
      return;
    }

    try {

      const response = await fetch("http://localhost:5000/shorten", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          originalUrl: url
        })
      });

      const data = await response.json();

      setShortUrl(data.shortUrl);

      fetchAnalytics();

    } catch (error) {
      console.log(error);
    }
  };

  const fetchAnalytics = async () => {

    try {

      const response = await fetch("http://localhost:5000/analytics/all");

      const data = await response.json();

      setAnalytics(data);

    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  return (
    <div
      style={{
        fontFamily: "Arial",
        maxWidth: "800px",
        margin: "auto",
        padding: "40px"
      }}
    >
      <h1>Dockerized URL Shortener</h1>

      <input
        type="text"
        placeholder="Enter your long URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        style={{
          width: "100%",
          padding: "12px",
          marginTop: "20px"
        }}
      />

      <button
        onClick={generateShortUrl}
        style={{
          marginTop: "20px",
          padding: "12px 20px",
          cursor: "pointer"
        }}
      >
        Generate Short URL
      </button>

      {shortUrl && (
        <div style={{ marginTop: "30px" }}>
          <h3>Short URL</h3>

          <a
            href={shortUrl}
            target="_blank"
            rel="noreferrer"
          >
            {shortUrl}
          </a>
        </div>
      )}

      <div style={{ marginTop: "50px" }}>
        <h2>Analytics</h2>

        <table
          border="1"
          cellPadding="10"
          width="100%"
        >
          <thead>
            <tr>
              <th>Short Code</th>
              <th>Clicks</th>
            </tr>
          </thead>

          <tbody>
            {analytics.map((item, index) => (
              <tr key={index}>
                <td>{item.short_code}</td>
                <td>{item.clicks}</td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  );
}

export default App;
