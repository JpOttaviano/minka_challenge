
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   // Insert domain owner user
    const TOKEN = 'ca228d8c8424c9e90d0aba56dedbc5f6:ced82ba563bfd5a438fb91bcb042a475'
    const OWNER_ID = '36c12be9-1a51-4f66-8c4c-1ca18a691710'
    const HRK_ID = '0aa1736d-116b-4498-a801-6cfbf90a54f1'
    const ZKN_ID = '518f47d9-5d1d-44c8-ad71-b6d7dfc5d65a'
    await queryInterface.bulkInsert('users', [{
      id: OWNER_ID,
      name: 'DomainOwner',
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
