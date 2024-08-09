const express = require('express');
const cors=require('cors')

const app = express();
const sequelize=require('./util/database.js')
const userRoutes=require('./routes/user')
app.use(cors({origin:"*",credentials:true    }));
app.use(express.json())
app.use('/', userRoutes);

sequelize.sync().then(r=>{    
    app.listen(5000, () => {
        console.log('Server is running on port 5000');
    });

}).catch(e=>console.log(e)
)
