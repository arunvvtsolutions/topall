import CryptoJS from 'crypto-js';

const SECRET_KEY = process.env.ENCRYPTION_KEY || 'your-secret-key'; // Keep this secure

// Function to encrypt ID
export const encryptId = (id: number | string): string => {
  return CryptoJS.AES.encrypt(id.toString(), SECRET_KEY).toString();
};

// Function to decrypt ID
export const decryptId = (encryptedId: string): string => {
  const bytes = CryptoJS.AES.decrypt(encryptedId, SECRET_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};
