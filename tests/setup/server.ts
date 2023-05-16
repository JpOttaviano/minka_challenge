import supertest from 'supertest'
import { getApp } from '../../src/server'
import { generateAccessToken } from '../../src/utils/crypto'
import { DOMAIN_OWNER_ID } from './constants'

type Methods = 'post' | 'get' | 'put' | 'delete' | 'patch'

const APP = getApp()
const TOKEN = generateAccessToken({
  userId: DOMAIN_OWNER_ID,
  roles: ['DOMAIN_OWNER', 'MEMBER'],
})

const hook =
  (method: Methods = 'post', token = TOKEN) =>
  (arguments_: string) =>
    supertest(APP)[method](arguments_).set('Authorization', `Bearer ${token}`)

const request = (token?: string) => ({
  post: hook('post', token),
  get: hook('get', token),
  put: hook('put', token),
  delete: hook('delete', token),
  patch: hook('patch', token),
})

export default request
