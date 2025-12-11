const express = require("express");
require("dotenv").config();

const batchRoutes = require("./routes/batch");
const eventRoutes = require("./routes/event");
const qrRoutes = require("./routes/qr");

const app = express();
app.use(express.json({ limit: "5mb" }));

// Simple health
app.get("/", (req, res) => res.send("Agri-backend running"));

// Test pinata small test route (optional)
const { uploadJSONToPinata } = require("./pinata");
app.get("/test-pinata", async (req, res) => {
  try {
    const hash = await uploadJSONToPinata({ test: "agri-trace", createdAt: new Date() });
    return res.json(hash);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

app.use("/batch", batchRoutes);
app.use("/event", eventRoutes);
app.use("/qr", qrRoutes);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));