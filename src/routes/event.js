import express from "express";
import multer from "multer";
import { PrismaClient } from "@prisma/client";
import { sha256 } from "../utils.js";
import { uploadFileToPinata } from "../pinata.js";

const router = express.Router();
const prisma = new PrismaClient();
const upload = multer({ dest: "uploads/" });

router.post("/add/:batchId", upload.fields([
    { name: "documents" },
    { name: "photos" }
]), async (req, res) => {
    try {
        const batchId = Number(req.params.batchId);

        const {
            eventType,
            description,
            location,
            timestamp,
            actor,
            temperature,
            humidity,
            notes
        } = req.body;

        let documentCIDs = [];
        let photoCIDs = [];

        if (req.files.documents) {
            for (let file of req.files.documents) {
                const cid = await uploadFileToPinata(file.path);
                documentCIDs.push(cid);
            }
        }

        if (req.files.photos) {
            for (let photo of req.files.photos) {
                const cid = await uploadFileToPinata(photo.path);
                photoCIDs.push(cid);
            }
        }

        const meta = {
            batchId,
            eventType,
            description,
            location,
            timestamp,
            actor,
            temperature,
            humidity,
            notes,
            documentCIDs,
            photoCIDs
        };

        const hash = sha256(meta);

        const previousEvent = await prisma.event.findFirst({
            where: { batchId },
            orderBy: { id: "desc" }
        });

        const event = await prisma.event.create({
            data: {
                batchId,
                eventType,
                description,
                location,
                timestamp,
                actor,
                temperature,
                humidity,
                notes,
                documents: documentCIDs,
                photos: photoCIDs,
                eventHash: hash,
                previousEventHash: previousEvent ? previousEvent.eventHash : null
            }
        });

        res.json({ success: true, event });

    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, error: err.message });
    }
});

export default router;
