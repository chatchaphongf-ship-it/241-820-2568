const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
const e = require('express');
const app = express();
const port = 8000;

app.use(bodyParser.json());

let users = []
let counter = 1;
let conn = null
const initMySQL = async () => {
    conn = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'webdb',
        port: 8820
    });
}


//part = GET /users 
app.get('/users',async (req, res)=>{
    const results = await conn.query('SELECT * FROM users');
    res.json(results[0]);
});

//path = GET /users สำหรับเพื่ม user ใหม่

//path = POST /user
app.post('/user',async (req, res) => {
    try{
        let user = req.body;
        const results = await conn.query('INSERT INTO users SET ?', user);
        res.json({
        message: 'User created successfully',
        data: results[0]
    })

    } catch (error){
        console.error('Error creating user:', error);
        res.status(500).json({
            message: 'Error creating user',
            error: error.message
        })
    }
})

//path = GET /users/:id สำหรับ get ข้อมูล user ที่มี id
app.get('/users/:id', async (req, res) => {
    try {
        let id = req.params.id;
        const results = await conn.query('SELECT * FROM users WHERE id = ?', [id]);
        if (results[0].length === 0) {
            throw {statusCode: 404, message: 'User not found'};
        }



        res.json(results[0][0]);
    } catch (error) {
        console.error('Error fetching user:', error.message);
        let statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            message: 'Error fetching user',
            error: error.message
        })
    }
})

//PUT /user/:id แก้ไข user ที่มี id
app.put('/users/:id',(req, res)=>{
    
    res.json({
        message: 'User updated successfully',
        data: {
            id: req.params.id,
            updatedUser: req.body
        }
    })
})

//path = DELETE /user/:id ลบ user ที่มี id
app.delete('/users/:id', async (req, res) => {
    try {
        let id = req.params.id;
        const results = await conn.query('DELETE FROM users WHERE id = ?', [id]);
        if (results[0].affectedRows === 0) {
            throw {statusCode: 404, message: 'User not found'};
        }
        res.json({
            message: 'User deleted successfully'
        });
    }
    catch (error) {
        console.error('Error deleting user:', error.message);
        let statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            message: 'Error deleting user',
            error: error.message
        })
    }
    
})

app.listen(port, async () => {
    await initMySQL();
    console.log(`Server is running on port ${port}`);
});