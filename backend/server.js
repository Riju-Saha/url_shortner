const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const shortid = require("shortid");

const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "urlshortener"
});

db.connect((err) => {
  if (err) {
    console.log("Database connection failed");
    console.log(err);
  } else {
    console.log("MySQL Connected");
  }
});

// Create short URL
app.post("/shorten", (req, res) => {
  const { originalUrl } = req.body;

  if (!originalUrl) {
    return res.status(400).json({
      message: "URL is required"
    });
  }

  const shortCode = shortid.generate();

  const sql = `
    INSERT INTO urls (original_url, short_code, clicks)
    VALUES (?, ?, 0)
  `;

  db.query(sql, [originalUrl, shortCode], (err) => {
    if (err) {
      console.log(err);

      return res.status(500).json({
        message: "Database Error"
      });
    }

    res.json({
      shortUrl: `http://localhost:5000/${shortCode}`
    });
  });
});

// Redirect URL
app.get("/:shortCode", (req, res) => {
  const { shortCode } = req.params;

  const sql = `
    SELECT * FROM urls
    WHERE short_code = ?
  `;

  db.query(sql, [shortCode], (err, results) => {

    if (err) {
      return res.status(500).send("Server Error");
    }

    if (results.length === 0) {
      return res.status(404).send("URL not found");
    }

    const urlData = results[0];

    const updateSql = `
      UPDATE urls
      SET clicks = clicks + 1
      WHERE short_code = ?
    `;

    db.query(updateSql, [shortCode]);

    res.redirect(urlData.original_url);
  });
});

// Analytics
app.get("/analytics/all", (req, res) => {

  const sql = `
    SELECT *
    FROM urls
    ORDER BY clicks DESC
  `;

  db.query(sql, (err, results) => {

    if (err) {
      return res.status(500).send("Server Error");
    }

    res.json(results);
  });
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
