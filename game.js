var photosArray = []
var selectedIndex = null
var selectedElement = null
const game = document.getElementById('game');
const windowWidth = window.innerWidth
const windowHeight = window.innerHeight
var firstClick = true
enableClick = true
var correct = 0
newGame()

function newGame(){
    selectedIndex = null
    photosArray = []
    correct = 0
    firstClick = true
    enableClick = true
    game.innerHTML = `
    <div class="d-flex flex-column justify-content-center align-items-center w-100">
    <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
<p class="text-muted m-3">LOADING ...</p>
</div>`
    for(let i=0;i<8;i++){
        fetch(`https://picsum.photos/${windowWidth}/${windowHeight}`).then(res=>res.blob()).then((imageBLOB)=>{
            const dataURL = URL.createObjectURL(imageBLOB);
            const img = `<div class="flip-card  ">
            <div class="flip-card-inner" style="opacity:1" data-id="${i}" onclick="handleClick(this,${i})">
              <div class="flip-card-front">
                <img class="pattern-image" src="R.png" alt="flipped"/>
              </div>
              <div class="flip-card-back">
                <img src="${dataURL}"/>
                </div>
            </div>
          </div>`
            photosArray.push(img)
            if(photosArray.length === 8){
                startGame()}
        })
    }
}

function startGame(){
    game.innerHTML = ''
    const doubledShuffledArray = shuffleArray([...photosArray,...photosArray])
    doubledShuffledArray.forEach((img)=>{
        game.innerHTML += img
    })
}


function handleClick(e,i){
    if(!enableClick || selectedElement === e){return}
    e.classList.add('flipped')
    if(firstClick){
    selectedElement = e
    selectedIndex = i
    firstClick = false
    }
    else {
        firstClick = true
        enableClick = false
        if(selectedIndex === i){
            correct++
            setTimeout(()=>{
                document.querySelectorAll('.flipped').forEach((e)=>{  
                    hideElement(e)
                })
                enableClick = true
                if(correct === 8){
                    game.innerHTML = `<div class="d-flex flex-column justify-content-center">
                    <div><h2 class="text text-primary">YOU WIN!! 💃💃🎉🎉</h2>
                    </div>
                    <div>
                    <button id="newGame" onclick="newGame()" class="btn btn-primary rounded w-100">New Game</button>
                </div>
                </div>
                `
                }
            },1500)

        }
        else {
            setTimeout(()=>{
                document.querySelectorAll('.flipped').forEach((e)=>{
                    e.classList.remove('flipped')
                })
                enableClick = true
                selectedElement = null
            },1000)
        }
    }
}


function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array
}

function hideElement(e){
    const fadeInterval = setInterval(()=>{
        e.style.opacity = e.style.opacity-0.05
        if(e.style.opacity <= 0){
            clearInterval(fadeInterval)
        }
    },50)
}