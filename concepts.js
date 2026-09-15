const conceptsListEl = document.getElementById('conceptsList');
const displayCard = document.getElementById('displayCard');
const conceptImg = document.getElementById('conceptImg');
const conceptTitle = document.getElementById('conceptTitle');
const conceptTagline = document.getElementById('conceptTagline');
const conceptDesc = document.getElementById('conceptDesc');
const conceptFact = document.getElementById('conceptFact');


let conceptsData = [];


async function initConceptsPage() {
  try {
    const response = await fetch('./concepts.json');
    if (!response.ok) throw new Error('Failed to fetch JSON');
    
    conceptsData = await response.json();
    renderList();
  } catch (error) {
    console.error('Error fetching concepts JSON:', error);
  }
}


function renderList() {
  if (!conceptsListEl || conceptsData.length === 0) return;
  
  conceptsListEl.innerHTML = "";


  const urlParams = new URLSearchParams(window.location.search);
  const selectedId = parseInt(urlParams.get('id'));

  let targetIndex = conceptsData.findIndex(item => item.id === selectedId);
  if (targetIndex === -1) {
    targetIndex = Math.floor(Math.random() * conceptsData.length);
  }


  conceptsData.forEach((item, index) => {
    const btn = document.createElement('button');
    btn.className = `concept-btn ${index === targetIndex ? 'active' : ''}`;
    btn.innerHTML = `<span>${item.name}</span> <span>→</span>`;
    btn.onclick = () => updateDisplay(item, btn);

    conceptsListEl.appendChild(btn);
  });


  updateDisplay(conceptsData[targetIndex], conceptsListEl.children[targetIndex]);
}


function updateDisplay(item, targetBtn) {
  if (!item || !targetBtn) return;

  document.querySelectorAll('.concept-btn').forEach(btn => btn.classList.remove('active'));
  targetBtn.classList.add('active');

  displayCard.style.animation = 'none';
  displayCard.offsetHeight; 
  displayCard.style.animation = 'fadeIn 0.4s ease-in-out';
  displayCard.scrollIntoView({behavior:"smooth"});
  conceptImg.src = item.image;
  conceptTitle.innerText = item.name;
  conceptTagline.innerText = item.tagline;
  conceptDesc.innerText = item.description;
  conceptFact.innerText = item.fact;
}

initConceptsPage();