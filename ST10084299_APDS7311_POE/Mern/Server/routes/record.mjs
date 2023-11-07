import express from "express";
import db from "../db/conn.mjs";
import { ObjectId } from "mongodb";
import CheckAuth from "../check-auth.mjs";
import jwt from "jsonwebtoken";
import multer from 'multer';

const router = express.Router();

// This section will help you get a list of all the records.
router.get("/", async (req, res) => {
  let collection = await db.collection("records");
  let results = await collection.find({}).toArray();
  res.send(results).status(200);
});

// This section will help you get a single record by id
router.get("/:id", async (req, res) => {
  let collection = await db.collection("records");
  let query = { _id: new ObjectId(req.params.id) };
  let result = await collection.findOne(query);

  if (!result) res.send("Not found").status(404);
  else res.send(result).status(200);
});

// This section will help you create a new record.

const upload = multer({ dest: 'uploads/' });

router.post("/create", upload.single('image'), (req, res) => {
  const checkAuth = new CheckAuth(req, res, async () => {
    try {
      let newDocument = {
        username: req.body.username,
        caption: req.body.caption,
        hashtag: req.body.hashtag,
        image: req.file ? req.file.path : null,
      };

      let collection = db.collection("records");
      let result = await collection.insertOne(newDocument);
      res.status(204).send(result);
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  });

  checkAuth.checkToken();
});
/* This section will help you update a record by id.
router.patch("/update/:id", async (req, res) => {
  const checkAuth = new CheckAuth(req, res, async () => {
    const query = { _id: new ObjectId(req.params.id) };
    const updates = {
      $set: {
        username: req.body.username,
        caption: req.body.caption,
        image: req.file ? req.file.path : null,
      }
    };

    try {
      let collection = db.collection("records");
      let result = await collection.updateOne(query, updates);
      res.status(200).send(result);
    } catch (error) {
      res.status(500).send(error.message);
    }
  });

  checkAuth.checkToken();
});*/
router.patch("/update/:id", upload.single('image'), async (req, res) => {
  const checkAuth = new CheckAuth(req, res, async () => {
    const query = { _id: new ObjectId(req.params.id) };
    
    // Check if a file is provided in the request
    const updates = {
      $set: {
        username: req.body.username,
        caption: req.body.caption,
        hashtag: req.body.hashtag,
        // Only update image if a file is provided
        image: req.file ? req.file.path : null,
      }
    };

    try {
      let collection = db.collection("records");
      let result = await collection.updateOne(query, updates);
      res.status(200).send(result);
    } catch (error) {
      res.status(500).send(error.message);
    }
  });

  checkAuth.checkToken();
});


// This section will help you delete a record
router.delete("/:id", async (req, res) => {
  const query = { _id: new ObjectId(req.params.id) };
  const collection = db.collection("records");
  let result = await collection.deleteOne(query);
  res.send(result).status(200);
});

/*router.post("/", async (req, res) => {
  let newDocument = {
    username: req.body.username,
    caption: req.body.caption,
    image: req.file ? req.file.path : null,
  };
  let collection = await db.collection("records");
  let result = await collection.insertOne(newDocument);
  res.send(result).status(204);
});*/


export default router;
