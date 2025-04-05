document.addEventListener("DOMContentLoaded", loadResidents);
document.addEventListener("DOMContentLoaded", updateStatistics);

function addResident() {
    let fullName = document.getElementById("fullName").value.trim();
    let apartmentNumber = document.getElementById("apartmentNumber").value.trim();
    let apartmentSize = document.getElementById("apartmentSize").value.trim();
    let privatized = document.getElementById("privatized").value;

    let namePattern = /^[А-Яа-яЁё\s]+$/;
    if (!namePattern.test(fullName)) {
        alert("ФИО должно содержать только буквы и пробелы!");
        return;
    }

    let apartmentNumberInt = parseInt(apartmentNumber, 10);
    if (isNaN(apartmentNumberInt) || apartmentNumberInt < 1) {
        alert("Номер квартиры должен быть положительным числом!");
        return;
    }

    let apartmentSizeFloat = parseFloat(apartmentSize);
    if (isNaN(apartmentSizeFloat) || apartmentSizeFloat <= 0) {
        alert("Площадь квартиры должна быть положительным числом!");
        return;
    }

    let propertySelect = document.getElementById("propertySelect");
    let propertyValue = document.getElementById("propertyValue").value.trim();
    let property = propertySelect.value;

    let newProperty = {};
    if (property !== "none" && propertyValue) {
        newProperty = { [property]: propertyValue };
    }

    let resident = { fullName, apartmentNumber, apartmentSize, privatized, ...newProperty };
    let residents = JSON.parse(localStorage.getItem("residents")) || [];
    residents.push(resident);
    localStorage.setItem("residents", JSON.stringify(residents));
    console.log(residents);
    loadResidents();
    updateStatistics();
    document.getElementById("residentForm").reset();
    showNotification("Жилец успешно добавлен!");
}

function showMinAreaResident() {
    console.log("[fq")
    let residents = JSON.parse(localStorage.getItem("residents")) || [];
    if (residents.length === 0) return;

    let minArea = Math.min(...residents.map(r => parseFloat(r.apartmentSize)));
    let minResidents = residents.filter(r => parseFloat(r.apartmentSize) === minArea);
    loadResidentsByList(minResidents);
}

function showMaxAreaResident() {
    let residents = JSON.parse(localStorage.getItem("residents")) || [];
    if (residents.length === 0) return;

    let maxArea = Math.max(...residents.map(r => parseFloat(r.apartmentSize)));
    let maxResidents = residents.filter(r => parseFloat(r.apartmentSize) === maxArea);
    loadResidentsByList(maxResidents);
}

function loadResidents(filter = 'all') {
    let table = document.getElementById("residentsTable").getElementsByTagName("tbody")[0];
    table.innerHTML = "";
    let residents = JSON.parse(localStorage.getItem("residents")) || [];

    let filteredResidents = residents;
    if (filter !== 'all') {
        filteredResidents = residents.filter(resident => resident.privatized === filter);
    }

    let columns = ["Номер квартиры", "ФИО", "Площадь", "Приватизировано"];
    
    let allProperties = new Set();
    residents.forEach(resident => {
        for (let key in resident) {
            if (key !== "fullName" && key !== "apartmentNumber" && key !== "apartmentSize" && key !== "privatized" && key !== "residents") {
                allProperties.add(key);
            }
        }
    });

    columns.push(...Array.from(allProperties));

    let thead = document.getElementById("residentsTable").getElementsByTagName("thead")[0];
    let headerRow = thead.getElementsByTagName("tr")[0];
    headerRow.innerHTML = "";

    columns.forEach((col, i) => {
        let th = document.createElement("th");
        th.innerText = col;
        headerRow.appendChild(th);
    });

    filteredResidents.forEach((resident, index) => {
        addResidentToTable(resident, index, columns);
    });
    console.log(residents);
}

function loadResidentsByList(residents) {
    let table = document.getElementById("residentsTable").getElementsByTagName("tbody")[0];
    table.innerHTML = "";

    let columns = ["Номер квартиры", "ФИО", "Площадь", "Приватизировано"];
    
    let allProperties = new Set();
    residents.forEach(resident => {
        for (let key in resident) {
            if (key !== "fullName" && key !== "apartmentNumber" && key !== "apartmentSize" && key !== "privatized" && key !== "residents") {
                allProperties.add(key);
            }
        }
    });

    columns.push(...Array.from(allProperties));

    let thead = document.getElementById("residentsTable").getElementsByTagName("thead")[0];
    let headerRow = thead.getElementsByTagName("tr")[0];
    headerRow.innerHTML = "";

    columns.forEach(col => {
        let th = document.createElement("th");
        th.innerText = col;
        headerRow.appendChild(th);
    });

    residents.forEach((resident, index) => {
        addResidentToTable(resident, index, columns);
    });
}

function addResidentToTable(resident, index, columns) {
    let table = document.getElementById("residentsTable").getElementsByTagName("tbody")[0];
    let newRow = table.insertRow();

    newRow.insertCell(0).innerText = resident.apartmentNumber;
    newRow.insertCell(1).innerText = resident.fullName;
    newRow.insertCell(2).innerText = resident.apartmentSize;
    newRow.insertCell(3).innerText = resident.privatized;

    for (let i = 4; i < columns.length; i++) {
        let columnName = columns[i];
        let propertyValue = resident[columnName] || "";
        newRow.insertCell(i).innerText = propertyValue;
    }

    let actionsCell = newRow.insertCell(columns.length);
    let editBtn = document.createElement("button");
    editBtn.innerText = "✏️ Редактировать";
    editBtn.classList.add("edit-btn");
    editBtn.onclick = function () { editResident(index); };
    actionsCell.appendChild(editBtn);

    let deleteBtn = document.createElement("button");
    deleteBtn.innerText = "❌ Удалить";
    deleteBtn.classList.add("delete-btn");
    deleteBtn.onclick = function () { confirmDelete(index); };
    actionsCell.appendChild(deleteBtn);
}

