const game = (() => {
  //As soon as the human player has made 3 moves, check if they have won
  const checkGameState = () => {
    if (player1.getPlayerMoves() > 2) {
      determineWinner();
    }
  };

  //In order to figure out who won, we look through each object in the win condition board array and its win condition array to see if any has an array length of 3, which means the player has put 3 game pieces in the correct positions to enable a win
  const determineWinner = () => {
    const boardResult = gameBoard.getWinningBoard();
    const gamePieceElements = document.querySelectorAll(".game-piece");
    const gamePieceElementsArr = [...gamePieceElements];
    const areAllGamePiecesTaken = gamePieceElementsArr.every((gamePiece) => {
      return gamePiece.classList.contains("taken");
    });

    //Look through both win condition boards (for both players) and see if any have an array length of 3.
    for (let i = 0; i < boardResult.length; i++) {
      const winArrayP1 = boardResult[i].winConditionP1;
      const winArrayP2 = boardResult[i].winConditionP2;
      if (winArrayP1.length == 3) {
        console.log(
          `${player1.getName()} won by filling out ${boardResult[i].win}`
        );
        player1.setScore();
        player1.setWinner(true);
        gameBoard.displayWinner();
        gameBoard.updateScoreDisplay();
      } else if (winArrayP2.length == 3) {
        console.log(
          `${player2CPU.getName()} won by filling out ${boardResult[i].win}`
        );
        player2CPU.setScore();
        player2CPU.setWinner(true);
        gameBoard.displayWinner();
        gameBoard.updateScoreDisplay();
      }
    }
    //Here we check if its a draw
    if (
      areAllGamePiecesTaken == true &&
      player1.getWinner() == false &&
      player2CPU.getWinner() == false
    ) {
      gameBoard.displayDraw();
    }
  };

  //Reset the variables when we click the reset game button or any of the marker buttons
  const resetGame = () => {
    player1.setWinner(false);
    player1.setPlayerMoves(-player1.getPlayerMoves());
    player2CPU.setWinner(false);
    player2CPU.setPlayerMoves(-player2CPU.getPlayerMoves());
    gameBoard.activateClearBoard();
  };
  return { determineWinner, checkGameState, resetGame };
})();

