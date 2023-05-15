import supertest from 'supertest'
import { getApp } from '../../src/server'
import { generateAccessToken } from '../../src/utils/crypto'
import { DOMAIN_OWNER_ID } from './constants'

const APP = getApp()
const TOKEN = generateAccessToken({
  userId: DOMAIN_OWNER_ID,
  roles: ['DOMAIN_OWNER', 'MEMBER'],
})

const hook =
  (method = 'post', token = TOKEN) =>
  (arguments_) =>
    supertest(APP)[method](arguments_).set('Authorization', `Bearer ${token}`)

const request = (token?: string) => ({
  post: hook('post', token),
  get: hook('get', token),
  put: hook('put', token),
  delete: hook('delete', token),
  patch: hook('patch', token),
})

export default request
