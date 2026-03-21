const BASE_URL = 'http://localhost:8000'

const monthNames = [
    '', 'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน',
    'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม',
    'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
]

// แสดง alert
const showAlert = (message, type = 'success') => {
    const alert = document.getElementById('alert')
    alert.textContent = message
    alert.className = `alert alert-${type} show`
    setTimeout(() => { alert.classList.remove('show') }, 3000)
}

// โหลดรายงาน
const loadReport = async () => {
    const year = document.getElementById('year').value
    const month = document.getElementById('month').value

    if (!year || !month) return showAlert('กรุณาระบุปีและเดือน', 'danger')

    try {
        document.getElementById('reportLoading').style.display = 'block'
        document.getElementById('reportLoading').textContent = 'กำลังโหลด...'
        document.getElementById('reportTable').style.display = 'none'

        const response = await axios.get(`${BASE_URL}/report/monthly?year=${year}&month=${month}`)
        const { report } = response.data

        document.getElementById('reportTitle').textContent =
            `รายงานประจำเดือน ${monthNames[parseInt(month)]} ${year}`

        const body = document.getElementById('reportBody')
        body.innerHTML = ''

        for (let emp of report) {
            const otClass = emp.total_ot > 0 ? 'style="color:#f59e0b;font-weight:600"' : ''
            body.innerHTML += `
                <tr>
                    <td>${emp.id}</td>
                    <td>${emp.name}</td>
                    <td>${emp.position}</td>
                    <td>${emp.department}</td>
                    <td>${emp.work_days} วัน</td>
                    <td>${parseFloat(emp.total_hours).toFixed(2)} ชม.</td>
                    <td ${otClass}>${parseFloat(emp.total_ot).toFixed(2)} ชม.</td>
                </tr>
            `
        }

        document.getElementById('reportLoading').style.display = 'none'
        document.getElementById('reportTable').style.display = 'table'
    } catch (error) {
        document.getElementById('reportLoading').textContent = 'เกิดข้อผิดพลาดในการโหลดข้อมูล'
        showAlert('เกิดข้อผิดพลาด', 'danger')
        console.error(error)
    }
}