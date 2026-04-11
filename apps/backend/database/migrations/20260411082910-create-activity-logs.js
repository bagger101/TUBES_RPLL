'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('activity_logs', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      actor_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      action: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      target_type: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      target_id: {
        type: Sequelize.UUID,
        allowNull: true,
      },
      payload: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      ip_address: {
        type: Sequelize.STRING(45), // Support IPv6
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()'),
      },
    });

    await queryInterface.addIndex('activity_logs', ['actor_id'], { name: 'activity_logs_actor_id_idx' });
    await queryInterface.addIndex('activity_logs', ['action'], { name: 'activity_logs_action_idx' });
    await queryInterface.addIndex('activity_logs', ['target_type', 'target_id'], { name: 'activity_logs_target_idx' });
    await queryInterface.addIndex('activity_logs', ['created_at'], { name: 'activity_logs_created_at_idx' });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('activity_logs');
  },
};
