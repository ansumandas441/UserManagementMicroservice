import * as jwt from 'jsonwebtoken';

export function getUserIdFromToken(token: string): number {
  if (!token) {
    throw new Error('No authorization token provided');
  }

  try {
    const decoded: any = jwt.decode(token);
    if (!decoded.userId) {
      throw new Error('No userId found in token');
    }
    return decoded.userId;
  } catch (error) {
    throw new Error(`Error decoding or verifying token: ${error.message}`);
  }
}
