const express = require("express");
require("dotenv").config();
const cors = require("cors");

// Routes
const authRoutes = require("./routes/auth");
const batchRoutes = require("./routes/batch");
const eventRoutes = require("./routes/event");
const qrRoutes = require("./routes/qr");

// Pinata helper
const { uploadJSONToPinata } = require("./pinata");

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Health Check
app.get("/", (req, res) => {
  res.send("Agri Backend Running ✔");
});

// --- TEST PINATA ROUTE (Optional) ---
app.get("/test-pinata", async (req, res) => {
  try {
    const hash = await uploadJSONToPinata({
      message: "Pinata test successful",
      timestamp: new Date(),
    });

    return res.json({
      success: true,
      ipfsHash: hash,
      url: `https://blue-icy-chimpanzee-709.mypinata.cloud/ipfs/${hash}`
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- API ROUTES ---
app.use("/auth", authRoutes);     // Register & Login
app.use("/batch", batchRoutes);   // Create batch, list batches
app.use("/event", eventRoutes);   // Add events to batch
app.use("/qr", qrRoutes);         // Generate and verify QR codes

// Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});