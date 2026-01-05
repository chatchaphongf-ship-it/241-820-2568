/*
====================
Variable
====================
*/
let a = 10
let b = 20
let c = 30
console.log('a:', a, 'b:', b, 'c:', c)

/*
====================
Array
====================
*/
let ages = [10, 20, 30]
console.log('ages:', ages)
console.log('ages[1]:', ages[1])

// 1. แทนที่ค่า array
ages = [15, 25]
console.log('ages list:', ages)

// 2. เพิ่มข้อมูลท้าย array
ages.push(35)
console.log('ages after push:', ages)

// 3. ลบข้อมูลตัวสุดท้าย
ages.pop()
console.log('ages after pop:', ages)

// array ใหม่
let ageList = [25, 30, 35, 40, 45]
console.log('Ages:', ageList)

/*
====================
Array + Loop
====================
*/
let fruits = ['Apple', 'Banana', 'Cherry']
console.log('Fruits:', fruits)

fruits.push('Mango')
console.log('Fruits after push:', fruits)

console.log('First fruit:', fruits[0])
console.log('Total fruits:', fruits.length)

for (let i = 0; i < fruits.length; i++) {
    console.log(`Fruit ${i}:`, fruits[i])
}

/*
====================
Object
====================
*/
let student = {
    name: 'John',
    age: 30,
    grade: 'A'
}

console.log(student)
console.log('Name:', student.name)
console.log('Age:', student.age)
console.log('Grade:', student.grade)

/*
====================
Function
====================
*/
function calculation_grade(score) {
    if (score >= 80) return 'A'
    if (score >= 70) return 'B'
    if (score >= 60) return 'C'
    if (score >= 50) return 'D'
    return 'F'
}

let score1 = 10
let score2 = 80

let grade1 = calculation_grade(score1)
let grade2 = calculation_grade(score2)

console.log('Score1:', score1, 'Grade:', grade1)
console.log('Score2:', score2, 'Grade:', grade2)

/*
====================
Array map / forEach
====================
*/
let scores = [90, 80, 70, 60, 50]

for (let i = 0; i < scores.length; i++) {
    console.log(`Score ${i + 1}:`, scores[i])
}

let reducedScores = scores.map(s => s - 10)

reducedScores.forEach(s => {
    console.log('score:', s)
})

/*
====================
Array filter
====================
*/
let passScores = scores.filter(score => score >= 70)

passScores.forEach(ps => {
    console.log('pass score:', ps)
})

/*
====================
Object + Array Function
====================
*/
let students = [
    { name: 'John', age: 20, grade: 'A' },
    { name: 'Jane', age: 22, grade: 'B' },
    { name: 'Jim', age: 21, grade: 'C' }
]

console.log('Student:', students[0])

let findStudent = students.find(s => s.name === 'Jane')

let doubleAgeStudents = students.map(s => ({
    ...s,
    age: s.age * 2
}))

let highGradeStudents = students.filter(s => s.grade === 'A')

console.log('Find student:', findStudent)
console.log('Double age students:', doubleAgeStudents)
console.log('High grade students:', highGradeStudents)
