const express = require("express");
var cons = require('consolidate');
const path = require("path");
const app = express();
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/Uemdatabase', {useNewUrlParser: true, useUnifiedTopology: true});
const port = process.env.PORT || 8000;

const uemschema = new mongoose.Schema({
    name: String,
    phone: String,
    email: String,
    address: String,
    desc: String,
});

const uem = mongoose.model('uem', uemschema);


app.use('/static' , express.static('static'))
app.use(express.urlencoded())


app.engine('html', cons.swig)
app.set('views ' , path.join(__dirname , 'views')) 
app.set('view engine'  ,'html')




app.get('/' , (req ,res)=>{
    res.status(200).render('home.html' )
})
app.get('/contact' , (req ,res)=>{
  
    res.status(200).render('contact.html' )
})
app.get('/about' , (req ,res)=>{
    
    res.status(200).render('about.html')
})



app.post('/contact' , (req ,res)=>{
    var mydata = new uem(req.body);
    mydata.save().then(()=>{
        res.send(" saved into the database ..... Thanks for filling")

    }).catch(()=>{
        res.status(400).send("Not inserted into the database")
    });
    //res.status(200).render('contact.pug' )
})


app.listen(port, ()=> {
    console.log(`the application started succesfully at port ${port}`);

});
