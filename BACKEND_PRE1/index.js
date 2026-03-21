require('dotenv').config()
const express = require('express')
const mysql = require('mysql2/promise')
const cors = require('cors')

const app = express()
const port = process.env.PORT || 8000

app.use(cors())
app.use(express.json())

let conn = null

// เชื่อมต่อ MySQL
const initMySQL = async () => {
    conn = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT
    })
    console.log('เชื่อมต่อ MySQL สำเร็จ')
}

// ==================== EMPLOYEE ====================

// GET /employees - ดูพนักงานทั้งหมด
app.get('/employees', async (req, res) => {
    try {
        const [rows] = await conn.query('SELECT * FROM employees')
        res.json(rows)
    } catch (error) {
        res.status(500).json({ message: 'เกิดข้อผิดพลาด', error: error.message })
    }
})

// GET /employees/:id - ดูพนักงานคนเดียว
app.get('/employees/:id', async (req, res) => {
    try {
        const [rows] = await conn.query('SELECT * FROM employees WHERE id = ?', [req.params.id])
        if (rows.length === 0) return res.status(404).json({ message: 'ไม่พบพนักงาน' })
        res.json(rows[0])
    } catch (error) {
        res.status(500).json({ message: 'เกิดข้อผิดพลาด', error: error.message })
    }
})

// POST /employees - เพิ่มพนักงาน
app.post('/employees', async (req, res) => {
    try {
        const { name, position, department } = req.body
        if (!name || !position || !department) {
            return res.status(400).json({ message: 'กรุณากรอกข้อมูลให้ครบถ้วน' })
        }
        const [result] = await conn.query(
            'INSERT INTO employees (name, position, department) VALUES (?, ?, ?)',
            [name, position, department]
        )
        res.status(201).json({ message: 'เพิ่มพนักงานสำเร็จ', id: result.insertId })
    } catch (error) {
        res.status(500).json({ message: 'เกิดข้อผิดพลาด', error: error.message })
    }
})

// PUT /employees/:id - แก้ไขพนักงาน
app.put('/employees/:id', async (req, res) => {
    try {
        const { name, position, department } = req.body
        const [result] = await conn.query(
            'UPDATE employees SET name=?, position=?, department=? WHERE id=?',
            [name, position, department, req.params.id]
        )
        if (result.affectedRows === 0) return res.status(404).json({ message: 'ไม่พบพนักงาน' })
        res.json({ message: 'แก้ไขข้อมูลสำเร็จ' })
    } catch (error) {
        res.status(500).json({ message: 'เกิดข้อผิดพลาด', error: error.message })
    }
})

// DELETE /employees/:id - ลบพนักงาน
app.delete('/employees/:id', async (req, res) => {
    try {
        const [result] = await conn.query('DELETE FROM employees WHERE id=?', [req.params.id])
        if (result.affectedRows === 0) return res.status(404).json({ message: 'ไม่พบพนักงาน' })
        res.json({ message: 'ลบพนักงานสำเร็จ' })
    } catch (error) {
        res.status(500).json({ message: 'เกิดข้อผิดพลาด', error: error.message })
    }
})

// ==================== ATTENDANCE ====================

// POST /attendance/checkin - เช็คอิน
app.post('/attendance/checkin', async (req, res) => {
    try {
        const { employee_id } = req.body
        const today = new Date().toISOString().slice(0, 10)

        const [existing] = await conn.query(
            'SELECT * FROM attendance WHERE employee_id=? AND date=?',
            [employee_id, today]
        )
        if (existing.length > 0) return res.status(400).json({ message: 'เช็คอินไปแล้ววันนี้' })

        await conn.query(
            'INSERT INTO attendance (employee_id, date, check_in) VALUES (?, ?, NOW())',
            [employee_id, today]
        )
        res.status(201).json({ message: 'เช็คอินสำเร็จ' })
    } catch (error) {
        res.status(500).json({ message: 'เกิดข้อผิดพลาด', error: error.message })
    }
})

// POST /attendance/checkout - เช็คเอาท์
app.post('/attendance/checkout', async (req, res) => {
    try {
        const { employee_id } = req.body
        const today = new Date().toISOString().slice(0, 10)

        const [rows] = await conn.query(
            'SELECT * FROM attendance WHERE employee_id=? AND date=?',
            [employee_id, today]
        )
        if (rows.length === 0) return res.status(400).json({ message: 'ยังไม่ได้เช็คอินวันนี้' })
        if (rows[0].check_out) return res.status(400).json({ message: 'เช็คเอาท์ไปแล้ววันนี้' })

        const checkIn = new Date(rows[0].check_in)
        const checkOut = new Date()
        const hours = (checkOut - checkIn) / (1000 * 60 * 60)
        const ot_hours = Math.max(hours - 8, 0)

        await conn.query(
            'UPDATE attendance SET check_out=NOW(), total_hours=?, ot_hours=? WHERE id=?',
            [hours.toFixed(2), ot_hours.toFixed(2), rows[0].id]
        )
        res.json({
            message: 'เช็คเอาท์สำเร็จ',
            total_hours: hours.toFixed(2),
            ot_hours: ot_hours.toFixed(2)
        })
    } catch (error) {
        res.status(500).json({ message: 'เกิดข้อผิดพลาด', error: error.message })
    }
})

// GET /attendance/:employee_id - ดูประวัติเข้างาน
app.get('/attendance/:employee_id', async (req, res) => {
    try {
        const [rows] = await conn.query(
            'SELECT * FROM attendance WHERE employee_id=? ORDER BY date DESC',
            [req.params.employee_id]
        )
        res.json(rows)
    } catch (error) {
        res.status(500).json({ message: 'เกิดข้อผิดพลาด', error: error.message })
    }
})

// ==================== REPORT ====================

// GET /report/monthly - รายงานรายเดือน
app.get('/report/monthly', async (req, res) => {
    try {
        const { year, month } = req.query
        if (!year || !month) return res.status(400).json({ message: 'กรุณาระบุ year และ month' })

        const [rows] = await conn.query(`
            SELECT e.id, e.name, e.position, e.department,
                COUNT(a.id) as work_days,
                COALESCE(SUM(a.total_hours), 0) as total_hours,
                COALESCE(SUM(a.ot_hours), 0) as total_ot
            FROM employees e
            LEFT JOIN attendance a ON e.id = a.employee_id
                AND YEAR(a.date) = ? AND MONTH(a.date) = ?
            GROUP BY e.id
        `, [year, month])

        res.json({ year, month, report: rows })
    } catch (error) {
        res.status(500).json({ message: 'เกิดข้อผิดพลาด', error: error.message })
    }
})

app.listen(port, async () => {
    await initMySQL()
    console.log(`Server รันอยู่ที่ port ${port}`)
})