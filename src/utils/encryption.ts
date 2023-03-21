import jwt from '@tsndr/cloudflare-worker-jwt';
import ab2str from 'arraybuffer-to-string';
import str2ab from 'string-to-arraybuffer';

const algo = {
    name: 'AES-GCM',
    length: 256,
    iv: new Int8Array([5, 12, 14, 5, 12, 14, 14, 5, 12, 14, 10, 11])
};

export const encrypt = async (text: string) => {
    text = text.toString();
    var key = await genEncryptionKey(globalThis.env.ENCRYPTION_SECRET_KEY);
    var encoded = new TextEncoder().encode(text);
    return ab2str(await crypto.subtle.encrypt(algo, key, encoded), 'base64');
};

export const decrypt = async (cipherText: any) => {
    try {
        const env = globalThis.env as ENV;
        const cipher: ArrayBuffer | ArrayBufferView = str2ab(cipherText);
        var key = await genEncryptionKey(globalThis.env.ENCRYPTION_SECRET_KEY);
        var decrypted = await crypto.subtle.decrypt(algo, key, cipher);
        return new TextDecoder().decode(decrypted);
    } catch (error) {
        return null;
    }
};

async function genEncryptionKey(password: string) {
    const key_algo = {
        name: 'PBKDF2',
        hash: 'SHA-256',
        salt: new TextEncoder().encode('a-unique-salt'),
        iterations: 10
    };
    var encoded = new TextEncoder().encode(password);
    const key = await crypto.subtle.importKey('raw', encoded, { name: 'PBKDF2' }, false, ['deriveKey']);
    return crypto.subtle.deriveKey(key_algo, key, { name: algo.name, length: algo.length }, false, ['encrypt', 'decrypt']);
}

export const generateToken = async (data: any) => {
    return jwt.sign(data, globalThis.env.ENCRYPTION_SECRET_KEY);
};

export const verifyToken = async (token: string) => jwt.verify(token, globalThis.env.ENCRYPTION_SECRET_KEY);

export const decodeToken = async (token: string) => {
    const decoded = jwt.decode(token);
    return decoded.payload || {};
};

export { jwt };
