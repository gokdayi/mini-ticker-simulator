const socket = new WebSocket('ws://localhost:3000');

socket.addEventListener('open', function (event) {
  console.log('WebSocket connection established');
});

socket.addEventListener('message', function (event) {
  const data = JSON.parse(event.data);
  updateTable(data);
});

function updateTable(data) {
  const tableBody = document.querySelector('#crypto-table tbody');
  tableBody.innerHTML = '';

  data.forEach((item) => {
    const row = document.createElement('tr');

    const symbolCell = document.createElement('td');
    symbolCell.textContent = item.symbol;
    row.appendChild(symbolCell);

    const priceCell = document.createElement('td');
    priceCell.textContent = item.price;
    row.appendChild(priceCell);

    const volumeCell = document.createElement('td');
    volumeCell.textContent = item.volume;
    row.appendChild(volumeCell);

    tableBody.appendChild(row);
  });
}

// Implement search functionality to filter cryptocurrencies based on user input
document.getElementById('search-bar').addEventListener('input', function (event) {
  const searchTerm = event.target.value.toLowerCase();
  const rows = document.querySelectorAll('#crypto-table tbody tr');

  rows.forEach((row) => {
    const symbol = row.querySelector('td:first-child').textContent.toLowerCase();
    if (symbol.includes(searchTerm)) {
      row.style.display = '';
    } else {
      row.style.display = 'none';
    }
  });
});

// Implement dark mode toggle functionality
document.getElementById('dark-mode-toggle').addEventListener('click', function () {
  document.body.classList.toggle('dark-mode');
});
