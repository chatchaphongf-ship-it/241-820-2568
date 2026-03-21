const BASE_URL = 'http://localhost:8000'

// แสดง alert
const showAlert = (message, type = 'success') => {
    const alert = document.getElementById('alert')
    alert.textContent = message
    alert.className = `alert alert-${type} show`
    setTimeout(() => { alert.classList.remove('show') }, 4000)
}

// นาฬิกา
setInterval(() => {
    const now = new Date()
    document.getElementById('clock').textContent = now.toLocaleTimeString('th-TH')
    document.getElementById('dateDisplay').textContent = now.toLocaleDateString('th-TH', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    })
}, 1000)

// โหลดพนักงานลง dropdown
const loadEmployees = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/employees`)
        const select = document.getElementById('empSelect')
        for (let emp of response.data) {
            select.innerHTML += `<option value="${emp.id}">${emp.name} - ${emp.position}</option>`
        }
    } catch (error) {
        console.error('โหลดพนักงานไม่ได้', error)
    }
}

// เช็คอิน
const checkIn = async () => {
    const employee_id = document.getElementById('empSelect').value
    if (!employee_id) return showAlert('กรุณาเลือกพนักงานก่อน', 'danger')

    try {
        const response = await axios.post(`${BASE_URL}/attendance/checkin`, { employee_id })
        showAlert(response.data.message)
        showResult(`เช็คอินสำเร็จ เวลา ${new Date().toLocaleTimeString('th-TH')}`)
        loadHistory(employee_id)
    } catch (error) {
        showAlert(error.response?.data?.message || 'เกิดข้อผิดพลาด', 'danger')
    }
}

// เช็คเอาท์
const checkOut = async () => {
    const employee_id = document.getElementById('empSelect').value
    if (!employee_id) return showAlert('กรุณาเลือกพนักงานก่อน', 'danger')

    try {
        const response = await axios.post(`${BASE_URL}/attendance/checkout`, { employee_id })
        const data = response.data
        showAlert(data.message)
        showResult(`
            เช็คเอาท์สำเร็จ เวลา ${new Date().toLocaleTimeString('th-TH')}<br>
            ชั่วโมงทำงาน: <strong>${data.total_hours} ชม.</strong> |
            OT: <strong>${data.ot_hours} ชม.</strong>
        `)
        loadHistory(employee_id)
    } catch (error) {
        showAlert(error.response?.data?.message || 'เกิดข้อผิดพลาด', 'danger')
    }
}

// แสดงผลลัพธ์
const showResult = (html) => {
    document.getElementById('resultCard').style.display = 'block'
    document.getElementById('resultContent').innerHTML = html
}

// โหลดประวัติเข้างาน
const loadHistory = async (employee_id) => {
    if (!employee_id) return
    try {
        const response = await axios.get(`${BASE_URL}/attendance/${employee_id}`)
        const rows = response.data
        const body = document.getElementById('historyBody')
        body.innerHTML = ''

        for (let row of rows) {
            body.innerHTML += `
                <tr>
                    <td>${row.date}</td>
                    <td>${row.check_in ? new Date(row.check_in).toLocaleTimeString('th-TH') : '-'}</td>
                    <td>${row.check_out ? new Date(row.check_out).toLocaleTimeString('th-TH') : '-'}</td>
                    <td>${row.total_hours || '-'}</td>
                    <td>${row.ot_hours || '-'}</td>
                </tr>
            `
        }

        document.getElementById('historyLoading').style.display = 'none'
        document.getElementById('historyTable').style.display = 'table'
    } catch (error) {
        console.error(error)
    }
}

// เมื่อเปลี่ยนพนักงานให้โหลดประวัติใหม่
document.getElementById('empSelect').addEventListener('change', (e) => {
    if (e.target.value) loadHistory(e.target.value)
})

window.onload = loadEmployees