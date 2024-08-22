const cron = require('node-cron');
const message  = require('../model/message');
const ArchivedChat=require('../model/ArchivedChat')
const sequelize = require('./database');
const { Op } = require('sequelize');

const archiveOldMessages = async () => {
    const t = await sequelize.transaction();
    try {
        const oldMessages = await message.findAll({
            where: {
                createdAt: {
                    [Op.lt]: sequelize.literal('CURRENT_TIMESTAMP - INTERVAL 1 DAY')
                }
            },
            transaction: t
        });

        const archivedMessages = oldMessages.map(msg => ({
            groupId: msg.groupId,
            userId: msg.userId,
            message: msg.message,
            createdAt: msg.createdAt
        }));

        await ArchivedChat.bulkCreate(archivedMessages, { transaction: t });

        await message.destroy({
            where: {
                id: oldMessages.map(msg => msg.id)
            },
            transaction: t
        });

        await t.commit();
        console.log('Old messages archived successfully.');
    } catch (error) {
        await t.rollback();
        console.error('Error archiving messages:', error.message);
    }
};

const scheduleCronJobs = () => {
    cron.schedule('0 0 * * *', archiveOldMessages);
    console.log('Cron job scheduled to archive old messages every midnight.');
};

module.exports = scheduleCronJobs;