//Here we set up the board to have one event listener that captures which gamepiece has been clicked and can pass that on to the other modules that need to know to determine who won
const gameBoard = (() => {
  let board = [];
  const getBoard = () => board;
  let winningBoard = [
    { win: "row1", winConditionP1: [], winConditionP2: [] },
    { win: "row2", winConditionP1: [], winConditionP2: [] },
    { win: "row3", winConditionP1: [], winConditionP2: [] },
    { win: "col1", winConditionP1: [], winConditionP2: [] },
    { win: "col2", winConditionP1: [], winConditionP2: [] },
    { win: "col3", winConditionP1: [], winConditionP2: [] },
    { win: "diag1", winConditionP1: [], winConditionP2: [] },
    { win: "diag2", winConditionP1: [], winConditionP2: [] },
  ];
  //console.log(winningBoard[0].winConditionP1);
  const getWinningBoard = () => winningBoard;
  const activateClearBoard = () => clearBoard();
  const revealBoard = () => {
    console.log(`Here is the board ${JSON.stringify(board)}`);
  };

  //Lets fill the gameboard with the possible spots game pieces can occupy
  const populateBoard = () => {
    const gamePieces = document.querySelectorAll(".game-piece");
    //console.log(gamePieces);
    for (let i = 0; i < gamePieces.length; i++) {
      board.push({
        pos: gamePieces[i].getAttribute("id"),
        occupant: "Nobody",
      });
    }
  };
  populateBoard();

  //The container for the board that we will be attaching a listener to, so we can register when a player clicks on a spot.
  const gameContainer = document.querySelector(".game-container");

  gameContainer.addEventListener("click", (event) => addGamePieces(event));

  function addGamePieces(event) {
    if (
      event.target.className == "game-piece" &&
      event.target.className != "taken" &&
      player1.getWinner() != true &&
      player2CPU.getWinner() != true
    ) {
      //Player makes the move
      addPlayerChoice(event);
      game.checkGameState();

      //Now the computer makes a move
      if (player1.getWinner() != true) {
        addComputerChoice();
        //Has anyone won yet?
        game.checkGameState();
      }
    }
  }

  function addPlayerChoice(event) {
    //Setup for the player making its move
    const gamePiecePos = event.target.getAttribute("id");
    const gamePiece = event.target;
    gamePiece.textContent = player1.getGamePiece();
    player1.setPlayerMoves(1);

    //
    updateGamePieces(player1, gamePiece, gamePiecePos);

    //Add to the gameboard win condition array for each piece clicked on
    const passWinConditionP1 = "winConditionP1";
    insertIntoWinConditionArr(gamePiecePos, passWinConditionP1);
  }

  //This is how the computer makes a move
  function addComputerChoice() {
    const gamePieceElements = document.querySelectorAll(".game-piece");
    const gamePiecesArr = [...gamePieceElements];
    const freeSpaces = gamePiecesArr.filter(
      (piece) => piece.classList.contains("taken") == false
    );

    if (freeSpaces.length > 0) {
      const rndIndexNum = Math.floor(Math.random() * freeSpaces.length);
      const chosenGamePieceId = freeSpaces[rndIndexNum].getAttribute("id");
      const chosenGamePiece = freeSpaces[rndIndexNum];
      chosenGamePiece.textContent = player2CPU.getGamePiece();

      //
      updateGamePieces(player2CPU, chosenGamePiece, chosenGamePieceId);

      //Add the chosen gamepiece into the win condition arr
      const passWinConditionP2 = "winConditionP2";
      insertIntoWinConditionArr(chosenGamePieceId, passWinConditionP2);
    }
  }
  //Add in the HTML the chosen game piece is now taken, and add to the boardgame array who occupies it
  function updateGamePieces(player, gamePiece, gamePiecePos) {
    for (let i = 0; i < board.length; i++) {
      if (gamePiecePos == board[i].pos) {
        gamePiece.classList.toggle("taken");
        board[i].occupant = player.getName();
      }
    }
  }

  function insertIntoWinConditionArr(gamePiecePos, winConditionArr) {
    //let winConditionArr = passedWinConditionArr;
    //console.log(winConditionArr);

    switch (gamePiecePos) {
      case "pos1":
        winningBoard[0][winConditionArr].push(gamePiecePos);
        winningBoard[3][winConditionArr].push(gamePiecePos);
        winningBoard[6][winConditionArr].push(gamePiecePos);
        break;

      case "pos2":
        winningBoard[0][winConditionArr].push(gamePiecePos);
        winningBoard[4][winConditionArr].push(gamePiecePos);
        break;

      case "pos3":
        winningBoard[0][winConditionArr].push(gamePiecePos);
        winningBoard[5][winConditionArr].push(gamePiecePos);
        winningBoard[7][winConditionArr].push(gamePiecePos);
        break;

      case "pos4":
        winningBoard[1][winConditionArr].push(gamePiecePos);
        winningBoard[3][winConditionArr].push(gamePiecePos);
        break;

      case "pos5":
        winningBoard[1][winConditionArr].push(gamePiecePos);
        winningBoard[4][winConditionArr].push(gamePiecePos);
        winningBoard[6][winConditionArr].push(gamePiecePos);
        winningBoard[7][winConditionArr].push(gamePiecePos);
        break;

      case "pos6":
        winningBoard[1][winConditionArr].push(gamePiecePos);
        winningBoard[5][winConditionArr].push(gamePiecePos);
        break;

      case "pos7":
        winningBoard[2][winConditionArr].push(gamePiecePos);
        winningBoard[3][winConditionArr].push(gamePiecePos);
        winningBoard[7][winConditionArr].push(gamePiecePos);
        break;

      case "pos8":
        winningBoard[2][winConditionArr].push(gamePiecePos);
        winningBoard[4][winConditionArr].push(gamePiecePos);
        break;

      case "pos9":
        winningBoard[2][winConditionArr].push(gamePiecePos);
        winningBoard[5][winConditionArr].push(gamePiecePos);
        winningBoard[6][winConditionArr].push(gamePiecePos);
        break;

      default:
        break;
    }
  }

  //When we reset the game we also need to wipe the board for old values
  function clearBoard() {
    board = [];
    populateBoard();
    for (let i = 0; i < winningBoard.length; i++) {
      winningBoard[i].winConditionP1 = [];
      winningBoard[i].winConditionP2 = [];
    }
    const gamePieces = document.querySelectorAll(".game-piece");
    //console.log(gamePieces);
    for (let i = 0; i < gamePieces.length; i++) {
      if (gamePieces[i].classList.contains("taken")) {
        //console.log(`${gamePieces[i]} has taken!`);
        gamePieces[i].classList.toggle("taken");
        gamePieces[i].textContent = "";
      }
    }

    const showWinner = document.getElementById("show-winner");
    showWinner.style.opacity = 0;

    console.log("Board has been cleard");
  }

  const displayWinner = () => {
    const showWinner = document.getElementById("show-winner");
    //const insertWinner = document.getElementById("insert-winner");
    if (player1.getWinner() == true) {
      showWinner.style.opacity = 1;
      showWinner.textContent = `${player1.getName()} WINS!`;
    } else {
      showWinner.style.opacity = 1;
      showWinner.textContent = `${player2CPU.getName()} WINS!`;
    }
  };

  const displayDraw = () => {
    const showWinner = document.getElementById("show-winner");
    showWinner.style.opacity = 1;
    //insertWinner.textContent = "Its a";
    showWinner.textContent = "Its a DRAW!";
  };

  const updateScoreDisplay = () => {
    const player1Score = document.getElementById("player1-score");
    player1Score.textContent = player1.getScore();
    const player2Score = document.getElementById("player2-score");
    player2Score.textContent = player2CPU.getScore();
  };

  return {
    getBoard,
    getWinningBoard,
    revealBoard,
    activateClearBoard,
    displayWinner,
    displayDraw,
    updateScoreDisplay,
  };
})();

