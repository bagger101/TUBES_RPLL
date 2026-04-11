'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('leave_requests', {
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
      leave_type_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'leave_types', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      start_date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      end_date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      total_days: {
        type: Sequelize.SMALLINT,
        allowNull: false,
      },
      reason: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM('pending', 'approved', 'declined', 'cancelled'),
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

    await queryInterface.addIndex('leave_requests', ['employee_id'], { name: 'leave_requests_employee_id_idx' });
    await queryInterface.addIndex('leave_requests', ['status'], { name: 'leave_requests_status_idx' });
    await queryInterface.addIndex('leave_requests', ['start_date', 'end_date'], { name: 'leave_requests_date_range_idx' });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('leave_requests');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_leave_requests_status";');
  },
};
