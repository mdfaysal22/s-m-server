const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;
const dotenv = require('dotenv');
const { MongoClient, ServerApiVersion } = require('mongodb');
app.use(cors());
app.use(express.json());
dotenv.config();


app.get('/', (req, res) => {
    res.send(`Social Media Server is Running on ${port}`);
})

// MongoDB server starts
const uri = "mongodb+srv://social-media:BqHwA8Jkq2etbcx9@cluster0.k8emzbd.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try{
        const usersCollection = client.db('Join-In').collection('users');
        const allPostCollections = client.db('Join-In').collection('allPosts');


        app.post('/users', async(req,res) => {
            const user = req.body; 
            const query = { email: user.email }
            const existingUser = await usersCollection.find(query).toArray()
            if (existingUser.length === 0) {
                const result = await usersCollection.insertOne(user);
                res.send(result);
            }

        })

        app.get('/users', async(req,res) => {
            const query = {};
            const users = await usersCollection.find(query).toArray();
            res.send(users);
        }) 
       

        app.post('/allposts', async(req,res) => {
            const post = req.body;
            const result = await allPostCollections.insertOne(post);
            res.send(result);
        })

        app.get('/allposts', async(req, res) => {
            const query = {};
            const posts = await allPostCollections.find(query).toArray();
            res.send(posts);
        })
    }
    finally{}
}

run()
.catch(err => console.log(err))






const errorHandler = (err, req, res, next) => {
    if(res.headerSent){
        return next(err)
    }
    res.status(500).json({error: err})
}





app.listen(port, () => {
    console.log(`Port is Running on ${port}`);
})



