export interface SessionData {
    userId: number;
    username: string;
    mustChangePassword: boolean;
    roleId?: number;
    roleName?: string;
    vereinId?: string;
    timestamp: number;
}

export const SESSION_COOKIE_NAME = 'admin-session';

const SESSION_SECRET = process.env.SESSION_SECRET || 'fallback-secret-for-dev-only-12345';

/**
 * Signs a session payload using HMAC-SHA256
 * Works in both Node.js and Edge Runtime
 */
export async function signSession(payload: SessionData): Promise<string> {
    const data = JSON.stringify(payload);
    
    // In environments with Buffer (Node/Next.js Edge polyfill), use it for speed
    if (typeof Buffer !== 'undefined') {
        const dataBase64 = Buffer.from(data).toString('base64url');
        const signature = await hmacSha256(dataBase64, SESSION_SECRET);
        return `${dataBase64}.${signature}`;
    }
    
    // Fallback for pure web environments if needed
    const dataBase64 = btoa(data).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
    const signature = await hmacSha256(dataBase64, SESSION_SECRET);
    return `${dataBase64}.${signature}`;
}

/**
 * Verifies a session token signature
 */
export async function verifySession(token: string): Promise<SessionData | null> {
    try {
        const [dataBase64, signature] = token.split('.');
        if (!dataBase64 || !signature) return null;

        const expectedSignature = await hmacSha256(dataBase64, SESSION_SECRET);
        
        if (signature !== expectedSignature) {
            console.error('Session signature mismatch');
            return null;
        }

        let decodedData: string;
        if (typeof Buffer !== 'undefined') {
            decodedData = Buffer.from(dataBase64, 'base64url').toString();
        } else {
            decodedData = atob(dataBase64.replace(/-/g, '+').replace(/_/g, '/'));
        }
        
        return JSON.parse(decodedData) as SessionData;
    } catch (error) {
        console.error('Session verification failed:', error);
        return null;
    }
}

/**
 * Helper to compute HMAC-SHA256 signature
 */
async function hmacSha256(data: string, secret: string): Promise<string> {
    const encoder = new TextEncoder();
    const cryptoObj = globalThis.crypto;
    
    const keyData = encoder.encode(secret);
    const dataData = encoder.encode(data);
    
    const key = await cryptoObj.subtle.importKey(
        'raw',
        keyData,
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
    );
    
    const signature = await cryptoObj.subtle.sign('HMAC', key, dataData);
    
    if (typeof Buffer !== 'undefined') {
        return Buffer.from(signature).toString('base64url');
    }
    
    return btoa(String.fromCharCode(...new Uint8Array(signature)))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
}
