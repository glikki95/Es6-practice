
const express = require("express");
const fs = require("fs");
const path = require("path");
const os = require("os");
const { URL } = require("url");

const app = express();

app.use(express.json());

// 1. HELLO WORLD
app.get("/api/hello", (req, res) => {
    res.send("Hello World!");
});

// 2. PRODUCT CRUD API
let products = [
    { id: 1, name: "Laptop", price: 50000 },
    { id: 2, name: "Mobile", price: 20000 }
];

// Get all products
app.get("/api/products", (req, res) => {
    res.json(products);
});

// Add product
app.post("/api/products", (req, res) => {
    const newProduct = {
        id: Date.now(),
        name: req.body.name,
        price: req.body.price
    };

    products.push(newProduct);
    res.json(newProduct);
});

// Update product
app.put("/api/products/:id", (req, res) => {
    const id = Number(req.params.id);

    const product = products.find(p => p.id === id);

    if (!product) {
        return res.status(404).json({ message: "Product not found" });
    }

    product.name = req.body.name;
    product.price = req.body.price;

    res.json(product);
});

// Delete product
app.delete("/api/products/:id", (req, res) => {
    const id = Number(req.params.id);

    products = products.filter(p => p.id !== id);

    res.json({ message: "Product deleted", products });
});

// 3. FILE SYSTEM MODULE - SYNCHRONOUS
app.get("/api/files/sync", (req, res) => {
    try {
        const file1 = path.join(os.tmpdir(), "sync-file.txt");
        const file2 = path.join(os.tmpdir(), "sync-renamed.txt");

        fs.writeFileSync(file1, "Hello from Sync File System");
        fs.appendFileSync(file1, "\nThis is appended data");

        const data = fs.readFileSync(file1, "utf8");

        fs.renameSync(file1, file2);
        fs.unlinkSync(file2);

        res.json({
            message: "Synchronous file operations completed",
            data: data
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 4. FILE SYSTEM MODULE - ASYNCHRONOUS
app.get("/api/files/async", async (req, res) => {
    try {
        const file1 = path.join(os.tmpdir(), "async-file.txt");
        const file2 = path.join(os.tmpdir(), "async-renamed.txt");

        await fs.promises.writeFile(file1, "Hello from Async File System");
        await fs.promises.appendFile(file1, "\nThis is appended data");

        const data = await fs.promises.readFile(file1, "utf8");

        await fs.promises.rename(file1, file2);
        await fs.promises.unlink(file2);

        res.json({
            message: "Asynchronous file operations completed",
            data: data
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 5. URL MODULE
app.get("/api/url", (req, res) => {
    const myURL = new URL(
        "https://www.example.com:8080/products/list?category=books&sort=asc#section2"
    );

    res.json({
        protocol: myURL.protocol,
        hostname: myURL.hostname,
        port: myURL.port,
        pathname: myURL.pathname,
        search: myURL.search,
        hash: myURL.hash,
        category: myURL.searchParams.get("category"),
        sort: myURL.searchParams.get("sort")
    });
});

// 6. HTTP WEB SERVER
app.get("/api/web", (req, res) => {
    res.send(`
        <h1>Hello World</h1>
        <p>This is a simple HTTP Web Server.</p>
    `);
});

// 7. MANUAL ROUTING
let students = [
    { id: 1, name: "Ravi" },
    { id: 2, name: "Sita" }
];

app.all("/api/manual/students", (req, res) => {
    if (req.method === "GET") {
        return res.json(students);
    }

    if (req.method === "POST") {
        const newStudent = {
            id: Date.now(),
            name: req.body.name
        };

        students.push(newStudent);
        return res.json(newStudent);
    }

    if (req.method === "PUT") {
        const id = Number(req.body.id);
        const student = students.find(s => s.id === id);

        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        student.name = req.body.name;
        return res.json(student);
    }

    if (req.method === "DELETE") {
        const id = Number(req.body.id);
        students = students.filter(s => s.id !== id);

        return res.json({
            message: "Student deleted",
            students
        });
    }

    res.status(405).json({ message: "Method not allowed" });
});

// 8. ARRAY CRUD
let numbers = [10, 20, 30, 40];

// Read array
app.get("/api/array", (req, res) => {
    res.json(numbers);
});

// Add value
app.post("/api/array", (req, res) => {
    numbers.push(req.body.value);
    res.json(numbers);
});

// Update value by index
app.put("/api/array/:index", (req, res) => {
    const index = Number(req.params.index);

    if (!Number.isInteger(index) || index < 0 || index >= numbers.length) {
        return res.status(404).json({ message: "Index not found" });
    }

    numbers[index] = req.body.value;
    res.json(numbers);
});

// Delete value by index
app.delete("/api/array/:index", (req, res) => {
    const index = Number(req.params.index);

    if (!Number.isInteger(index) || index < 0 || index >= numbers.length) {
        return res.status(404).json({ message: "Index not found" });
    }

    numbers.splice(index, 1);
    res.json(numbers);
});

// LOCAL SERVER
if (require.main === module) {
    const PORT = process.env.PORT || 3000;

    app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
    });
}

module.exports = app;
