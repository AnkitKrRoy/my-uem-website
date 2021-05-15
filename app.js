const express = require("express");
const path = require("path");
const app = express();
//const mongoose = require('mongoose');
//const bodyparser =require("body-parser")
//mongoose.connect('mongodb://localhost/Uemdatabase', {useNewUrlParser: true, useUnifiedTopology: true});
const port = 8000;

/*const uemschema = new mongoose.Schema({
    name: String,
    phone: String,
    email: String,
    address: String,
    desc: String,
  });*/

//const uem = mongoose.model('uem', uemschema);

// express specific stuff
app.use('/static' , express.static('static'))
app.use(express.urlencoded())

// pug specific stuff
app.set('view engine'  ,'pug')// set the template engine as pug
app.set('views ' , path.join(__dirname , 'views')) // set the view directory..

//end points

app.get('/' , (req ,res)=>{
    const params = {}
    res.status(200).render('home.pug' , params)
})
app.get('/contact' , (req ,res)=>{
    const params = {}
    res.status(200).render('contact.pug' , params)
})
app.get('/About' , (req ,res)=>{
    const params = {}
    res.status(200).render('About.pug' , params)
})



/*app.post('/contact' , (req ,res)=>{
    var mydata = new uem(req.body);
    mydata.save().then(()=>{
        res.send(" saved into the database ..... Thanks for filling")

    }).catch(()=>{
        res.status(400).send("Not inserted into the database")
    });
    //res.status(200).render('contact.pug' )
})*/



// start the server

app.listen(port, ()=> {
    console.log(`the application started succesfully at port ${port}`);

});
