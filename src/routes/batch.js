const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { sha256 } = require("../utils");

router.post("/create", async (req, res) => {
  try {
    const { product, totalQty } = req.body;

    // 1. Metadata for hashing
    const meta = {
      product,
      totalQty,
      timestamp: Date.now()
    };

    // 2. Hash it
    const batchHash = sha256(meta);

    // 3. Create batch with hash stored
    const batch = await prisma.batch.create({
      data: {
        product,
        totalQty,
        batchHash,
        qrCode: `batch-${Date.now()}`
      }
    });

    res.json({
      success: true,
      batch,
      hash: batchHash
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;