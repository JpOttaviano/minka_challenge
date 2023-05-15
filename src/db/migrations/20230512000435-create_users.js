'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
      await queryInterface.sequelize.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";')

      await queryInterface.createTable('users', {
        id: {
          type: Sequelize.UUID,
          primaryKey: true,
          defaultValue: Sequelize.literal('uuid_generate_v4()'),
        },
        name: {
          type: Sequelize.STRING,
          allowNull: false
        },
        roles: {
          type: Sequelize.ARRAY(Sequelize.STRING),
          allowNull: false
        },
        token: {
          type: Sequelize.STRING,
          allowNull: false
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('NOW()')
        },
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('NOW()')
        },
      });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
  }
};
