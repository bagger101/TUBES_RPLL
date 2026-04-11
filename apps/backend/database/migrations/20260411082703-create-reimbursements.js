'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('reimbursements', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      employee_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'employees', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      category: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      amount: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      receipt_url: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },
      expense_date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM('pending', 'approved', 'declined'),
        allowNull: false,
        defaultValue: 'pending',
      },
      approved_by: {
        type: Sequelize.UUID,
        allowNull: true,
        references: { model: 'employees', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      approved_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      decline_reason: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      payroll_item_id: {
        type: Sequelize.UUID,
        allowNull: true,
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

    await queryInterface.addIndex('reimbursements', ['employee_id'], { name: 'reimbursements_employee_id_idx' });
    await queryInterface.addIndex('reimbursements', ['status'], { name: 'reimbursements_status_idx' });
    await queryInterface.addIndex('reimbursements', ['expense_date'], { name: 'reimbursements_expense_date_idx' });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('reimbursements');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_reimbursements_status";');
  },
};
