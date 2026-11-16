import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const port = 5000;
const mongoUri = process.env.MONGO_URI;
const dbName = process.env.DB_NAME;

mongoose.connect(mongoUri, { dbName: dbName })
    .then(() => {
        console.log("Connected to Mongo DB");
    })
    .catch((err) => {
        console.log("Problem with connecting to MongoDB:", err);
    });


// Schema & Model

const movieSchema = new mongoose.Schema({
    title: { type: String, required: true },
    director: String,
    category: { type: String, required: true },
    year: { type: Number, required: true }
});

const Movie = mongoose.model("Movie", movieSchema);

const app = express();

app.use(express.json());


// CRUD

// Create POST

app.post("/api/v1/movies", (req, res) => {

    const newMovie = req.body;

    Movie.create(newMovie)
        .then((result) => {

            res
                .status(200)
                .json({
                    message: "Movie created successfully",
                    data: result
                });

        })
        .catch((err) => {

            res
                .status(500)
                .json({
                    message: "Movie creation failed"
                });

        });
});


// Read movie

app.get("/api/v1/movies", (req, res) => {

    const { category } = req.query;

    const query = category ? { category } : {};

    Movie.find(query)
        .then((result) => {

            res
                .status(200)
                .json({
                    message: "Movie fetched successfully",
                    data: result
                });

        });

});


// Read movie by ID

app.get("/api/v1/movies/:id", (req, res) => {

    const id = req.params.id;

    Movie.findById(id)
        .then((result) => {

            if (result) {

                res
                    .status(200)
                    .json({
                        message: "Movie details fetched successfully",
                        data: result
                    });

            } else {

                res
                    .status(404)
                    .json({
                        message: "Movie Not found"
                    });

            }

        });

});


// Update movie by ID

app.put("/api/v1/movies/:id", (req, res) => {

    const id = req.params.id;

    const updatedMovie = req.body;

    Movie.findByIdAndUpdate(id, updatedMovie, { new: true })
        .then((result) => {

            if (result) {

                res
                    .status(200)
                    .json({
                        message: "Movie updated successfully",
                        data: result
                    });

            } else {

                res
                    .status(404)
                    .json({
                        message: "Movie Not found"
                    });

            }

        });

});


// Delete movie by ID

app.delete("/api/v1/movies/:id", (req, res) => {

    const { id } = req.params;

    const deletedMovie = req.body;

    Movie.findByIdAndDelete(id)
        .then((result) => {

            if (result) {

                res
                    .status(200)
                    .json({
                        message: "Movie deleted successfully",
                        data: result
                    });

            } else {

                res
                    .status(404)
                    .json({
                        message: "Movie Not found"
                    });

            }

        });

});


app.listen(port, () => {

    console.log(`Server running on http://localhost:${port}/api/v1/movies`);

});

