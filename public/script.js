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
