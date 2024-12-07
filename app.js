const express = require("express");
var cons = require('consolidate');
const path = require("path");
const app = express();
const mongoose = require('mongoose');
const { Session } = require("inspector");
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const session = require('express-session');

const port = process.env.PORT || 8000;

mongoose.connect('mongodb://localhost/Uemdatabase', { useNewUrlParser: true, useUnifiedTopology: true });

// mongoose.connect('mongodb://localhost/authentication', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});


const uemschema = new mongoose.Schema({
    name: String,
    phone: String,
    email: String,
    address: String,
    desc: String,
});

const uem = mongoose.model('uem', uemschema);
const User = mongoose.model('User', userSchema);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
}));


app.use('/static', express.static('static'))
app.use(express.urlencoded())


app.engine('html', cons.swig)
app.set('views ', path.join(__dirname, 'views'))
app.set('view engine', 'html')

function isAuthenticated(req, res, next) {
    if (req.session.userId) {
      return next();
    }
    res.redirect('/login');
  }


app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/views/login.html');
});

app.get('/signup', (req, res) => {
    res.sendFile(__dirname + '/views/signup.html');
});

// Signup endpoint
app.post('/signup', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = new User({ username: req.body.username, password: hashedPassword });
        await user.save();
        res.redirect('/login');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error signing up');
    }
});

// Login endpoint
app.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        if (!user) {
            return res.status(400).send('User not found');
        }

        const isMatch = await bcrypt.compare(req.body.password, user.password);
        if (!isMatch) {
            return res.status(400).send('Invalid credentials');
        }

        req.session.userId = user._id;
        res.redirect('/home');

    } catch (err) {
        console.error(err);
        res.status(500).send('Error logging in');
    }
});

// Logout endpoint
app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});


app.get('/', (req, res) => {
    res.status(200).render('index.html')
})
app.get('/contact', isAuthenticated, (req, res) => {

    res.status(200).render('contact.html')
})
app.get('/about', isAuthenticated, (req, res) => {

    res.status(200).render('about.html')
})

app.get('/home', isAuthenticated, (req, res) => {

    res.status(200).render('home.html')
})
app.get('/index', (req, res) => {
    res.status(200).render('index.html')
})

app.post('/contact', (req, res) => {
    var mydata = new uem(req.body);
    mydata.save().then(() => {
        //res.send(" saved into the database ..... Thanks for filling")
        res.status(200).render('success.html')

    }).catch(() => {
        res.status(400).render('error.html')

    });
    //res.status(200).render('contact.pug' )
})


app.listen(port, () => {
    console.log(`the application started succesfully at port ${port}`);

});
