import express from 'express';
import { MongoClient, ObjectId } from 'mongodb';

const app = express();

app.use(express.json());

const url = "mongodb://localhost:27017";
const client = new MongoClient(url);

// Change this line:
const dbName = "booksdb"; // Match the exact case already present in MongoDB

let db;

// FIXED: Start listening ONLY after MongoDB successfully connects
client.connect()
    .then(() => {
        console.log("Connected to Mongo DB");
        db = client.db(dbName);

        // Run the server here so 'db' is ready when a request arrives
        app.listen(5000, () => {
            console.log("App running on http://localhost:5000");
        });
    })
    .catch((err) => {
        console.log("problem in connection MongoDB", err);
        process.exit(1); // Stop the server if it can't connect to the DB
    });


// CRUD

// Create - POST
app.post("/api/v1/books", (req, res) => {
    const newBook = req.body;

    db.collection("books").insertOne(newBook)
        .then((result) => {
            res.status(201).json({
                message: "Book Created Successfully",
                data: {
                    _id: result.insertedId,
                    ...newBook
                }
            });
        })
        .catch((err) => {
            console.log(err);
            // FIXED: Send an error response back so curl doesn't hang
            res.status(500).json({
                message: "Internal Server Error",
                error: err.message
            });
        });
});


// READ
app.get("/api/v1/books", (req, res) => {
    const { category } = req.query;
    const query = category ? { category: category } : {};

    db.collection("books")
        .find(query)
        .toArray()
        .then((result) => {
            res.status(200).json({
                message: "Books retrieved successfully",
                data: result
            });
        })
        .catch((err) => {
            console.log(err);
            // FIXED: Send an error response back so curl doesn't hang
            res.status(500).json({
                message: "Internal Server Error",
                error: err.message
            });
        });
});


// READ by id
app.get("/api/v1/books/:id", (req, res) => {
    const { id } = req.params;

    db.collection("books")
        .findOne({
            _id: new ObjectId(id)
        })
        .then((result) => {
            if (result) {
                res.status(200).json({
                    message: "Book retrieved successfully",
                    data: result
                });
            } else {
                const error = new Error("Book not found");
                error.status = 404;
                throw error;
            }
        })
        .catch((err) => {
            const status = err.status || 500;
            const message = err.message || "Internal Server Error";
            res.status(status).json({
                message: message
            });
        });
});


// Update books by id
app.put("/api/v1/books/:id", (req, res) => {
    const { id } = req.params;
    const updatedBook = req.body;

    db.collection("books")
        .updateOne(
            { _id: new ObjectId(id) },
            { $set: updatedBook }
        )
        .then((result) => {
            if (result.matchedCount === 1) {
                res.status(200).json({
                    data: {
                        _id: new ObjectId(id),
                        ...updatedBook
                    }
                });
            } else {
                const error = new Error("Book not found");
                error.status = 404;
                throw error;
            }
        })
        .catch((err) => {
            const status = err.status || 500;
            const message = err.message || "Internal Server Error";
            res.status(status).json({
                message: message
            });
        });
});


// Delete Book by id
app.delete("/api/v1/books/:id", (req, res) => {
    const { id } = req.params;

    db.collection("books")
        .deleteOne({
            _id: new ObjectId(id)
        })
        .then((result) => {
            if (result.deletedCount === 1) {
                res.status(200).json({
                    message: "Book deleted successfully"
                });
            } else {
                const error = new Error("Book not found");
                error.status = 404;
                throw error;
            }
        })
        .catch((err) => {
            const status = err.status || 500;
            const message = err.message || "Internal Server Error";
            res.status(status).json({
                message: message
            });
        });
});


// 404 middleware
app.use((req, res) => {
    res.status(404).json({
        message: "Route Not Found"
    });
});


// Error handling
app.use((err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({
        message: message
    });
});