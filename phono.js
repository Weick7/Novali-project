async function allPage() {
  let allCardsParent = document.getElementById("allCardsParent");
  if (!allCardsParent) return;
  try {
    const response = await fetch("data.json");
    const data = await response.json();

    allCardsParent.innerHTML = data
      .map((pho) => {
        return `<a href="details.html?id=${pho.id}">
                <img src="${pho.img}" alt="phonomena img">
                <span>${pho.title}</span>
            </a>`;
      })
      .join("");
  } catch (erorr) {
    console.error("faild bring data");
  }
}

allPage();