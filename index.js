const express = require('express');
const bodyParser = require('body-parser');
const e = require('express');
const app = express();
const port = 8000;

app.use(bodyParser.json());

let users = []
let counter = 1;

//part = GET /users
app.get('/users',(req, res)=>{
    res.json(users);
});

//path = POST /user
app.post('/user',(req, res) => {
    let user = req.body;
    user.id = counter
    counter += 1
    users.push(user);
    res.json({
        message: 'User added successfully',user: user});
})

//path = PUT /user/:id
app.put('/user/:id',(req, res)=>{
    let id = req.params.id
    let updatedUser = req.body
    //หา users จาก id
    let selectedIndex = users.findIndex(user => user.id == id)

    //update users นั้น
    if (update)
    users[selectedIndex].name = updatedUser.name || user[selectedIndex].name;
    users[selectedIndex].email = updatedUser.email || user[selectedIndex].email;
    users[selectedIndex].age = updatedUser.age || user[selectedIndex].age;

    //ส่ง response กลับไปว่า update users ที่เลือกสำเร็จแล้ว
    res.json({
        message: 'User updated succressfully',
        data: {
            user: updatedUser,
            indexUpdated:selectedIndex
        }
    })
})

//path = DELETE /users/:id
app.delete('/users/:id',(req, res) => {
    let id = req.params.id
    let selectedIndex = users.findIndex(user => user.id == id)
    if (selectedIndex !== -1){
        users.splice(selectedIndex,1)
        res.json({
            message:'User deleted successfully',
            data: {
                indexDeleted: selectedIndex
            }
        })
    }else{
        res.status(404).json({
            message: 'User not found'
        })
    }
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});