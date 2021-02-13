const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

var admin =  require("firebase-admin");
var serviceAccount = require('./shortner-dc8f7-firebase-adminsdk-d1emp-40e2fc3c31.json');
const { response } = require('express');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
})

const static = express.static("public");

const urlsDB = admin.firestore().collection("urlsDB");

// if there is a user  then check user is authorize or not, if is authorize user then create a new url

const usersDB = admin.firestore().collection("usersDB");


app.use(static);
// use a middleware for body-parser
app.use(bodyParser.json());

// if we have to intercept the routes then use the middleware
// app.use((req,res,next)=>{

//    console.log("We intercepted")
// })


app.get('/:short',(req,res)=>{
    console.log(req.params);
    const short = req.params.short;

    const doc = urlsDB.doc(short);
    doc.get().then(response=>{
    
        const data = response.data();

        // console.log(data);
        if(data && data.url){
            res.redirect(301,data.url);
        }else{
            res.redirect(301,"https://youtube.com");
        }

    })
    // res.send("We will redirect you to " + short);
})


app.post('/admin/urls',(req,res)=>{

    // when got the post request then we go for check the user

    const {userName,password,short,url} = req.body;

    usersDB.doc(userName).get().then(response =>{
        const user = response.data;
        // console.log(user);

        if(user && (user.userName === userName) && (user.password === password)){
            const doc = urlsDB.doc(short);
            doc.set({url});
            res.send("Done");
        }else{

            // not able to find the user
            res.send(403,"Not Possible");

        }
    })

//  res.send("HelloWorld!");
})

app.get('/another',(req,res)=>{
    res.send("Hello from another");
})
app.listen(port,()=>{
    console.log(`app is listening at http://localhost:${port}`)
})