let storedData = [];

function saveData(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    let entry = {};
    formData.forEach((value, key) => {
        entry[key] = value;
    });

    storedData.push(entry);
    localStorage.setItem("surveyData", JSON.stringify(storedData)); 
    document.getElementById('surveyForm').reset();
    showNotification("Данные успешно сохранены!");
}

function showNotification(message) {
    const notification = document.createElement("div");
    notification.classList.add("notification");
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => notification.classList.add("show"), 10);
    setTimeout(() => {
        notification.classList.remove("show");
        setTimeout(() => notification.remove(), 500);
    }, 3000);
}

function showResults() {
    let resultsArea = document.getElementById('resultsArea');
    let formArea = document.getElementById('formArea');
    let stored = localStorage.getItem("surveyData");
    let storedData = stored ? JSON.parse(stored) : [];
    resultsArea.innerHTML = "";

    if (storedData.length === 0) {
        showNotification("Данных нет!");
        return;
    }

    let table = document.createElement("table");
    let thead = table.createTHead();
    let headerRow = thead.insertRow();
    Object.keys(storedData[0]).forEach(key => {
        let th = document.createElement("th");
        th.textContent = key;
        headerRow.appendChild(th);
    });

    let tbody = table.createTBody();
    storedData.forEach(entry => {
        let row = tbody.insertRow();
        Object.values(entry).forEach(value => {
            let cell = row.insertCell();
            cell.textContent = value;
        });
    });

    resultsArea.innerHTML = "<h2>Результаты опроса</h2>";
    resultsArea.appendChild(table);

    let backButton = document.createElement("button");
    backButton.textContent = "Назад";
    backButton.onclick = goBackToForm;
    resultsArea.appendChild(backButton);

    formArea.style.display = 'none';
    resultsArea.style.display = 'block';
}

function clearForm() {
    document.getElementById('surveyForm').reset();
}

function goBackToForm() {
    document.getElementById('formArea').style.display = 'block';
    document.getElementById('resultsArea').style.display = 'none';
}

function clearResults() {
    if (confirm("Вы уверены, что хотите удалить все данные?")) {
        localStorage.removeItem("surveyData");
        storedData = [];
        goBackToForm();
        alert("Данные удалены.");
    }
}

window.onload = function() {
    let stored = localStorage.getItem("surveyData");
    storedData = stored ? JSON.parse(stored) : [];
    document.getElementById("surveyForm").addEventListener("submit", saveData);
};
