import { encrypt } from '../../src/utils/crypto'

function generatePassword(password: string): string {
  const token = encrypt(password)
  console.log(`Token for ${password} is: ${token}`)
  return token
}

generatePassword(process.argv[2] || '')
