import express from 'express';
import dotenv from 'dotenv';
import { sql } from "./config/db.js";
import cors from 'cors';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());

//cors policy
app.use(cors());


// Initialize database
async function initDB() {
  try {
    await sql`CREATE TABLE IF NOT EXISTS transactions (
      id SERIAL PRIMARY KEY,
      user_id VARCHAR(255) NOT NULL,
      title VARCHAR(255) NOT NULL,
      amount DECIMAL(10,2) NOT NULL,
      category VARCHAR(255) NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    )`;
    console.log("Database initialized successfully");
  } catch (error) {
    console.error("Error initializing database:", error);
    process.exit(1);
  }
}

// Test endpoint
app.get('/', (req, res) => {
  res.send('Server is working');
});
// POST endpoint for creating transactions
app.post("/api/transactions", async (req, res) => {
  try {
    const { user_id, title, amount, category } = req.body;

    if (!user_id || !title || !category || amount === undefined) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const transaction = await sql`INSERT INTO transactions(user_id, title, amount, category)
      VALUES (${user_id}, ${title}, ${amount}, ${category})
      RETURNING *`;

    res.status(201).json(transaction[0]);
  } catch (error) {
    console.error("Error creating transaction:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
//to get all transaction by userid
app.get("/api/transactions/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Looking for user_id:", id); // ✅ Log the incoming ID

    const transactions = await sql`SELECT * FROM transactions WHERE user_id = ${id}`;


    if (transactions.length === 0) {
      return res.status(404).json({ message: "No transactions found for this user" });
    }

    res.status(200).json(transactions);
  } catch (error) {
    console.error("Error getting transactions:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
//to delete transaction
app.delete("/api/transactions/:id", async (req, res) => {
  try {
    const {id} = req.params;
    const result = await sql`DELETE FROM transactions WHERE id = ${id} RETURNING *`;
    if (result.length === 0) {
      return res.status(404).json({ message: "Transaction not found" });
    }
    res.status(200).json({message: "Transaction deleted successfully"});
  }
  catch (error) {
    console.error("Error deleting transaction:", error);
    res.status(500).json({ message: "Internal server error" });
  }
})

// Start server
initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
