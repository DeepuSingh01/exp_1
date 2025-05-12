
const universalPassword = "universal123";
let adminPassword = "admin123";
let products = [];

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
      products = data;
      document.getElementById("searchInput").dispatchEvent(new Event("input"));
    });
}

document.getElementById("searchInput").addEventListener("input", function () {
  const value = this.value.toLowerCase();
  const results = products.filter(item =>
    Object.values(item).some(val =>
      String(val).toLowerCase().includes(value)
    )
  );

  let html = "<table><tr>" +
    (results[0] ? Object.keys(results[0]).map(k => `<th>${k}</th>`).join("") : "") +
    "</tr>" +
    results.map(r => "<tr>" + Object.values(r).map(v => `<td>${v}</td>`).join("") + "</tr>").join("") +
    "</table>";
  document.getElementById("results").innerHTML = html || "<p>No results found.</p>";
});

function uploadExcel() {
  const fileInput = document.getElementById("excelUpload");
  const status = document.getElementById("upload-status");
  const file = fileInput.files[0];
  if (!file) return status.innerText = "No file selected.";

  const reader = new FileReader();
  reader.onload = function(e) {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, {type: 'array'});
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const newData = XLSX.utils.sheet_to_json(sheet);

    // Merge new data with existing and remove duplicates
    const combined = [...products, ...newData];
    const seen = new Set();
    const unique = combined.filter(item => {
      const key = JSON.stringify(item);
      return seen.has(key) ? false : seen.add(key);
    });

    // Update in-memory data and re-render
    products = unique;
    document.getElementById("searchInput").dispatchEvent(new Event("input"));

    // Download updated JSON
    const blob = new Blob([JSON.stringify(products, null, 2)], {type: "application/json"});
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "products.json";
    a.click();
    status.innerText = "Upload successful. Download updated JSON and replace on server.";
  };
  reader.readAsArrayBuffer(file);
}
