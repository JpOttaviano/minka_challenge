'use strict';
import { v4 } from 'uuid';
import { encrypt } from '../../src/utils/crypto';

const TOKEN = encrypt('ownerPassword')
const OWNER_ID = v4()
const HRK_ID = v4()
const ZKN_ID = v4()

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
   // Insert domain owner user
    await queryInterface.bulkInsert('users', [{
      id: OWNER_ID,
      name: 'DomainOwner',
      email: 'domainowner@zefmail.com',
      token: TOKEN,
      roles: ['DOMAIN_OWNER','MEMBER']
    }])

    // Insert initial currencies
    await queryInterface.bulkInsert('currencies',[
      {
        id: HRK_ID,
        name: 'Croatian Kuna',
        symbol: 'HRK',
        reference_currency_id: HRK_ID,
        value: 1
      },
      {
        id: ZKN_ID,
        name: 'ZEF Kuna',
        symbol: 'ZKN',
        reference_currency_id: HRK_ID,
        value: 1
      }
    ])

    // Insert initial accounts
    await queryInterface.bulkInsert('accounts',[
      {
        currency_id: HRK_ID,
        user_id: OWNER_ID,
        type: 'PERSONAL',
        balance: 1000000
      }
    ])
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {})
    await queryInterface.bulkDelete('currencies', null, {})
    await queryInterface.bulkDelete('accounts', null, {})
  }
};
