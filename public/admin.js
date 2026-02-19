function loadAdminData(){

    const email =
        localStorage.getItem("loggedInUserEmail") ||
        localStorage.getItem("userEmail") ||
        localStorage.getItem("loggedInUser") ||
        localStorage.getItem("email");

    if(email !== "admin@gmail.com"){
        alert("Access Denied");
        window.location.href="/";
        return;
    }

    const orders = JSON.parse(localStorage.getItem("orders")) || [];

    let html="";

    if(orders.length === 0){
        html="<tr><td colspan='4'>No orders found</td></tr>";
    } else {
        orders.forEach(order=>{
            html += `
            <tr>
                <td>${order.email}</td>
                <td>${order.item}</td>
                <td>₹${order.price}</td>
                <td>${order.date}</td>
            </tr>
            `;
        });
    }

    document.getElementById("adminTable").innerHTML = html;
}
