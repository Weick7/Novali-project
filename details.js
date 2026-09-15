 const urlParams = new URLSearchParams(window.location.search);
 const currentId = urlParams.get('id');

 async function getDetails(){
    const response = await fetch('data.json');
    const data = await response.json();

    const selected = data.find(item=>item.id === currentId);

    if (selected) {
        displayData(selected);
    }
 }

 function displayData(item){
    document.getElementById('detail-title').textContent = item.title;
    document.getElementById('detail-image').src = item.img;
    document.getElementById('definition-text').textContent = item.definition;
  document.getElementById('cause-text').textContent = item.cause;
  document.getElementById('explanation-text').textContent = item.explanation;
 }

getDetails();