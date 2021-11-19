const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.d62xo.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db('penguinWatch');
        const productsCollection = database.collection('products');
        const reviewsCollection = database.collection('reviews');
        const orderCollection = database.collection('myOrders');

        // GET API
        app.get('/products', async (req, res) => {
            const cursor = productsCollection.find({});
            const products = await cursor.toArray();
            res.send(products);
        });

        // GET Single Product
        app.get('/products/:_id', async (req, res) => {
            const id = req.params._id;
            console.log('getting specific product', id);
            const query = { _id: ObjectId(id) };
            const product = await productsCollection.findOne(query);
            res.json(product);
        })

        //post api
        app.post('/products', async (req, res) => {
            const product = req.body;
            console.log('hit the post api', product);

            const result = await productsCollection.insertOne(product);
            console.log(result);
            res.json(result)
        })

        // GET API(review)
        app.get('/reviews', async (req, res) => {
            const cursor = reviewsCollection.find({});
            const reviews = await cursor.toArray();
            res.send(reviews);
        });

        // GET Single Review
        app.get('/reviews/:_id', async (req, res) => {
            const id = req.params._id;
            console.log('getting specific review', id);
            const query = { _id: ObjectId(id) };
            const review = await reviewsCollection.findOne(query);
            res.json(review);
        })

        //post api(review)
        app.post('/reviews', async (req, res) => {
            const review = req.body;
            console.log('hit the post api', review);

            const result = await reviewsCollection.insertOne(review);
            console.log(result);
            res.json(result)
        })

        //add order
        app.post('/myOrders', async (req, res) => {
            await orderCollection.insertOne(req.body).then((result) => {
                res.send(result)
            })

        })
        //get my orders
        app.get('/myOrders/:email', async (req, res) => {
            const result = await orderCollection.find({ email: req.params.email }).toArray();
            res.send(result);
        });
        // all orderss
        app.get("/allOrders", async (req, res) => {
            const result = await orderCollection.find({}).toArray();
            res.send(result);
        });
    }
    finally {

    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Running Server');
});

app.listen(port, () => {
    console.log('running', port);
})