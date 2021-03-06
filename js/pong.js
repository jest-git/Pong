window.onload = function () {
  // canvas
  let canvas = document.getElementById("gameCanvas");
  let canvasContext = canvas.getContext("2d");
  const canvasWidth = canvas.width;
  const canvasHeight = canvas.height;

  //game settings
  const bgColour = "black";
  const drawColour = "white";
  const FPS = 30;
  const winScore = 5;

  //paddles
  const paddlesWidth = 10;
  const paddlesHeight = 100;
  const paddlesPosYCenter = canvas.height / 2 - paddlesHeight / 2;
  let paddle1PosY = paddlesPosYCenter;
  const paddle1PosX = 0;
  let paddle2PosY = paddlesPosYCenter;
  const paddle2PosX = canvasWidth - paddlesWidth;

  //ball
  const ballRadius = 10;
  const ballStartPosX = canvasWidth / 2;
  const ballStartPosY = canvasHeight / 2;
  let ballPosX = ballStartPosX;
  let ballPosY = ballStartPosY;
  let ballSpeedX = 10;
  const ballStarSpeedY = 4;
  let ballSpeedY = ballStarSpeedY;
  const ballSpeedYDelta = 0.3;

  //net
  const netDotWidth = 2;
  const netDotHeight = 20;
  const netGapSize = netDotHeight * 2;
  const netPosXCenter = canvasWidth / 2 - netDotWidth / 2;

  //players score
  let player1Score = 0;
  let player2Score = 0;
  //players score GUI
  const scoreGuiFontSizePx = 30;
  let scoreGuiFont = scoreGuiFontSizePx + "px verdana";
  const player1scoreGuiPosX = canvasWidth / 4;
  const player2scoreGuiPosX = player1scoreGuiPosX * 3;
  const playersScoreGuiPosY = 50;

  //Computer movement
  const aiReactSpeed = 30;
  const aiYSpeed = 5;

  let showingWinScreen = false;

  runGame();

  function runGame() {
    setInterval(function () {
      calculateFrame();
      render();
    }, 1000 / FPS);

    //left paddle mouse movement
    canvas.addEventListener("mousemove", function (evt) {
      let mousePos = calculateMousePos(evt);
      paddle1PosY = mousePos.y - paddlesHeight / 2;
    });

    //restart game
    canvas.addEventListener("mousedown", handleMouseClick);
  }

  function calculateMousePos(evt) {
    const rect = canvas.getBoundingClientRect();
    const root = document.documentElement;
    let mouseX = evt.clientX - rect.left - root.scrollLeft;
    let mouseY = evt.clientY - rect.top - root.scrollTop;
    return {
      x: mouseX,
      y: mouseY,
    };
  }

  function handleMouseClick(evt) {
    if (showingWinScreen) {
      player1Score = 0;
      player2Score = 0;
      showingWinScreen = false;
    }
  }

  function calculateFrame() {
    if (showingWinScreen) {
      return;
    }

    computerMovement();

    //move ball
    ballPosX = ballPosX + ballSpeedX;
    ballPosY = ballPosY + ballSpeedY;

    //bounce ball top and bottom screen
    if (ballPosY < 0 || ballPosY > canvasHeight) {
      ballSpeedY = -ballSpeedY;
    }

    //paddles bounce ball
    if (ballPosX < paddlesWidth && ballPosY > paddle1PosY && ballPosY < paddle1PosY + paddlesHeight) {
      ballSpeedX = -ballSpeedX;
      let deltaY = ballPosY - (paddle1PosY + paddlesHeight / 2);
      ballSpeedY = deltaY * ballSpeedYDelta;
    } else if (
      ballPosX > canvasWidth - paddlesWidth &&
      ballPosY > paddle2PosY &&
      ballPosY < paddle2PosY + paddlesHeight
    ) {
      ballSpeedX = -ballSpeedX;
      let deltaY = ballPosY - (paddle2PosY + paddlesHeight / 2);
      ballSpeedY = deltaY * ballSpeedYDelta;
    }

    //score
    if (ballPosX < 0) {
      player2Score++;
      ballReset();
    } else if (ballPosX > canvasWidth) {
      player1Score++;
      ballReset();
    }
  }

  function computerMovement() {
    var paddle2YCenter = paddle2PosY + paddlesHeight / 2;
    if (paddle2YCenter < ballPosY - aiReactSpeed) {
      paddle2PosY = paddle2PosY + aiYSpeed;
    } else if (paddle2YCenter > ballPosY + aiReactSpeed) {
      paddle2PosY = paddle2PosY - aiYSpeed;
    }
  }

  function ballReset() {
    if (player1Score >= winScore || player2Score >= winScore) {
      showingWinScreen = true;
    }

    ballSpeedX = -ballSpeedX;
    ballSpeedY = getRandomInt(-ballStarSpeedY, ballStarSpeedY);

    ballPosX = ballStartPosX;
    ballPosY = ballStartPosY;
  }

  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }

  function render() {
    //draw background
    drawRect(0, 0, canvasWidth, canvasHeight, bgColour);

    if (showingWinScreen) {
      drawWinningScreen();
      return;
    }

    //draw paddles
    drawRect(paddle1PosX, paddle1PosY, paddlesWidth, paddlesHeight, drawColour); //left
    drawRect(paddle2PosX, paddle2PosY, paddlesWidth, paddlesHeight, drawColour); //right

    //draw ball
    drawCircle(ballPosX, ballPosY, ballRadius, drawColour);

    //draw net
    drawNet(netPosXCenter, netDotWidth, netDotHeight, drawColour, netGapSize);

    //draw score GUI
    drawTxt(player1scoreGuiPosX, playersScoreGuiPosY, player1Score, scoreGuiFont, drawColour);
    drawTxt(player2scoreGuiPosX, playersScoreGuiPosY, player2Score, scoreGuiFont, drawColour);
  }

  function drawRect(posX, posY, width, height, colour) {
    canvasContext.fillStyle = colour;
    canvasContext.fillRect(posX, posY, width, height);
  }

  function drawCircle(centerPosX, centerPosY, radius, colour) {
    canvasContext.fillStyle = colour;
    canvasContext.beginPath();
    canvasContext.arc(centerPosX, centerPosY, radius, 0, Math.PI * 2, true);
    canvasContext.fill();
  }

  function drawNet(posX, dotWidth, dotHeight, colour, gapSize) {
    for (var i = 0; i < canvasHeight; i += gapSize) {
      drawRect(posX, i, dotWidth, dotHeight, colour);
    }
  }

  function drawTxt(posX, posY, txt, font, colour) {
    canvasContext.fillStyle = colour;
    canvasContext.font = font;
    canvasContext.textAlign = "center";
    canvasContext.fillText(txt, posX, posY);
  }

  function drawWinningScreen() {
    if (player1Score >= winScore) {
      drawTxt(canvasWidth / 2, canvasHeight / 2, "Left Player Won", scoreGuiFont, drawColour);
    } else if (player2Score >= winScore) {
      drawTxt(canvasWidth / 2, canvasHeight / 2, "Right Player Won", scoreGuiFont, drawColour);
    }
    drawTxt(canvasWidth / 2, canvasHeight / 1.2, "click to continue", scoreGuiFont, drawColour);
  }
};