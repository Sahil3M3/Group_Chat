const express = require('express');
const cors=require('cors')


const User=require('./model/user');
const Message=require('./model/message.js')
const app = express();
const sequelize=require('./util/database.js')
const userRoutes=require('./routes/user')
const chatRoutes=require('./routes/chat.js')
app.use(cors({origin:"*",credentials:true    }));
app.use(express.json())

//routes
app.use('/', userRoutes);
app.use('/chat',chatRoutes);

User.hasMany(Message,{foreignKey:"userId", onDelete: 'CASCADE'})
Message.belongsTo(User,{foreignKey:"userId"});

sequelize.sync().then(r=>{    
    app.listen(5000, () => {
        console.log('Server is running on port 5000');
    });

}).catch(e=>console.log(e)
)