const Player = (name, pieceChoice) => {
  let playerName = name;
  let score = 0;
  let winner = false;
  let playerMoves = 0;
  let playerGamePiece = pieceChoice;
  const displayScore = () => {
    console.log(`This is ${name}'s score: ${score}`);
  };

  const getScore = () => score;
  const setScore = () => score++;
  const getWinner = () => winner;
  const setWinner = (bool) => (winner = bool);
  const getPlayerMoves = () => playerMoves;
  const setPlayerMoves = (val) => (playerMoves += val);
  const getGamePiece = () => playerGamePiece;
  const setGamePiece = (piece) => (playerGamePiece = piece);
  const getName = () => playerName;
  const setName = (name) => (playerName = name);

  return {
    displayScore,
    getScore,
    setScore,
    getWinner,
    setWinner,
    getPlayerMoves,
    setPlayerMoves,
    getName,
    setName,
    getGamePiece,
    setGamePiece,
  };
};

const player1 = Player("Player1", "X");
const player2CPU = Player("Computer", "O");

//Lets  setup the available buttons
const btnSetup = (() => {
  //Change name btn
  const changeNameBtn = document.getElementById("change-name");

  const player1Name = document.getElementById("player1-name");

  //Change name
  changeNameBtn.addEventListener("click", () => {
    const newName = prompt("Please enter your name", "Enter here");
    player1Name.textContent = newName;
    player1.setName(newName);
  });

  //Reset game btn
  const resetGameBtn = document.getElementById("reset-game");
  resetGameBtn.addEventListener("click", game.resetGame);

  //Choose your marker
  const gamePieceChoiceCnt = document.getElementById("game-piece-choice");

  gamePieceChoiceCnt.addEventListener("click", (event) => {
    if (event.target.id == "x-button") {
      console.log(`You clicked ${event.target.textContent}`);
      game.resetGame();
      player1.setGamePiece(event.target.textContent);
      player2CPU.setGamePiece("O");
      event.target.classList.add("clicked");
      const oBtn = document.getElementById("o-button");
      oBtn.classList.remove("clicked");
    } else if (event.target.id == "o-button") {
      console.log(`You clicked ${event.target.textContent}`);
      game.resetGame();
      player1.setGamePiece(event.target.textContent);
      player2CPU.setGamePiece("X");
      event.target.classList.add("clicked");
      const xBtn = document.getElementById("x-button");
      xBtn.classList.remove("clicked");
    }
  });
})();
