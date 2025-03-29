const mongose =require('mongoose');
require('dotenv').config();

mongose.set('strictQuery', true);
mongose.connect(process.env.MONGODB_URL)
    .then((db)=> {
        console.log('DB is conected');
})  
    .catch(err=>console.error(err));