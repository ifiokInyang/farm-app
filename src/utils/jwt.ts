import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

interface AuthPayload {
    id: string;
    email: string;
    verified: boolean;
}
export const GenerateSignature = async(payload: AuthPayload) => {
    return jwt.sign(payload, process.env.JWT_SECRET!, {expiresIn: '1d'})
}