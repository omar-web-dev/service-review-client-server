require('dotenv').config()
const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()


app.use(cors())
app.use(express.json())


const port = process.env.PORT || 5000

app.get('/', (req, res) => {
  res.send('essuin running is a express')
})





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.uadalh8.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
  try {
    const serviceCollection = client.db('essuin').collection('service')
    const reviewCollection = client.db('essuin').collection('reviews')

    // get single service by id 

    app.get('/service/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: ObjectId(id) }
      const service = await serviceCollection.findOne(query)
      res.send(service)
    })

    // get all services
    app.get('/all-services', async (req, res) => {
      const query = {}
      const cursor = serviceCollection.find(query)
      const courses = await cursor.toArray()
      res.send(courses)
    })
    // get limited services
    app.get('/services', async (req, res) => {
      const query = {}
      const cursor = serviceCollection.find(query)
      const courses = await cursor.limit(3).toArray()
      res.send(courses)
    })
    // get reviews filter by service id
    app.get('/reviews', async (req, res) => {
      let query = {}
      if(req.query.service_ID){
        query = {
           service_ID : req.query.service_ID
        }
      }
          const cursor = reviewCollection.find(query)
          const review = await cursor.toArray()
          res.send(review)
      })


  }
  finally { }

}


run().catch(error => console.error(error))


app.listen(port, () => {
  console.log('server is ', port)
})
