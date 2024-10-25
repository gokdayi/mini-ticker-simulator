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

    const marketCapCell = document.createElement('td');
    marketCapCell.textContent = item.marketCap;
    row.appendChild(marketCapCell);

    const change24hCell = document.createElement('td');
    change24hCell.textContent = item.change24h;
    row.appendChild(change24hCell);

    const tradingVolumeCell = document.createElement('td');
    tradingVolumeCell.textContent = item.tradingVolume;
    row.appendChild(tradingVolumeCell);

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

// Implement wallet connection functionality using MetaMask
document.getElementById('connect-wallet').addEventListener('click', async function () {
  if (typeof window.ethereum !== 'undefined') {
    try {
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      const walletAddress = accounts[0];
      document.getElementById('wallet-address').textContent = `Connected Wallet: ${walletAddress}`;
    } catch (error) {
      console.error('Error connecting wallet:', error);
    }
  } else {
    alert('MetaMask is not installed. Please install MetaMask and try again.');
  }
});

// Add functions to interact with the smart contract
document.getElementById('interact-contract').addEventListener('click', async function () {
  const contractAddress = document.getElementById('contract-address').value;
  const method = document.getElementById('contract-method').value;
  const params = document.getElementById('contract-params').value.split(',');

  const abi = [
    // Add the ABI of the smart contract here
  ];

  const web3 = new Web3(window.ethereum);
  const contract = new web3.eth.Contract(abi, contractAddress);

  try {
    const result = await contract.methods[method](...params).call();
    document.getElementById('contract-result').textContent = `Result: ${result}`;
  } catch (error) {
    console.error('Error interacting with smart contract:', error);
  }
});

// Retrieve and display data from decentralized storage (IPFS and Arweave)
document.getElementById('upload-ipfs').addEventListener('click', async function () {
  const file = document.getElementById('upload-file').files[0];
  const reader = new FileReader();

  reader.onload = async function (event) {
    const data = event.target.result;
    const response = await fetch('/upload-ipfs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ data })
    });
    const result = await response.json();
    document.getElementById('storage-result').textContent = `IPFS Hash: ${result.hash}`;
  };

  reader.readAsArrayBuffer(file);
});

document.getElementById('upload-arweave').addEventListener('click', async function () {
  const file = document.getElementById('upload-file').files[0];
  const reader = new FileReader();

  reader.onload = async function (event) {
    const data = event.target.result;
    const response = await fetch('/upload-arweave', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ data })
    });
    const result = await response.json();
    document.getElementById('storage-result').textContent = `Arweave ID: ${result.id}`;
  };

  reader.readAsArrayBuffer(file);
});

document.getElementById('retrieve-ipfs').addEventListener('click', async function () {
  const hash = document.getElementById('retrieve-hash').value;
  const response = await fetch(`/retrieve-ipfs?hash=${hash}`);
  const result = await response.json();
  document.getElementById('storage-result').textContent = `IPFS Data: ${result.data}`;
});

document.getElementById('retrieve-arweave').addEventListener('click', async function () {
  const id = document.getElementById('retrieve-hash').value;
  const response = await fetch(`/retrieve-arweave?id=${id}`);
  const result = await response.json();
  document.getElementById('storage-result').textContent = `Arweave Data: ${result.data}`;
});
