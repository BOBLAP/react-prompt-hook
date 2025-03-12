
import * as jose from 'jose';

const JWT_PASSPHRASE = "SwallowDancingMidnightUmbrella-95-Horizon";
const JWT_SECRET = "cD8j5XpN2vQrA7bKmEzF3tGhYsW6uLqP9RxT4VdZyHwJ0";
const JWT_ALGORITHM = "HS256";

export const useJWT = () => {
  const generateJWT = () => {
    try {
      // Convert the secret to a Uint8Array for the jose library
      const secretKey = new TextEncoder().encode(JWT_SECRET);
      
      // Create payload with current timestamp
      const payload = {
        passphrase: JWT_PASSPHRASE,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 60 * 5, // Expires in 5 minutes
      };
      
      // Sign the JWT token
      const token = jose.jwtEncrypt(
        payload,
        secretKey,
        { alg: 'dir', enc: 'A256GCM' }
      );
      
      return token;
    } catch (error) {
      console.error("Error generating JWT:", error);
      return null;
    }
  };

  return { generateJWT };
};
