import crypto from "crypto";
import bcrypt from "bcrypt";

const encryptionKey: Buffer = crypto.scryptSync('passphrase', 'salt', 32); // Deriving a secure encryption key using scrypt
const iv: Buffer = crypto.randomBytes(16); // 16 bytes for AES-256-GCM

type GenerationType = 'number' | 'string' | 'alphanumeric' | 'both';

function getRandomIndex(max: number): number {
  return Math.floor(Math.random() * max);
}

/**
 * Generates a random number of specified digits and type
 * @param {number} numberOfDigits - Number of digits to be generated
 * @param {GenerationType} type - Type of generation (number, string, alphanumeric, both)
 * @returns {string} - The generated random value
 */
function generateRandomNumber(numberOfDigits: number, type: GenerationType): string {
  try {
    const digits: string = '0123456789';
    const characters: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    const alphanumeric: string = digits + characters;
    let validCharacters: string = '';
    switch (type) {
      case 'number':
        validCharacters = digits;
        break;
      case 'string':
        validCharacters = characters;
        break;
      case 'alphanumeric':
        validCharacters = alphanumeric;
        break;
      case 'both':
        validCharacters = digits + characters;
        break;
      default:
        console.error("\x1b[31m", 'Invalid type of generation, valid types are: number, string, alphanumeric, both');
    }

    let randomNumber: string = '';
    for (let i = 0; i < numberOfDigits; i++) {
      const randomIndex = getRandomIndex(validCharacters.length);
      randomNumber += validCharacters[randomIndex];
    }

    return randomNumber;
  } catch (error: unknown) {
    console.error("\x1b[31m", `Error generating random number: ${error}`);
    throw new Error(error as string);
  }
}

/**
 * Encrypts the given plaintext password using bcrypt
 * @param {string} myPlaintextPassword - Text to be encrypted
 * @param {number} saltRounds - Number of rounds of encryption (more rounds = more secure, but slower to compute), recommended: 10 (default), max: 31
 * @returns {Promise<string>} - A one-way encryption of the password
 */
async function encryptPassword(myPlaintextPassword: string, saltRounds: number = 10): Promise<string> {
  try {
    const hash: string = await bcrypt.hash(myPlaintextPassword, saltRounds);
    return hash;
  } catch (error: unknown) {
    console.error("\x1b[31m", error as string);
    throw new Error(error as string);
  }
}

/**
 * Encrypts the given plaintext password using SHA-256
 * @param {string} myPlaintextPassword - Text to be encrypted
 * @returns {string} - The hashed password
 */
function permanentEncryptPassword(myPlaintextPassword: string): string {
  try {
    const hash = crypto.createHash('sha256');
    const data = hash.update(myPlaintextPassword, 'utf-8')
    const digest: string = data.digest('hex');
    return digest;
  } catch (error: unknown) {
    console.error("\x1b[31m", error as string);
    throw new Error(error as string);
  }
}

/**
 * Compares a password with its hashed version
 * @param {string} password - Text to be compared
 * @param {string} hashedPassword - Text to be compared to
 * @returns {Promise<boolean>} - Whether the passwords match or not
 */
async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
  try {
    const match: string = await permanentEncryptPassword(password);

    if (match === hashedPassword) {
      return true;
    } else {
      return false;
    }
  } catch (error: unknown) {
    console.error("\x1b[31m", error as string);
    throw new Error(error as string);
  }
}


type ValidEncryptionAlgorithm = 'aes-256-gcm' | 'aes-128-gcm' | 'aes-192-gcm';

/**
 * Encrypts data using AES-256-GCM
 * @param {string} newData - Data to be encrypted
 * @param {string} encryptionAlg - ONLY USE IF YOU KNOW WHAT YOU ARE DOING - Encryption algorithm to be used, default: aes-256-gcm
 * @returns {Promise<{ encryptedData: string, authTag: Buffer }>} - Encrypted data and authentication tag
 */
async function encryptData(
  newData: string,
  encryptionAlg?: ValidEncryptionAlgorithm
): Promise<{ encryptedData: string; authTag: Buffer }> {
  try {
    const encryptionAlgorithm: ValidEncryptionAlgorithm =
      encryptionAlg || 'aes-256-gcm';

    const cipher: crypto.CipherGCM = crypto.createCipheriv(encryptionAlgorithm, encryptionKey, iv);
    let encryptedData: string = cipher.update(newData, 'utf8', 'hex');
    encryptedData += cipher.final('hex');

    // Get the authentication tag
    const authTag: Buffer = cipher.getAuthTag();

    return { encryptedData, authTag };
  } catch (error: unknown) {
    console.error("\x1b[31m", error as string);
    throw new Error(error as string);
  }
}

/**
 * Decrypts data using AES-256-GCM
 * @param {string} encryptedData - Encrypted data
 * @param {Buffer} authTag - Authentication tag
 * @returns {Promise<string>} - Decrypted data
 */
async function decryptData(encryptedData: string, authTag: Buffer): Promise<string> {
  try {
    const decipher = crypto.createDecipheriv('aes-256-gcm', encryptionKey, iv);
    decipher.setAuthTag(authTag);
    let decryptedData: string = decipher.update(encryptedData, 'hex', 'utf8');
    decryptedData += decipher.final('utf8');
    return decryptedData;
  } catch (error: unknown) {
    console.error("\x1b[31m", error as string);
    throw new Error(error as string);
  }
}

/**
 * Encrypts the IP address
 * @param {string} ip - IP address to be encrypted
 * @returns {string} - Encrypted IP address
 */
function encryptIP(ip: string): string {
  try {
  return ip.split('.').map(part => parseInt(part, 10).toString(16)).join('');
  } catch (error: unknown) {
    console.error("\x1b[31m", error as string);
    throw new Error(error as string);
  }
}

/**
 * Decrypts the IP address
 * @param {string} encryptedIP - Encrypted IP address
 * @returns {string} - Decrypted IP address
 */
function decryptIP(encryptedIP: string): string {
  try {
    const match: RegExpMatchArray | null = encryptedIP.match(/.{1,2}/g);
    const ip: string = match ? match.map(part => parseInt(part, 16)).join('.') : '';
    return ip;
  } catch (error: unknown) {
    console.error("\x1b[31m", error as string);
    throw new Error(error as string);
  }
}

// Export all the functions as a single object with a common name
const encrypts = {
  generateRandomNumber,
  encryptPassword,
  comparePassword,
  encryptData,
  decryptData,
  encryptIP,
  decryptIP,
  permanentEncryptPassword,
};

export default encrypts
export { generateRandomNumber, encryptPassword, comparePassword, encryptData, decryptData, encryptIP, decryptIP, permanentEncryptPassword }