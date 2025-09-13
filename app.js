const express = require('express');
const port = process.env.PORT || 5000;
const app = express();
//db connection
const db = require('./db/dbconfige');

//middleware
app.use(express.json());



// user route middleware 
const userRoute = require('./routes/userRoute');
app.use('/api/users', userRoute);

// question route middleware??

// answer route middleware??




// start server
app.listen(port, (err) => {
    if (err) {
        console.error('Error starting server:', err);
        return;
    }
    console.log(`Server is running on port ${port}`);
});