const faby = new Image()
faby.src = '../images/flappy.png'

const topPipe = new Image()
topPipe.src = '../images/obstacle_top.png'

const bottomPipe = new Image()
bottomPipe.src = '../images/obstacle_bottom.png'

const pipesArray = []
let currentScore = 0
let pipesSurvived = 0

window.onload = function () {
  document.getElementById('start-button').onclick = function () {
    startGame()
  }

  function startGame() {
    gameBoard.start()
    return
  }
}

const gameBoard = {
  canvas: document.getElementById('my-canvas'),
  frames: 0,
  start: function () {
    this.isKeyPressed = false
    this.canvas.width = 700
    this.canvas.height = 350
    this.context = this.canvas.getContext('2d')
    document.body.appendChild(this.canvas)
    this.interval = setInterval(updateGameArea, 20)
  },
  clear: function () {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
  },
  stop: function () {
    clearInterval(this.interval)
  },
}

class Component {
  constructor(img, width, height, x, y) {
    this.isGravityReversed = false
    this.width = width
    this.height = height
    this.x = x
    this.y = y
    this.speedX = 0
    this.speedY = 0
    this.img = img
    this.gravity = 0.3
  }
  update() {
    const ctx = gameBoard.context
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height)
  }
  move() {
    this.speedY = this.speedY + this.gravity
    this.x += this.speedX
    if (this.isGravityReversed) {
      this.y -= this.speedY
    } else {
      this.y += this.speedY
    }
  }
  left() {
    return this.x
  }

  right() {
    return this.x + this.width
  }

  top() {
    return this.y
  }

  bottom() {
    return this.y + this.height
  }

  crashWith(pipe) {
    return !(
      this.bottom() < pipe.top() ||
      this.top() > pipe.bottom() ||
      this.right() < pipe.left() ||
      this.left() > pipe.right()
    )
  }
}

document.addEventListener('keydown', ({ key }) => {
  switch (key) {
    case 'Up':
    case 'ArrowUp':
      player.speedY -= 10
      break
    case 'Down':
    case 'ArrowDown':
      player.speedY += 2
      break
    case 'Left':
    case 'ArrowLeft':
      player.speedX -= 2
      break
    case 'Right':
    case 'ArrowRight':
      player.speedX += 2
      break
    case ' ':
      player.isGravityReversed = true
      break
    default:
      return
  }
})

document.addEventListener('keyup', (e) => {
  player.speedX = 0
  player.speedY = 0
  if (e.key === ' ') {
    player.isGravityReversed = false
  }
})

const player = new Component(faby, 30, 30, 0, 110)

const bg = new Image()
bg.src = '../images/bg.png'

let background = new Component(
  bg,
  gameBoard.canvas.width,
  gameBoard.canvas.height,
  0,
  0
)

const updatePipes = () => {
  gameBoard.frames += 1

  if (gameBoard.frames % 120 === 0) {
    let x = gameBoard.canvas.width
    let minHeight = 20
    let maxHeight = 250
    let height = Math.floor(
      Math.random() * (maxHeight - minHeight + 1) + minHeight
    )
    let minGap = 75
    let maxGap = 150
    let gap = Math.floor(Math.random() * (maxGap - minGap + 1) + minGap)
    pipeOnTop = new Component(topPipe, 30, height, x, 0)
    pipesArray.push(pipeOnTop)
    pipesArray.push(
      new Component(bottomPipe, 30, x - height - gap, x, height + gap)
    )
  }

  for (i = 0; i < pipesArray.length; i++) {
    pipesArray[i].x += -2
    pipesArray[i].update()
    if (pipesArray[i].x + 20 < 0) {
      pipesArray.shift()
      pipesSurvived++
      currentScore += pipesSurvived
    }
  }
}

const updateScore = () => {
  const newScore = document.getElementById('new-score')
  newScore.innerHTML = `SCORE: ${currentScore}`
}
const checkGameOver = () => {
  const crashed = pipesArray.some(function (pipe) {
    return player.crashWith(pipe)
  })
  let outOfBounds = false
  if (player.y < 0 || player.y > gameBoard.canvas.height) {
    outOfBounds = true
  }

  if (crashed || outOfBounds) {
    //reset
    currentScore = 0
    pipesSurvived = 0
    gameBoard.stop()
    return
  }
}

const updateBg = () => {
  gameBoard.context.drawImage(
    background.img,
    background.x,
    background.y,
    gameBoard.canvas.width,
    gameBoard.canvas.height
  )
  gameBoard.context.drawImage(
    background.img,
    background.x + background.width,
    background.y,
    gameBoard.canvas.width,
    gameBoard.canvas.height
  )
  background.x--
  if (background.x < -background.width) background.x = 0
}

function updateGameArea() {
  gameBoard.clear()
  updateBg()
  player.move()
  player.update()
  updatePipes()
  updateScore()
  checkGameOver()
}
