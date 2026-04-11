'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('employees', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        unique: true,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      employee_number: {
        type: Sequelize.STRING(20),
        allowNull: false,
        unique: true,
      },
      full_name: {
        type: Sequelize.STRING(150),
        allowNull: false,
      },
      department_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: { model: 'departments', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      manager_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: { model: 'employees', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      job_title: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      join_date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      base_salary: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false,
      },
      phone: {
        type: Sequelize.STRING(20),
        allowNull: true,
      },
      address: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      photo_url: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
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

    await queryInterface.addIndex('employees', ['user_id'], { unique: true, name: 'employees_user_id_unique' });
    await queryInterface.addIndex('employees', ['employee_number'], { unique: true, name: 'employees_number_unique' });
    await queryInterface.addIndex('employees', ['department_id'], { name: 'employees_department_id_idx' });
    await queryInterface.addIndex('employees', ['manager_id'], { name: 'employees_manager_id_idx' });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('employees');
  },
};