function updateStatistics() { 
    try {
        let residents = JSON.parse(localStorage.getItem('residents')) || [];
        
        if (!Array.isArray(residents)) {
            console.error("Ошибка: данные о жильцах в localStorage повреждены.");
            return;
        }

        let total = residents.length;
        let totalSize = 0;
        let countSize = 0;
        let privatized = 0;

        residents.forEach(res => {
            if (res && typeof res === "object") {
                if (typeof res.privatized === "string" && res.privatized.trim().toLowerCase() === "да") {
                    privatized++;
                }

                let size = parseFloat(String(res.apartmentSize).replace(',', '.').trim());
                if (!isNaN(size) && size > 0) {
                    totalSize += size;
                    countSize++;
                }

                if (Array.isArray(res.residents)) {
                    res.residents.forEach(subRes => {
                        if (subRes && typeof subRes === "object") {
                            let subSize = parseFloat(String(subRes.apartmentSize).replace(',', '.').trim());
                            if (!isNaN(subSize) && subSize > 0) {
                                totalSize += subSize;
                                countSize++;
                            }
                        }
                    });
                }
            }
        });

        let avgSize = countSize > 0 ? (totalSize / countSize).toFixed(1) : "Нет данных";

        let totalResidentsEl = document.getElementById("totalResidents");
        let privatizedCountEl = document.getElementById("privatizedCount");
        let averageSizeEl = document.getElementById("averageSize");

        if (totalResidentsEl) totalResidentsEl.innerText = total;
        if (privatizedCountEl) privatizedCountEl.innerText = privatized;
        if (averageSizeEl) averageSizeEl.innerText = avgSize;

        console.log("Статистика обновлена:", { total, privatized, avgSize });
    } catch (error) {
        console.error("Ошибка в updateStatistics():", error);
    }
}

function showNotification(message) {
    const notification = document.createElement("div");
    notification.classList.add("notification");
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add("show");
    }, 10);

    setTimeout(() => {
        notification.classList.remove("show");
        setTimeout(() => notification.remove(), 500);
    }, 3000);
}

function editResident(index) {
    let residents = JSON.parse(localStorage.getItem("residents")) || [];
    let resident = residents[index];

    let newFullName = prompt("Введите ФИО:", resident.fullName)?.trim();
    let newApartmentNumber = prompt("Введите номер квартиры:", resident.apartmentNumber)?.trim();
    let newApartmentSize = prompt("Введите площадь квартиры:", resident.apartmentSize)?.trim();
    let newPrivatized = confirm("Квартира приватизирована?") ? "Да" : "Нет";

    let namePattern = /^[А-Яа-яЁё\s]+$/;
    if (!newFullName || !namePattern.test(newFullName)) {
        alert("ФИО должно содержать только буквы и пробелы!");
        return;
    }

    let apartmentNumberInt = parseInt(newApartmentNumber, 10);
    if (isNaN(apartmentNumberInt) || apartmentNumberInt < 1) {
        alert("Номер квартиры должен быть положительным числом!");
        return;
    }

    let apartmentSizeFloat = parseFloat(newApartmentSize);
    if (isNaN(apartmentSizeFloat) || apartmentSizeFloat <= 0) {
        alert("Площадь квартиры должна быть положительным числом!");
        return;
    }

    let newPropertyKey = prompt("Введите название свойства (или оставьте пустым):", Object.keys(resident).find(k => k !== 'fullName' && k !== 'apartmentNumber' && k !== 'apartmentSize' && k !== 'privatized') || "").trim();
    let newPropertyValue = newPropertyKey ? prompt("Введите значение свойства:", resident[newPropertyKey] || "").trim() : "";

    let updatedResident = {
        fullName: newFullName,
        apartmentNumber: apartmentNumberInt,
        apartmentSize: apartmentSizeFloat,
        privatized: newPrivatized,
        ...(newPropertyKey ? { [newPropertyKey]: newPropertyValue } : {})
    };

    residents[index] = updatedResident;

    localStorage.setItem("residents", JSON.stringify(residents));
    loadResidents();
    showNotification("Запись успешно обновлена!");
}

function confirmDelete(index) {
    let confirmation = confirm("Вы действительно хотите удалить запись?");
    if (confirmation) {
        deleteResident(index);
        showNotification("Запись успешно удалена!");
        
    }
}

function deleteResident(index) {
    let residents = JSON.parse(localStorage.getItem("residents")) || [];
    residents.splice(index, 1);
    localStorage.setItem("residents", JSON.stringify(residents));
    loadResidents();
    updateStatistics();
}

function searchApartment() {
    let searchNumber = document.getElementById("searchNumber").value;
    let residents = JSON.parse(localStorage.getItem("residents")) || [];
    let filtered = residents.filter(resident => resident.apartmentNumber == searchNumber);

    let table = document.getElementById("residentsTable").getElementsByTagName("tbody")[0];
    table.innerHTML = "";

    if (filtered.length === 0) {
        table.innerHTML = "<tr><td colspan='5'>Квартира не найдена</td></tr>";
    } else {
        let thead = document.getElementById("residentsTable").getElementsByTagName("thead")[0];
        let headerCells = thead.getElementsByTagName("tr")[0].getElementsByTagName("th");
        let columns = Array.from(headerCells).map(th => th.innerText);

        filtered.forEach((resident, index) => {
            addResidentToTable(resident, index, columns);
        });
    }
}

function filterResidents(privatized) {
    loadResidents(privatized);
}

function clearForm() {
    document.getElementById("residentForm").reset();
}
