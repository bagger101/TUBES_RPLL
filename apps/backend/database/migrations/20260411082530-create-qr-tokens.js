'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('qr_tokens', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      token: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true,
      },
      valid_for_date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      expires_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      is_used: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      created_by: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()'),
      },
    });

    await queryInterface.addIndex('qr_tokens', ['token'], { unique: true, name: 'qr_tokens_token_unique' });
    await queryInterface.addIndex('qr_tokens', ['valid_for_date'], { name: 'qr_tokens_date_idx' });
    await queryInterface.addIndex('qr_tokens', ['expires_at'], { name: 'qr_tokens_expires_idx' });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('qr_tokens');
  },
};
