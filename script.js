
const universalPassword = "universal123"; // universal password
let adminPassword = "admin123"; // resettable password

function login() {
    const entered = document.getElementById("password-input").value;
    if (entered === adminPassword || entered === universalPassword) {
        document.getElementById("login-container").style.display = "none";
        document.getElementById("app").style.display = "block";
        loadProducts();
    } else {
        document.getElementById("login-error").innerText = "Incorrect password.";
    }
}

function resetAdminPassword() {
    const universal = document.getElementById("universalPass").value;
    const newPass = document.getElementById("newAdminPass").value;
    if (universal === universalPassword) {
        adminPassword = newPass;
        document.getElementById("reset-status").innerText = "Admin password reset!";
    } else {
        document.getElementById("reset-status").innerText = "Invalid universal password.";
    }
}

function loadProducts() {
    fetch('products.json')
        .then(response => response.json())
        .then(data => {
            window.products = data;
        });
}

document.getElementById("searchInput").addEventListener("input", function () {
    const value = this.value.toLowerCase();
    const results = window.products?.filter(item =>
        Object.values(item).some(val =>
            val.toLowerCase().includes(value)
        )
    ) || [];

    let html = "<table><tr>" +
        Object.keys(results[0] || {}).map(k => `<th>${k}</th>`).join("") +
        "</tr>" +
        results.map(r => "<tr>" + Object.values(r).map(v => `<td>${v}</td>`).join("") + "</tr>").join("") +
        "</table>";
    document.getElementById("results").innerHTML = html || "<p>No results found.</p>";
});
