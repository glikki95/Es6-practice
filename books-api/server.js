
import express from 'express';
import { MongoClient, ObjectId } from 'mongodb';

const app = express();

app.use(express.json());

// MongoDB connection from Environment Variable
const url = process.env.MONGODB_URI;
const dbName = 'booksdb';

const client = new MongoClient(url);

let db;

// Connect to MongoDB
async function connectDB() {
    try {
        await client.connect();

        console.log('Connected to MongoDB');

        db = client.db(dbName);

        const PORT = process.env.PORT || 5000;

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });

    } catch (err) {
        console.log('MongoDB connection error:', err.message);
        process.exit(1);
    }
}

connectDB();


// CREATE - POST
app.post('/api/v1/books', async (req, res) => {
    try {
        const newBook = req.body;

        const result = await db.collection('books').insertOne(newBook);

        res.status(201).json({
            message: 'Book Created Successfully',
            data: {
                _id: result.insertedId,
                ...newBook
            }
        });

    } catch (err) {
        res.status(500).json({
            message: 'Internal Server Error',
            error: err.message
        });
    }
});


// READ - GET ALL BOOKS
app.get('/api/v1/books', async (req, res) => {
    try {
        const { category } = req.query;

        const query = category ? { category } : {};

        const result = await db.collection('books')
            .find(query)
            .toArray();

        res.status(200).json({
            message: 'Books retrieved successfully',
            data: result
        });

    } catch (err) {
        res.status(500).json({
            message: 'Internal Server Error',
            error: err.message
        });
    }
});


// READ - GET BOOK BY ID
app.get('/api/v1/books/:id', async (req, res) => {
    try {
        const { id } = req.params;

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({
                message: 'Invalid Book ID'
            });
        }

        const result = await db.collection('books').findOne({
            _id: new ObjectId(id)
        });

        if (!result) {
            return res.status(404).json({
                message: 'Book not found'
            });
        }

        res.status(200).json({
            message: 'Book retrieved successfully',
            data: result
        });

    } catch (err) {
        res.status(500).json({
            message: 'Internal Server Error',
            error: err.message
        });
    }
});


// UPDATE - PUT
app.put('/api/v1/books/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updatedBook = req.body;

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({
                message: 'Invalid Book ID'
            });
        }

        const result = await db.collection('books').updateOne(
            { _id: new ObjectId(id) },
            { $set: updatedBook }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({
                message: 'Book not found'
            });
        }

        res.status(200).json({
            message: 'Book updated successfully'
        });

    } catch (err) {
        res.status(500).json({
            message: 'Internal Server Error',
            error: err.message
        });
    }
});


// DELETE
app.delete('/api/v1/books/:id', async (req, res) => {
    try {
        const { id } = req.params;

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({
                message: 'Invalid Book ID'
            });
        }

        const result = await db.collection('books').deleteOne({
            _id: new ObjectId(id)
        });

        if (result.deletedCount === 0) {
            return res.status(404).json({
                message: 'Book not found'
            });
        }

        res.status(200).json({
            message: 'Book deleted successfully'
        });

    } catch (err) {
        res.status(500).json({
            message: 'Internal Server Error',
            error: err.message
        });
    }
});


// 404 ROUTE
app.use((req, res) => {
    res.status(404).json({
        message: 'Route Not Found'
    });
});
