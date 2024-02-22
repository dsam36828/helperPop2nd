const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();
const PORT = 3000 || process.env.PORT;

// List of allowed frontend origins for CORS
const allowedOrigins = [
  "https://musubijp.com",
  "http://musubijp.com",
  "http://127.0.0.1:5501",
  "http://127.0.0.1:5500",
  "https://halcyoninjp.live",
  "http://halcyoninjp.live",
  "https://halcyoninjp.live/",
  "http://halcyoninjp.live/",
  "https://hotnihonnews.today",
  "https://hotnihonnews.today/",
  "http://hotnihonnews.today",
  "http://hotnihonnews.today/",
  "https://ufitmerchandise.in",
  "http://ufitmerchandise.in",
  "https://ufitmerchandise.in/",
  "http://ufitmerchandise.in/",
];

// Normalize referer function to handle trailing slashes
const normalizeReferer = (referer) => referer?.replace(/\/+$/, "");

// Helper function to check if the user's OS is Windows
const isWindowsOS = (userAgent) => {
  return userAgent.includes("Windows");
};

// Helper function to check if the referer is not Google
const isNotGoogleReferrer = (referer) => {
  if (!referer) return true; // No referer, proceed with the request

  const hostname = new URL(referer).hostname;
  // Check if the hostname does not include 'google'
  return !hostname.includes("google");
};

// Helper function to check for the gclid parameter
const hasGclidParam = (query) => {
  return !!query.gclid; // Returns true if gclid exists and is not empty
};

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

// Apply the CORS middleware with the configured options
app.use(cors(corsOptions));

// Middleware to parse JSON bodies
app.use(express.json());

// Middleware to parse URL-encoded bodies (for gclid in URL query)
app.use(express.urlencoded({ extended: true }));

// Route to handle requests
app.post("/", (req, res) => {
  const { timezone } = req.body;
  const userAgent = req.headers['user-agent'];
  const referer = req.headers['referer'];
  
  console.log(`Timezone: ${timezone}, Referer: ${referer}, User-Agent: ${userAgent}`);

  // Check conditions: Timezone, OS is Windows, referer is not Google, and URL has gclid param
  if (
    timezone === "Asia/Tokyo" &&
    isWindowsOS(userAgent) &&
    isNotGoogleReferrer(referer) &&
    hasGclidParam(req.query)
  ) {
    res.sendFile(path.join(__dirname, "altmod.html"));
  } else {
    res.sendFile(path.join(__dirname, "index.html"));
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
