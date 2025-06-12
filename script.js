let otherMonster = document.getElementById('otherMonster')

let showDetailMonster = document.getElementById('detailPicture')

let monsterName = document.getElementById('monsterName')
let monsterLevel = document.getElementById('level')
let monsterSize = document.getElementById('size')
let monsterRace = document.getElementById('race')
let monsterType = document.getElementById('type')



let quantityOfMonsterbox = calQuantityMonsBox()
const dataToSend = {
    boxContain: quantityOfMonsterbox
}




fetch('http://localhost:3000/api/monsters', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(dataToSend)
})
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

        otherMonster.innerHTML = '';

        for (let i = 0; i < quantityOfMonsterbox; i++) {
            let monsterName = manipulationMonsterName(monsterDatas[i].monster_info)
            const monsBox = ` <div class="mons-box" data-monster-id="${monsterDatas[i].monster_id}">
                                <img src="${monsterDatas[i].gif}" alt="">
                                <p>${monsterName}</p>
                              </div> `
            otherMonster.insertAdjacentHTML('beforeend', monsBox);
        }



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
    // console.log(id)

    // showDetailMonster.src = monsterDatas[0].gif
    // monsterName.textContent = manipulationMonsterName(monsterDatas[0].monster_info)
    // monsterLevel.textContent = monsterDatas[0].main_stats.level
    // monsterSize.textContent = monsterDatas[0].size
    // monsterRace.textContent = monsterDatas[0].race
    // monsterType.textContent = monsterDatas[0].type
    // let dropsItemContainer = document.getElementById('dropsItemContainer')
    // let dropsItem = monsterDatas[0].drops

    // dropsItemContainer.innerHTML = '';
    // let dropsItemHtml = '';
    // for (let i = 0; i < dropsItem.length; i++) {
    //     dropsItemHtml += `<div class="drop-item-box">
    //     <img src="${dropsItem[i].img}" alt="">
    //     <p>${dropsItem[i].rate}%</p>
    //     </div> `
    // }
    // dropsItemContainer.innerHTML = dropsItemHtml
    for (mons of monsterDatas) {
        if (mons.monster_id == id) {
            console.log(mons)
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