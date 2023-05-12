import { config } from 'dotenv'
import { cleanEnv, str } from 'envalid'

process.env.NODE_ENV === 'test'
  ? config({ path: '.env.test' })
  : config({ path: '.env' })

export const apiConfig = cleanEnv(process.env, {
  DB_HOST: str({
    desc: 'Database host url',
  }),
  DB_PORT: str({
    desc: 'Database port',
  }),
  DB_NAME: str({
    desc: 'Database name',
  }),
  DB_USER: str({
    desc: 'Database user',
  }),
  DB_PASSWORD: str({
    desc: 'Database password',
  }),
  DB_DIALECT: str({
    desc: 'Database dialect',
  }),
  JWT_SECRET: str({
    desc: 'JWT secret',
  }),
  ENCRYPTION_KEY: str({
    desc: 'Encryption key',
  }),
})
