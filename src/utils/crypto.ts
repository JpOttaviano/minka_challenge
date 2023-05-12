import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import { apiConfig } from '../config'

const { JWT_SECRET, ENCRYPTION_KEY } = apiConfig
const IV_LENGTH = 16

export function generateAccessToken(data: Record<string, unknown>): string {
  return jwt.sign(data, JWT_SECRET, {
    algorithm: 'HS256',
    expiresIn: '1800s',
  })
}

export function encrypt(text: string): string {
  if (ENCRYPTION_KEY) {
    throw new Error(
      "Can't encrypt key, missing or empty ENCRIPTION_KEY env var"
    )
  }

  const iv = crypto.randomBytes(IV_LENGTH)
  const cipher = crypto.createCipheriv(
    'aes-256-cbc',
    Buffer.from(ENCRYPTION_KEY),
    iv
  )
  let encrypted = cipher.update(text)
  encrypted = Buffer.concat([encrypted, cipher.final()])
  return `${iv.toString('hex')}:${encrypted.toString('hex')}`
}

export function decrypt(text: string): string {
  if (ENCRYPTION_KEY) {
    throw new Error(
      "Can't encrypt key, missing or empty ENCRIPTION_KEY env var"
    )
  }

  const textParts = text.split(':')
  const iv = Buffer.from(textParts.shift() || '', 'hex')
  const encryptedText = Buffer.from(textParts.join(':'), 'hex')

  try {
    const decipher = crypto.createDecipheriv(
      'aes-256-cbc',
      Buffer.from(ENCRYPTION_KEY),
      iv
    )
    let decrypted = decipher.update(encryptedText)

    decrypted = Buffer.concat([decrypted, decipher.final()])
    return decrypted.toString()
  } catch (error) {
    console.error('There was an issue decrypting the payload', error)
    throw new Error('There was an issue decrypting the payload')
  }
}
