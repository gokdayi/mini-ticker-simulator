document.addEventListener('DOMContentLoaded', () => {
  const ctx = document.getElementById('cryptoChart').getContext('2d');
  const cryptoSelect = document.getElementById('cryptoSelect');
  const timeRange = document.getElementById('timeRange');
  const filterButton = document.getElementById('filterButton');
  const darkModeToggle = document.getElementById('dark-mode-toggle');

  const chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: [],
      datasets: [{
        label: 'Price',
        data: [],
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
        fill: false
      }]
    },
    options: {
      responsive: true,
      scales: {
        x: {
          type: 'time',
          time: {
            unit: 'minute'
          }
        },
        y: {
          beginAtZero: false
        }
      }
    }
  });

  const fetchData = async (symbol, range) => {
    const response = await fetch(`/instruments/${symbol}?range=${range}`);
    const data = await response.json();
    return data;
  };

  const updateChart = async () => {
    const symbol = cryptoSelect.value;
    const range = timeRange.value;
    const data = await fetchData(symbol, range);

    chart.data.labels = data.map(item => new Date(item.ts));
    chart.data.datasets[0].data = data.map(item => item.last);
    chart.update();
  };

  filterButton.addEventListener('click', updateChart);

  updateChart();
  
  // Handle user preferences and notification settings
  const savePreferences = async (preferences) => {
    const response = await fetch('/user/preferences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(preferences)
    });
    const data = await response.json();
    return data;
  };

  const loadPreferences = async () => {
    const response = await fetch('/user/preferences');
    const data = await response.json();
    return data;
  };

  const applyPreferences = (preferences) => {
    if (preferences.darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    // Apply other preferences as needed
  };

  const initPreferences = async () => {
    const preferences = await loadPreferences();
    applyPreferences(preferences);
  };

  initPreferences();

  // Implement dark mode toggle functionality
  darkModeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const preferences = { darkMode: document.body.classList.contains('dark-mode') };
    savePreferences(preferences);
  });
});
