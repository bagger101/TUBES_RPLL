'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('payroll_items', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      payslip_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'payslips', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      type: {
        type: Sequelize.ENUM('incentive', 'penalty', 'bonus', 'reimburse'),
        allowNull: false,
      },
      source: {
        type: Sequelize.ENUM('manual', 'auto_late', 'auto_reimburse', 'auto_leave'),
        allowNull: false,
        defaultValue: 'manual',
      },
      amount: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      ref_id: {
        type: Sequelize.UUID,
        allowNull: true,
      },
      ref_type: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      created_by: {
        type: Sequelize.UUID,
        allowNull: true,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()'),
      },
    });

    await queryInterface.addIndex('payroll_items', ['payslip_id'], { name: 'payroll_items_payslip_id_idx' });
    await queryInterface.addIndex('payroll_items', ['type'], { name: 'payroll_items_type_idx' });
    await queryInterface.addIndex('payroll_items', ['ref_id', 'ref_type'], { name: 'payroll_items_ref_idx' });

    await queryInterface.addConstraint('reimbursements', {
      fields: ['payroll_item_id'],
      type: 'foreign key',
      name: 'reimbursements_payroll_item_id_fk',
      references: { table: 'payroll_items', field: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('reimbursements', 'reimbursements_payroll_item_id_fk');
    await queryInterface.dropTable('payroll_items');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_payroll_items_type";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_payroll_items_source";');
  },
};
