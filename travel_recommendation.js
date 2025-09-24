const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const resetButton = document.getElementById('reset-button');
const resultsContainer = document.getElementById('results-container');
const noResults = document.getElementById('no-results');

let travelData = null;

fetch('travel_recommendation_api.json')
  .then((response) => response.json())
  .then((data) => {
    travelData = data;
  })
  .catch((error) => {
    console.error('Error loading travel data:', error);
  });


function clearResults() {
  resultsContainer.innerHTML = '';
  noResults.style.display = 'none';
}

function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5);
}

function getLocalTime(item) {
  if (!item.timeZone) return '';
  const options = {
    timeZone: item.timeZone,
    hour12: true,
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric'
  };
  return new Date().toLocaleTimeString('en-US', options);
}


function createCard(item) {
  const card = document.createElement('div');
  card.classList.add('destination-card');

  const image = document.createElement('img');
  image.classList.add('card-image');
  image.src = item.imageUrl;
  image.alt = item.name;

  const content = document.createElement('div');
  content.classList.add('card-content');

  const title = document.createElement('h3');
  title.classList.add('card-title');
  title.textContent = item.name;

  const description = document.createElement('p');
  description.classList.add('card-description');
  description.textContent = item.description;

  const localTime = getLocalTime(item);
  const timeElement = document.createElement('p');
  if (localTime) {
    timeElement.textContent = `Current time: ${localTime}`;
    timeElement.style.fontStyle = 'italic';
    timeElement.style.color = '#a1e3ff';
    timeElement.style.marginBottom = '0.5rem';
  }

  const button = document.createElement('button');
  button.classList.add('visit-button');
  button.textContent = 'Visit';

  content.appendChild(title);
  content.appendChild(description);
  if (localTime) content.appendChild(timeElement);
  content.appendChild(button);

  card.appendChild(image);
  card.appendChild(content);

  return card;
}

function handleSearch() {
  clearResults();
  if (!travelData) return;

  const query = searchInput.value.trim().toLowerCase();
  if (!query) return;

  let results = [];

  if (['country', 'countries'].includes(query)) {
    const allCities = travelData.countries.flatMap(c => c.cities);
    results.push(...shuffleArray(allCities).slice(0, 2));
  }

  if (['temple', 'temples'].includes(query)) {
    results.push(...shuffleArray(travelData.temples).slice(0, 2));
  }

  if (['beach', 'beaches'].includes(query)) {
    results.push(...shuffleArray(travelData.beaches).slice(0, 2));
  }


  if (results.length === 0) {
    noResults.style.display = 'block';
  } else {
    results.forEach(item => {
      const card = createCard(item);
      resultsContainer.appendChild(card);
    });
  }
}

searchButton.addEventListener('click', handleSearch);
searchInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') handleSearch();
});
resetButton.addEventListener('click', () => {
  searchInput.value = '';
  clearResults();
});
