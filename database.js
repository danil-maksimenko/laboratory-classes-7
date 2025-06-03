const { MongoClient } = require("mongodb");
const { DB_USER, DB_PASS } = require("./config");

let database;

async function mongoConnect(callback) {
  const uri = `mongodb+srv://${DB_USER}:${DB_PASS}@cluster0.9mpreoz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("Connection to the database has been established.");

    database = client.db("shop");
    callback();
  } catch (error) {
    console.error("Database connection failed:", error);
  }
}

function getDatabase() {
  if (!database) {
    throw new Error("No database found.");
  }
  return database;
}

module.exports = { mongoConnect, getDatabase };
