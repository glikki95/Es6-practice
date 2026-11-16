import express from "express";
import cors from "cors";
import morgan from "morgan";
import fs from "fs";
const app = express();
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const logger = (req, res, next) => {
    const start = Date.now();
    res.on("finish", () => {
        const period = Date.now() - start;
        const log = `${req.method} ${req.url} ${res.statusCode} ${period}ms\n`;
        fs.appendFile("./server.log", log, (err) => {
            if (err) {
                console.log(err);
            }
        });
    });
    next();
};
app.use(logger);
const patients = [];
// Validation middleware
const validatePatient = (req, res, next) => {
    if (!req.body) {
        const err = new Error("Patient details missing");
        err.statusCode = 400;
        throw err;
    }
    const { name, gender, ward } = req.body;
    if (!name || !gender || !ward) {
        const err = new Error("Patient details missing");
        err.statusCode = 400;
        throw err;
    }
    next();
};
const PORT = 5000;
// CREATE
app.post("/api/v1/patients", validatePatient, (req, res) => {
    const patient = {
        id: patients.length + 1,
        ...req.body
    };
    patients.push(patient);
    res.status(200).send("Patient created successfully");
});
// READ ALL / FILTER BY WARD
app.get("/api/v1/patients", (req, res) => {
    const ward = req.query.ward;
    if (ward) {
        const filteredPatients = patients.filter(
            patient => patient.ward === ward
        );
        res.status(200).send(filteredPatients);
    } else {
        res.status(200).send(patients);
    }
});
// READ BY ID
app.get("/api/v1/patients/:id", (req, res) => {
    const id = req.params.id;
    const patient = patients.find(
        patient => patient.id === parseInt(id)
    );
    if (patient) {
        res.status(200).send(patient);
    } else {
        res.status(404).send("Patient not found");
    }
});
// UPDATE
app.put("/api/v1/patients/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const patientIndex = patients.findIndex(
        patient => patient.id === id
    );
    if (patientIndex !== -1) {
        patients[patientIndex] = {
            ...patients[patientIndex],
            ...req.body
        };
        res.status(200).send("Patient updated successfully");
    } else {
        res.status(404).send("Patient not found");
    }
});
// DELETE
app.delete("/api/v1/patients/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const patientIndex = patients.findIndex(
        patient => patient.id === id
    );
    if (patientIndex !== -1) {
        patients.splice(patientIndex, 1);
        res.status(200).send("Patient deleted successfully");
    } else {
        res.status(404).send("Patient not found");
    }
});
// 404 Middleware
app.use((req, res) => {
    res.status(404).send("Resource not found");
});
// Error Handling Middleware
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(statusCode).send(message);
});
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});