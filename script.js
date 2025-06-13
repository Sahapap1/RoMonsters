let otherMonster = document.getElementById('otherMonster')

let showDetailMonster = document.getElementById('detailPicture')

let monsterName = document.getElementById('monsterName')
let monsterLevel = document.getElementById('level')
let monsterSize = document.getElementById('size')
let monsterRace = document.getElementById('race')
let monsterType = document.getElementById('type')

let pageNumberContainer = document.getElementById('pageNumberContainer')

let monsterDatas = []


let quantityOfMonsterbox = calQuantityMonsBox()

let page



fetch('http://localhost:3000/api/monsters')
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => {
                throw new Error(`HTTP error! Status: ${response.status}. Proxy Error: ${err.message || 'Unknown'}`);
            });
        }
        response = response.json();
        return response
    })
    .then(data => {
        console.log(data)
        monsterDatas = monsterCheck(data)
        console.log(monsterDatas)
        showDetail(monsterDatas[0].monster_id)
        displayMonstersForPage(1)

    })

window.addEventListener("resize", (event) => {
    quantityOfMonsterbox = calQuantityMonsBox()
    displayMonstersForPage(currentPage)
    
})



function manipulationMonsterName(name) {
    for (let i = 0; i < name.length; i++) {
        if (name[i] === "_") {
            let btfName = ''
            btfName = name.split("_").join(" ")
            btfName = name[0].toUpperCase() + btfName.slice(1).toLowerCase();
            return btfName
        }
    }
    return name
}



function calQuantityMonsBox() {
    let containerWidth = Number(window.getComputedStyle(otherMonster).width.slice(0, -2))
    let gridColumn = ((window.getComputedStyle(otherMonster).gridTemplateColumns).split(" ")).length
    return (gridColumn * 2)
}

function monsterCheck(data) {
    let monsters = []
    for (let i = 0; i < data.length; i++) {
        if (data[i] !== "") {
            monsters.push(data[i])
        }
    }
    return monsters
}

function showDetail(id) {
    for (mons of monsterDatas) {
        if (mons.monster_id == id) {

            showDetailMonster.src = mons.gif

            monsterName.textContent = manipulationMonsterName(mons.monster_info)
            monsterLevel.textContent = mons.main_stats.level
            monsterSize.textContent = mons.size
            monsterRace.textContent = mons.race
            monsterType.textContent = mons.type
            dropsItem = mons.drops

            dropsItemContainer.innerHTML = '';
            let dropsItemHtml = '';
            for (let i = 0; i < dropsItem.length; i++) {
                dropsItemHtml += `<div class="drop-item-box">
                                    <img src="${dropsItem[i].img}" alt="">
                                    <p>${dropsItem[i].rate}%</p>
                                  </div> `
            }

            dropsItemContainer.innerHTML = dropsItemHtml
        }
    }
}

function monsterBox(monstersToDisplay) {

    otherMonster.innerHTML = '';

    monstersToDisplay.forEach(monster => {
        let monsterName = manipulationMonsterName(monster.monster_info)
        const monsBox = ` <div class="mons-box" data-monster-id="${monster.monster_id}">
                                <img src="${monster.gif}" alt="">
                                <p>${monsterName}</p>
                              </div> `
        otherMonster.insertAdjacentHTML('beforeend', monsBox);
    })
}

otherMonster.addEventListener('click', function (event) {
    const clickedMonsterBox = event.target.closest('.mons-box')
    if (clickedMonsterBox) {
        const monsterId = clickedMonsterBox.dataset.monsterId;

        showDetail(monsterId)

        clickedMonsterBox.style.backgroundColor = '#323232';
        setTimeout(() => {
            clickedMonsterBox.style.backgroundColor = ''; // กลับเป็นปกติ
        }, 200);

    }
})




pageNumberContainer.addEventListener('click', function (event) {
    const clickedPageNumberBox = event.target.closest('.box-number')

    let pageNumber = pageNumberContainer.children
    for (let i = 0; i < pageNumber.length; i++) {
        pageNumber[i].classList.remove('active')
    }

    clickedPageNumberBox.classList.add('active')
    page = clickedPageNumberBox.dataset.pageNumber
    displayMonstersForPage(page)

    if (clickedPageNumberBox.classList.contains('box-number') && clickedPageNumberBox.dataset.pageNumber) {
        const newPage = parseInt(clickedPageNumberBox.dataset.pageNumber, 10);
        if (!isNaN(newPage)) { 
            currentPage = newPage; 
            displayMonstersForPage(currentPage); 
            renderPaginationControls(); 
        }
    }

    else if (clickedPageNumberBox.classList.contains('page-arrow-left') && clickedPageNumberBox.dataset.pageAction === 'prev-set') {
        firstPageInCurrentSet = Math.max(1, firstPageInCurrentSet - numPagesToShow);
        currentPage = firstPageInCurrentSet; 
        displayMonstersForPage(currentPage); 
        renderPaginationControls(); 
    }
    else if (clickedPageNumberBox.classList.contains('page-arrow-right') && clickedPageNumberBox.dataset.pageAction === 'next-set') {
        const totalPages = getTotalPages();
        firstPageInCurrentSet = Math.min(firstPageInCurrentSet + numPagesToShow, totalPages);
        if (firstPageInCurrentSet > totalPages) {
            firstPageInCurrentSet = totalPages - (totalPages % numPagesToShow) + 1;
            if (totalPages % numPagesToShow === 0 && numPagesToShow > 0) { 
                firstPageInCurrentSet = totalPages - numPagesToShow + 1;
            }
        }

        currentPage = firstPageInCurrentSet; 
        displayMonstersForPage(currentPage); 
        renderPaginationControls();
    }
    
    })

let currentPage = 1;
let firstPageInCurrentSet = 1;
const numPagesToShow = 3;

function getTotalPages() {
    return Math.ceil(monsterDatas.length / quantityOfMonsterbox);
}

function displayMonstersForPage(pageNumber) {

    const startIndex = (pageNumber - 1) * quantityOfMonsterbox;
    const endIndex = startIndex + quantityOfMonsterbox;
    const monstersToDisplay = monsterDatas.slice(startIndex, endIndex);


    monsterBox(monstersToDisplay);
}

function renderPaginationControls() {
    pageNumberContainer.innerHTML = '';

    const totalPages = getTotalPages();
    if (totalPages === 0) {
        pageNumberContainer.innerHTML = '<p>No pages available.</p>';
        return;
    }

    const displayStartPage = firstPageInCurrentSet;
    const displayEndPage = Math.min(firstPageInCurrentSet + numPagesToShow - 1, totalPages);

    let paginationHtml = '';

    if (firstPageInCurrentSet > 1) {
        paginationHtml += `
            <div class="page-box box-number page-arrow-left" data-page-action="prev-set">
                <p>previous</p>
            </div>
        `;
    }

    for (let i = displayStartPage; i <= displayEndPage; i++) {
        const isActive = (i === currentPage) ? 'active' : '';
        paginationHtml += `
            <div class="page-box box-number ${isActive}" data-page-number="${i}">
                <p>${i}</p>
            </div>
        `;
    }

    if (displayEndPage < totalPages) {
        paginationHtml += `
            <div class="page-box page-arrow-right box-number" data-page-action="next-set">
                <p>next</p>
            </div>
        `;
    }


    pageNumberContainer.innerHTML = paginationHtml;
}