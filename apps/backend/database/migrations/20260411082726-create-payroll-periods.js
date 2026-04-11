'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('payroll_periods', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      month: {
        type: Sequelize.SMALLINT,
        allowNull: false,
      },
      year: {
        type: Sequelize.SMALLINT,
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM('draft', 'finalized', 'paid'),
        allowNull: false,
        defaultValue: 'draft',
      },
      finalized_at: {
        type: Sequelize.DATE,
        allowNull: true,
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
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()'),
      },
    });

    await queryInterface.addIndex('payroll_periods', ['month', 'year'], {
      unique: true,
      name: 'payroll_periods_month_year_unique',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('payroll_periods');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_payroll_periods_status";');
  },
};
