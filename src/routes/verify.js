const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { sha256 } = require("../utils");

router.get("/batch/:id", async (req, res) => {
  const batch = await prisma.batch.findUnique({
    where: { id: Number(req.params.id) },
    include: { events: true }
  });

  if (!batch) return res.status(404).json({ error: "Batch not found" });

  // Verify batch hash
  const recalculatedBatchHash = sha256({
    product: batch.product,
    totalQty: batch.totalQty,
    timestamp: batch.createdAt.getTime() // or original stored timestamp
  });

  // Verify event chain
  let validChain = true;
  let prevHash = null;

  for (const ev of batch.events) {
    const recalculatedEventHash = sha256({
      batchId: ev.batchId,
      type: ev.type,
      details: ev.details,
      quantity: ev.quantity,
      timestamp: ev.createdAt.getTime(),
      previousHash: prevHash
    });

    if (recalculatedEventHash !== ev.eventHash) validChain = false;

    prevHash = ev.eventHash;
  }

  res.json({
    success: true,
    batchHashValid: batch.batchHash === recalculatedBatchHash,
    eventChainValid: validChain,
    batch,
  });
});

module.exports = router;