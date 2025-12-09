const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const initData = require("./data.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/Wanderlust";

main()
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch(err => {
        console.error("Error connecting to MongoDB", err);
    });

async function main() {
    await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
    // await Listing.deleteMany({}); // Clear existing listings
    initData.data = initData.data.map((obj) => ({ ...obj, owner: "69343ccf57cd55a18d06d8f6" }));
    await Listing.insertMany(initData.data);
    console.log("Database initialized with sample data");
};

initDB();


