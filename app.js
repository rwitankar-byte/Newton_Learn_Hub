const express = require("express");
const pool = require("./db");

const app = express();

app.use(express.json());


// GET all assignments
app.get("/assignments", async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM assignments ORDER BY id"
        );

        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to fetch assignments"
        });
    }
});


// GET one assignment
app.get("/assignments/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            "SELECT * FROM assignments WHERE id = $1",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Assignment not found"
            });
        }

        res.json(result.rows[0]);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to fetch assignment"
        });
    }
});


// POST assignment
app.post("/assignments", async (req, res) => {
    try {
        const { title, deadline } = req.body;

        const result = await pool.query(
            `INSERT INTO assignments (title, deadline)
             VALUES ($1, $2)
             RETURNING *`,
            [title, deadline]
        );

        res.status(201).json(result.rows[0]);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to create assignment"
        });
    }
});


// PUT assignment
app.put("/assignments/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { title, deadline, submitted } = req.body;

        const result = await pool.query(
            `UPDATE assignments
             SET title = $1, deadline = $2, submitted = $3
             WHERE id = $4
             RETURNING *`,
            [title, deadline, submitted, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Assignment not found"
            });
        }

        res.json(result.rows[0]);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to update assignment"
        });
    }
});


// DELETE assignment
app.delete("/assignments/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            "DELETE FROM assignments WHERE id = $1 RETURNING *",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Assignment not found"
            });
        }

        res.json(result.rows[0]);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to delete assignment"
        });
    }
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});