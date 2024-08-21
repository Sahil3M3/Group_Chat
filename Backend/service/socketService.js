// services/socketService.js
const Message = require('../model/message');
const sequelize = require('../util/database');

module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log('A user connected');

        socket.on('sendMessage', async (data) => {
            const { groupId, message, userId } = data;
            console.log(groupId,message,userId);
            
            const t = await sequelize.transaction();

            try {
                const newMessage = await Message.create({
                    message,
                    groupId,
                    userId,
                    transaction: t
                });

                await t.commit();
                io.to(groupId).emit('receiveMessage', newMessage);
            } catch (error) {
                await t.rollback();
                console.error('Error saving message:', error);
            }
        });

        socket.on('disconnect', () => {
            console.log('User disconnected');
        });
    });
};
