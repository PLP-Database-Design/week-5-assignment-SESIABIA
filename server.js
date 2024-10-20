const express = require('express');
const app = express();
const mysql = require('mysql2');
require('dotenv').config();

// Setup the database connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Test database connection
db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the MySQL database.');
});

// Question 1 - Retrieve all patients
app.get('/patients', (req, res) => {
    const sql = 'SELECT patient_id, first_name, last_name, date_of_birth FROM Patients';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error retrieving patients:', err);
            res.status(500).send('Error retrieving patients');
            return;
        }
        res.json(results);
    });
});

// Question 2 - Retrieve all providers
app.get('/providers', (req, res) => {
    const sql = 'SELECT first_name, last_name, provider_specialty FROM Providers';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error retrieving providers:', err);
            res.status(500).send('Error retrieving providers');
            return;
        }
        res.json(results);
    });
});

// Question 3 - Filter patients by first name
app.get('/patients/:first_name', (req, res) => {
    const firstName = req.params.first_name;
    const sql = 'SELECT patient_id, first_name, last_name, date_of_birth FROM Patients WHERE first_name = ?';
    db.query(sql, [firstName], (err, results) => {
        if (err) {
            console.error('Error retrieving patients:', err);
            res.status(500).send('Error retrieving patients');
            return;
        }
        if (results.length === 0) {
            res.status(404).send('No patients found with that first name');
        } else {
            res.json(results);
        }
    });
});

// Question 4 - Retrieve all providers by specialty
app.get('/providers/specialty/:specialty', (req, res) => {
    const specialty = req.params.specialty;
    const sql = 'SELECT first_name, last_name, provider_specialty FROM Providers WHERE provider_specialty = ?';
    db.query(sql, [specialty], (err, results) => {
        if (err) {
            console.error('Error retrieving providers:', err);
            res.status(500).send('Error retrieving providers');
            return;
        }
        if (results.length === 0) {
            res.status(404).send('No providers found with that specialty');
        } else {
            res.json(results);
        }
    });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
