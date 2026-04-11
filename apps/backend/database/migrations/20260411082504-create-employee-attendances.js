'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('attendances', {
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
      date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      check_in_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      check_out_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      late_minutes: {
        type: Sequelize.SMALLINT,
        allowNull: false,
        defaultValue: 0,
      },
      status: {
        type: Sequelize.ENUM('present', 'absent', 'late', 'leave', 'holiday'),
        allowNull: false,
        defaultValue: 'absent',
      },
      note: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      edited_by: {
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
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()'),
      },
    });

    await queryInterface.addIndex('attendances', ['employee_id', 'date'], {
      unique: true,
      name: 'attendances_employee_date_unique',
    });
    await queryInterface.addIndex('attendances', ['date'], { name: 'attendances_date_idx' });
    await queryInterface.addIndex('attendances', ['status'], { name: 'attendances_status_idx' });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('attendances');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_attendances_status";');
  },
};
