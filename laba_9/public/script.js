function renderTable(arr, containerId) {
  const table = document.createElement('table');
  for (let i = 0; i < 7; i++) {
    const row = document.createElement('tr');
    for (let j = 0; j < 10; j++) {
      const cell = document.createElement('td');
      cell.textContent = arr[i * 10 + j] ?? '';
      row.appendChild(cell);
    }
    table.appendChild(row);
  }
  document.getElementById(containerId).appendChild(table);
}

function goToSorted() {
  window.location.href = 'sorted.html';
}

document.addEventListener('DOMContentLoaded', () => {
  if (window.location.pathname.includes('index.html')) {
    fetch('/data')
      .then(res => res.json())
      .then(data => renderTable(data, 'table'));
  }

  if (window.location.pathname.includes('sorted.html')) {
    fetch('/sorted')
      .then(res => res.json())
      .then(({ sorted, min }) => {
        renderTable(sorted, 'sortedTable');
        document.getElementById('minValue').textContent = `Минимум: ${min}`;
      });
  }
});