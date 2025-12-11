import QRCode from "qrcode";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const QR_DIR = path.join(__dirname, "..", "public", "qrcodes");

if (!fs.existsSync(QR_DIR)) fs.mkdirSync(QR_DIR, { recursive: true });

export async function generateQRFile(url, token) {
  const filePath = path.join(QR_DIR, `${token}.png`);
  const qrData = await QRCode.toDataURL(url);

  const base64 = qrData.split(",")[1];
  fs.writeFileSync(filePath, base64, "base64");

  return `${process.env.BASE_URL}/public/qrcodes/${token}.png`;
}
