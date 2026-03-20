// ฟังก์ชันสลับหน้าจอ
function showSection(id) {
    document.querySelectorAll('section').forEach(s => s.classList.remove('active-section'));
    document.getElementById(id).classList.add('active-section');
}

// นาฬิกา Real-time
setInterval(() => {
    const now = new Date();
    document.getElementById('digital-clock').innerText = now.toLocaleTimeString('th-TH');
}, 1000);

// ตัวอย่างการเก็บข้อมูล (ในโปรเจกต์จริงควรใช้ Database)
let staffList = [];
let logs = [];

// ระบบบันทึกเวลา (Logic คำนวณเบื้องต้น)
function recordTime(type) {
    const time = new Date();
    alert(`${type} สำเร็จเมื่อเวลา: ${time.getHours()}:${time.getMinutes()}`);
    
    // ตรรกะคำนวณ OT (ตัวอย่าง: ถ้าทำเกิน 8 ชม. หรือ หลัง 17:00)
    if (type === 'OUT' && time.getHours() > 17) {
        console.log("คุณมี OT เพิ่มเติม");
    }
}

// จัดการฟอร์มพนักงาน
document.getElementById('staffForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('empName').value;
    const id = document.getElementById('empID').value;
    
    // แสดงตัวอย่างในตารางรายงาน
    const table = document.getElementById('reportData');
    const row = `<tr>
        <td>${id}</td>
        <td>${name}</td>
        <td>8.00</td>
        <td>2.0</td>
        <td><span style="color:green">ปกติ</span></td>
    </tr>`;
    table.innerHTML += row;
    
    alert('บันทึกข้อมูลพนักงานเรียบร้อย');
    e.target.reset();
});