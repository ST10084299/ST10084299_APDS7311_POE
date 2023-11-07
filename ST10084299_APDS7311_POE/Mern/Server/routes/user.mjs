import express from "express";
import db from "../db/conn.mjs";
import { ObjectId } from "mongodb";
import bcrypt  from "bcrypt"
import jwt from "jsonwebtoken";
import ExpressBrute  from "express-brute";
const router = express.Router();
var store = new ExpressBrute.MemoryStore();
var bruteforce = new ExpressBrute(store);//store state locally, dont use this

// This section will help you get a list of all the users.
router.get("/", async (req, res) => {
  let collection = await db.collection("users");
  let results = await collection.find({}).toArray();
  res.send(results).status(200);
});



// This section will help you get a single record by id
router.get("/:id", async (req, res) => {
  let collection = await db.collection("users");
  let query = {_id: new ObjectId(req.params.id)};
  let result = await collection.findOne(query);

  if (!result) res.send("Not found").status(404);
  else res.send(result).status(200);
});

// This section will help you create a new record.
router.post("/", async (req, res) => {
  let newDocument = {
    username: req.body.username,
    password: req.body.password,
 
  };
  let collection = await db.collection("users");
  let result = await collection.insertOne(newDocument);
  res.send(result).status(204);
});

// This section will help you update a record by id.
router.patch("/:id", async (req, res) => {
  const query = { _id: new ObjectId(req.params.id) };
  const updates =  {
    $set: {
      username: req.body.username,
      password: req.body.password,
      
    }
  };

  let collection = await db.collection("users");
  let result = await collection.updateOne(query, updates);

  res.send(result).status(200);
});

// This will allow  you delete a user
router.delete("/:id", async (req, res) => {
  const query = { _id: new ObjectId(req.params.id) };

  const collection = db.collection("users");
  let result = await collection.deleteOne(query);

  if (result.deletedCount === 1) {
    res.status(200).send({ message: "User have been successfully deleted!" });
  } else {
    res.status(404).send({ message: "User have not been found." });
  }
});

// this will add  a new user to the mongo db

/*router.post("/register", async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  let newDocument = {
    username: req.body.username,
    password: hashedPassword.toString()
  };
  let collection = await db.collection("users");
  let result = await collection.insertOne(newDocument);
  console.log(hashedPassword);
  res.status(204).send(result);
});
*/

router.post("/register", async (req, res) => {
  try {
    let collection = await db.collection("users");

    // Check if the username already exists
    const existingUser = await collection.findOne({ username: req.body.username });
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    // If the username is unique, proceed with registration
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    let newDocument = {
      username: req.body.username,
      password: hashedPassword.toString()
    };

    let result = await collection.insertOne(newDocument);
    console.log(hashedPassword);
    res.status(204).send(result);
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// this will login user 

router.post("/login", bruteforce.prevent, async (req, res) => {
  const { username, password } = req.body;

  try {
    const collection = await db.collection("users");
    const user = await collection.findOne({ username });

    if (!user) {
      return res.status(401).json({ message: "Authentication has failed" });
    }

    // compare the provided password with the hashed password in the database
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Authentication has failed" });
    }

    // authentication successful
    const token = jwt.sign(
      { username: req.body.username, password: req.body.password },
      "this_secret_should_be_longer_than_it_is",
      { expiresIn: "1h" }
    );

    console.log("Your new token is", token);
    res.status(200).json({ message: "Authentication was successful", token });
    // Move the res.send(token) statement here if needed for some reason.
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Login failed" });
  }
});


/*
router.post("/signin", bruteforce.prevent, async (req, res) => {
  const { username, password } = req.body;
  try {
    const collection = await db.collection("users");
    const user = await collection.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "Authentication has failed" });
    }
    // Compare the provided password with the hashed password in the database
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Authentication has failed" });
    }
    // Authentication successful
    const token = jwt.sign(
      { username: req.body.username, password: req.body.password },
      "this_secret_should_be_longer_than_it_is",
      { expiresIn: "1h" }
    );
    console.log("Your new token is", token);
    res.status(200).json({ message: "Authentication was successful" });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Login failed" });
  }
});
*/
router.post("/signout", async (req, res) => {
  const token = req.headers.authorization;

  try {
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Decode the token to get user information
    const decodedToken = jwt.verify(token, "this_secret_should_be_longer_than_it_is");

    console.log("User signed out:", decodedToken.username);

    // Uncomment and implement your token invalidation logic
    // invalidateToken(token);

    res.status(200).json({ message: "Signout successful" });
  } catch (error) {
    console.error("Signout error:", error);

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: "Token has expired" });
    }

    res.status(500).json({ message: "Signout failed" });
  }
});


export default router;

