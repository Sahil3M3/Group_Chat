const express = require('express');
const cors=require('cors')
const { createServer } = require('http');
const { Server } = require('socket.io');
const scheduleCronJobs = require('./util/cronJobs.js');

const User=require('./model/user');
const Message=require('./model/message.js')
const GroupMembership=require('./model/groupmember')
const Group=require('./model/group.js')
const app = express();
const sequelize=require('./util/database.js')
const userRoutes=require('./routes/user')
const ArchivedChat=require('./model/ArchivedChat')
const groupRoutes=require('./routes/group');
const { log } = require('console');
app.use(cors({origin:"*",credentials:true    }));
app.use(express.json())
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        credentials: true
    }
});

scheduleCronJobs();
//routes
app.use('/', userRoutes);

app.use('/groups',groupRoutes);

User.hasMany(Message,{foreignKey:"userId", onDelete: 'CASCADE'})
Message.belongsTo(User,{foreignKey:"userId"});


Group.hasMany(GroupMembership,{foreignKey:"groupId", onDelete: 'CASCADE'});
GroupMembership.belongsTo(Group,{foreignKey:"groupId"});

Group.hasMany(Message,{foreignKey:"groupId", onDelete: 'CASCADE'});
Message.belongsTo(Group,{foreignKey:"groupId"});

User.hasMany(GroupMembership,{foreignKey:"userId", onDelete: 'CASCADE'});
GroupMembership.belongsTo(User,{foreignKey:"userId"});

User.hasMany(ArchivedChat,{foreignKey:"userId",onDelete:"CASCADE"});
ArchivedChat.belongsTo(User,{foreignKey:"userId"});

Group.hasMany(ArchivedChat,{foreignKey:"groupId",onDelete:"CASCADE"});
ArchivedChat.belongsTo(Group,{foreignKey:"groupId"});


io.on('connection', (socket) => {
    console.log(`User ${socket.id} connected`);

    socket.on('joinGroup', (groupId) => {
        
        socket.join(groupId);
    });

    socket.on('send', (groupId) => {
      
        groupId=Number(groupId);
        
        socket.to(groupId).emit('rec',groupId);

    });

 
});


sequelize.sync().then(r=>{    
    server.listen(5000, () => {
        console.log('Server is running on port 5000');
    });

}).catch(e=>console.log(e)
)