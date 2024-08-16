const express = require('express');
const cors=require('cors')


const User=require('./model/user');
const Message=require('./model/message.js')
const GroupMembership=require('./model/groupmember')
const Group=require('./model/group.js')
const app = express();
const sequelize=require('./util/database.js')
const userRoutes=require('./routes/user')

const groupRoutes=require('./routes/group')
app.use(cors({origin:"*",credentials:true    }));
app.use(express.json())

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



sequelize.sync({}).then(r=>{    
    app.listen(5000, () => {
        console.log('Server is running on port 5000');
    });

}).catch(e=>console.log(e)
)
