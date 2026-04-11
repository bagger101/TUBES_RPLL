'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('employee_schedules', {
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
        onDelete: 'CASCADE',
      },
      schedule_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'work_schedules', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      effective_date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()'),
      },
    });

    await queryInterface.addIndex('employee_schedules', ['employee_id', 'effective_date'], {
      unique: true,
      name: 'employee_schedules_unique_per_date',
    });
    await queryInterface.addIndex('employee_schedules', ['schedule_id'], { name: 'employee_schedules_schedule_id_idx' });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('employee_schedules');
  },
};
