const express = require("express");
const cors = require("cors");
const app = express();

const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// user:rokib
// pass: EAJPmuhb3LEz1uJE

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri =
  "mongodb+srv://rokib:EAJPmuhb3LEz1uJE@cluster0.ghltq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const notesCollection = client.db("notesTaker").collection("notes");

    // get all notes using get method
    // http://localhost:5000/notes
    app.get("/notes", async (req, res) => {
      const q = req.query;
      const cursor = notesCollection.find(q);
      const result = await cursor.toArray();
      res.send(result);
    });

    // create a note using post
    // http://localhost:5000/note
    app.post("/note", async (req, res) => {
      const data = req.body;
      console.log(data);
      const result = await notesCollection.insertOne(data);
      res.send(result);
    });

    // update a note using put method
    // http://localhost:5000/note/62642d6e15e58fa28951096e
    app.put("/note/:id", async (req, res) => {
      const id = req.params.id;
      const data = req.body;
      console.log(data);
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          ...data,
        },
      };
      const result = await notesCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.send(result);
    });

    // delete a note usring delete method
    // http://localhost:5000/note/62642d6e15e58fa28951096e
    app.delete("/note/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const result = await notesCollection.deleteOne(filter);
      res.send(result);
    });
    console.log("connected to db");
  } finally {
  }
}

run().catch(console.dir);
// client.connect((err) => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   console.log("connected to db");
//   //   client.close();
// });

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log("Listening to port", port);
});
