
function showSection(id) {
    document.querySelectorAll('section').forEach(s => s.classList.remove('active-section'));
    document.getElementById(id).classList.add('active-section');
}

setInterval(() => {
    const now = new Date();
    document.getElementById('digital-clock').innerText = now.toLocaleTimeString('th-TH');
}, 1000);

let staffList = [];
let logs = [];

function recordTime(type) {
    const time = new Date();
    const timeStr = time.toLocaleTimeString('th-TH');

    if (type === 'IN') {
        document.getElementById('checkin-time').innerText = timeStr;
    } else {
        document.getElementById('checkout-time').innerText = timeStr;
    }

    alert(`${type} สำเร็จเมื่อเวลา: ${timeStr}`);
    
    if (type === 'OUT' && time.getHours() > 17) {
        console.log("คุณมี OT เพิ่มเติม");
    }
}

document.getElementById('staffForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('empName').value;
    const id = document.getElementById('empID').value;
    
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