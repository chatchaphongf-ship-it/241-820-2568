const BASE_URL = 'http://localhost:8000'

// แสดง alert
const showAlert = (message, type = 'success') => {
    const alert = document.getElementById('alert')
    alert.textContent = message
    alert.className = `alert alert-${type} show`
    setTimeout(() => { alert.classList.remove('show') }, 3000)
}

// โหลดพนักงานทั้งหมด
const loadEmployees = async () => {
    try {
        document.getElementById('loading').style.display = 'block'
        document.getElementById('empTable').style.display = 'none'

        const response = await axios.get(`${BASE_URL}/employees`)
        const employees = response.data

        const body = document.getElementById('empBody')
        body.innerHTML = ''

        for (let emp of employees) {
            body.innerHTML += `
                <tr>
                    <td>${emp.id}</td>
                    <td>${emp.name}</td>
                    <td>${emp.position}</td>
                    <td>${emp.department}</td>
                    <td>
                        <div class="btn-group">
                            <button class="btn btn-danger" onclick="deleteEmployee(${emp.id})">ลบ</button>
                        </div>
                    </td>
                </tr>
            `
        }

        document.getElementById('loading').style.display = 'none'
        document.getElementById('empTable').style.display = 'table'
    } catch (error) {
        document.getElementById('loading').textContent = 'เกิดข้อผิดพลาดในการโหลดข้อมูล'
        console.error(error)
    }
}

// เพิ่มพนักงาน
const addEmployee = async () => {
    const name = document.getElementById('name').value.trim()
    const position = document.getElementById('position').value.trim()
    const department = document.getElementById('department').value.trim()

    if (!name || !position || !department) {
        return showAlert('กรุณากรอกข้อมูลให้ครบถ้วน', 'danger')
    }

    try {
        await axios.post(`${BASE_URL}/employees`, { name, position, department })
        showAlert('เพิ่มพนักงานสำเร็จ!')
        document.getElementById('name').value = ''
        document.getElementById('position').value = ''
        document.getElementById('department').value = ''
        loadEmployees()
    } catch (error) {
        showAlert(error.response?.data?.message || 'เกิดข้อผิดพลาด', 'danger')
    }
}

// ลบพนักงาน
const deleteEmployee = async (id) => {
    if (!confirm('ยืนยันการลบพนักงาน?')) return
    try {
        await axios.delete(`${BASE_URL}/employees/${id}`)
        showAlert('ลบพนักงานสำเร็จ!')
        loadEmployees()
    } catch (error) {
        showAlert(error.response?.data?.message || 'เกิดข้อผิดพลาด', 'danger')
    }
}

// โหลดข้อมูลตอนเปิดหน้า
window.onload = loadEmployees