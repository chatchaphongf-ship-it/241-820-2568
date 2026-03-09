const BASE_URL = "http://localhost:8000";
window.onload = async () => {
    const response = await axios.get(`${BASE_URL}/users`);
    console.log(response.data);
    const userDOM =- document.getElementById("user");
    let htmlData = '<div>';
    for(let user of response.data){
        let user = response.data[i];
        htmlData += `<div>
        ${user.firstname} ${user.lastname}
        <button>Edit</button>
        <button class='delete' data-id ='${user.id}'>Delete</button>
        </div>`
    }    
    htmlData += '<div>';
    userDOM.innerHTML = htmlData;
    
    const deleteDOMs = document.getElementsByClassName('delete');
    for (let i = 0; i <deleteDOMs.length; i++) {
        deleteDOMs[i].addEventListener('click', async (event) => {
            const id = event.target.dataset.id;
            try {
                await axios.delete(`${BASE_URL}/users/${id}`);
                loadData();
            } catch (error) {
                console.log('Error deleting user:', error);
            }
        })
    }
}