// Create a transaction
import {query} from "../config/db.js";

export async function Transaction(req, res) {
    try {
        const { user_id, title, amount, category, type } = req.body;

        if (!user_id || !title || !category || !type || amount === undefined) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (type !== 'income' && type !== 'expense') {
            return res.status(400).json({ message: "Type must be 'income' or 'expense'" });
        }

        // Ensure amount is positive
        const positiveAmount = Math.abs(amount);

        const result = await query(
            `INSERT INTO transactions (user_id, title, amount, category, type)
             VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [user_id, title, positiveAmount, category, type]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error("Error creating transaction:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

// Get all transactions by user_id (use authenticated user id)
export async function getTransactions(req, res) {
    try {
        const userId = req.user.id;

        const result = await query(
            `SELECT * FROM transactions WHERE user_id = $1 ORDER BY created_at DESC`,
            [userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "No transactions found for this user" });
        }

        res.status(200).json(result.rows);
    } catch (error) {
        console.error("Error getting transactions:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

// Delete a transaction by ID (optionally check ownership)
export async function deleteTransactions(req, res) {
    try {
        const userId = req.user.id;
        const { id } = req.params;

        // Optional: ensure user owns the transaction before deleting
        const existing = await query(
            `SELECT * FROM transactions WHERE id = $1 AND user_id = $2`,
            [id, userId]
        );

        if (existing.rows.length === 0) {
            return res.status(404).json({ message: "Transaction not found or not authorized" });
        }

        await query(`DELETE FROM transactions WHERE id = $1`, [id]);

        res.status(200).json({ message: "Transaction deleted successfully" });
    } catch (error) {
        console.error("Error deleting transaction:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

// Transaction summary
export async function transactionSummary(req, res) {
    try {
        const userId = req.user.id;

        const balanceResult = await query(
            `SELECT
                 COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE -amount END), 0) AS balance
             FROM transactions WHERE user_id = $1`,
            [userId]
        );

        const incomeResult = await query(
            `SELECT COALESCE(SUM(amount), 0) AS income FROM transactions WHERE user_id = $1 AND type = 'income'`,
            [userId]
        );

        const expenseResult = await query(
            `SELECT COALESCE(SUM(amount), 0) AS expenses FROM transactions WHERE user_id = $1 AND type = 'expense'`,
            [userId]
        );

        res.status(200).json({
            balance: balanceResult.rows[0].balance,
            income: incomeResult.rows[0].income,
            expenses: expenseResult.rows[0].expenses,
        });
    } catch (error) {
        console.error("Error getting summary:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
