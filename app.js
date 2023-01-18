
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoosh = require('mongoose');
require('dotenv').config();

const pagesRoutes = require('./routes/pages.routes');
const usersRoutes = require('./routes/user.routes');



const HttpError = require('./models/http-error');
const app = express();


app.use(bodyParser.json());

// app.use((req, res, next) => {
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader('Access-Control-Allow-Headers',
//         'Origin, X-Requested-With, Content-Type, Accept, Autorization'
//     );
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
// })

// VIEW ENGINE
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));



app.use('/api/users', usersRoutes);
app.use(pagesRoutes);


app.use((req, res, next) => {
    const error = new HttpError('Could not find the route', 404);
    throw error;
});

app.use((error, req, res, next) => {

    if (res.headerSent) {
        return next(error);
    }
    res.status(error.code || 500);
    res.json({ message: error.message || 'Unfortunately Something went wrong' })
});



let port = 5000;




mongoosh.connect(process.env.MongodbUrl).then(() => {
    app.listen(process.env.PORT || port, () => {
        console.log(`Server connected ${port}`);
    })
}).catch(error => {
    console.log(error);
})
