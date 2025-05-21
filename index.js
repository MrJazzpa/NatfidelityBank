const express = require('express');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const connectDB = require('./server/config/db');


const app= express();
const port = process.env.PORT;

connectDB();

app.use(cookieParser());
app.use(express.urlencoded({extended:true}));
app.use(express.json());


app.use(express.static('public'));
app.set('view engine','ejs');




app.use('/',require('./server/routes/pages_routes'));
app.use('/api',require('./server/routes/api_router'));
app.use((req,res,next)=>{
    
    locals={
        title:"404"
    }
    res.render('pages/app-404',{locals})
})

app.listen(port,()=>{

    console.log(`app listening  to ${port}`)
})
