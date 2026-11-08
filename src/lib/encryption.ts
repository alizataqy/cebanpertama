import crypto from "crypto";

const IV_LENGTH = 16; // For AES, this is always 16

function getEncryptionKey(): string {
  const rawKey = process.env.ENCRYPTION_KEY;
  if (!rawKey && process.env.NODE_ENV === "production") {
    throw new Error("ENCRYPTION_KEY environment variable is required in production.");
  }
  return rawKey || "a-very-secure-key-32-chars-long!!";
}

export function encrypt(text: string): string {
  if (!text) return "";
  try {
    const key = crypto.createHash("sha256").update(getEncryptionKey()).digest();
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString("hex") + ":" + encrypted.toString("hex");
  } catch (error) {
    console.error("Gagal enkripsi:", error);
    return text;
  }
}

export function decrypt(text: string): string {
  if (!text) return "";
  try {
    const parts = text.split(":");
    if (parts.length < 2) return text; // Bukan teks terenkripsi yang valid

    const iv = Buffer.from(parts.shift() || "", "hex");
    const encryptedText = Buffer.from(parts.join(":"), "hex");
    const key = crypto.createHash("sha256").update(getEncryptionKey()).digest();
    const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
  } catch (error) {
    console.error("Gagal melakukan dekripsi:", error);
    return text; // Fallback jika gagal dekripsi
  }
}
