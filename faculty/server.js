
import express from "express";
import fs from "fs";

const app = express();

app.use(express.json());

// Read data from faculty.json
const readData = () => {
    return JSON.parse(
        fs.readFileSync("./faculty.json", "utf-8")
    );
};

// Write data to faculty.json
const writeData = (data) => {
    fs.writeFileSync(
        "./faculty.json",
        JSON.stringify(data, null, 2)
    );
};

// POST - Create faculty
app.post("/api/v1/faculty", (req, res) => {
    const allFaculty = readData();

    const nextId =
        allFaculty.length === 0
            ? 1
            : allFaculty[allFaculty.length - 1].id + 1;

    const newFaculty = {
        id: nextId,
        ...req.body
    };

    allFaculty.push(newFaculty);
    writeData(allFaculty);

    res.status(201).json({
        message: "Faculty created successfully",
        data: newFaculty
    });
});

// GET - Get all faculty
app.get("/api/v1/faculty", (req, res) => {
    const { dept } = req.query;

    let allFaculty = readData();

    if (dept) {
        allFaculty = allFaculty.filter(
            (fac) => fac.dept === dept
        );
    }

    res.status(200).json({
        message: "Faculty retrieved successfully",
        data: allFaculty
    });
});

// GET - Get faculty by ID
app.get("/api/v1/faculty/:id", (req, res) => {
    const facultyId = parseInt(req.params.id);
    const allFaculty = readData();

    const faculty = allFaculty.find(
        (fac) => fac.id === facultyId
    );

    if (faculty) {
        res.status(200).json({
            message: "Faculty retrieved successfully",
            data: faculty
        });
    } else {
        res.status(404).json({
            message: "Faculty not found"
        });
    }
});

// PUT - Update faculty
app.put("/api/v1/faculty/:id", (req, res) => {
    const facultyId = parseInt(req.params.id);
    const allFaculty = readData();

    const facultyIndex = allFaculty.findIndex(
        (fac) => fac.id === facultyId
    );

    if (facultyIndex !== -1) {
        const updatedFaculty = {
            ...allFaculty[facultyIndex],
            ...req.body
        };

        allFaculty[facultyIndex] = updatedFaculty;
        writeData(allFaculty);

        res.status(200).json({
            message: "Faculty updated successfully",
            data: updatedFaculty
        });
    } else {
        res.status(404).json({
            message: "Faculty not found"
        });
    }
});

// DELETE - Delete faculty
app.delete("/api/v1/faculty/:id", (req, res) => {
    const facultyId = parseInt(req.params.id);
    const allFaculty = readData();

    const facultyIndex = allFaculty.findIndex(
        (fac) => fac.id === facultyId
    );

    if (facultyIndex !== -1) {
        const deletedFaculty =
            allFaculty.splice(facultyIndex, 1)[0];

        writeData(allFaculty);

        res.status(200).json({
            message: "Faculty deleted successfully",
            data: deletedFaculty
        });
    } else {
        res.status(404).json({
            message: "Faculty not found"
        });
    }
});

// Start server
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`Server running at port ${PORT}`);
});
