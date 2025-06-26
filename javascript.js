const gameBoard = (function(){
    let board = [
        '','','',
        '','','',
        '','',''
    ]

    const getBoard = () => board;

    const updateBoard = (index,marker) => {
        if(board[index] === ''){
            board[index] = marker;
        }
    };

    const resetBoard = () => board = ['','','','','','','','',''];

    return {getBoard,updateBoard,resetBoard};
})();

const createPlayer = (name,marker) => {
  return {name, marker};
}

const gameController = (function(){
  const player1 = createPlayer("Player 1", "X");
  const player2 = createPlayer("Player 2" , "O");
  let currentPlayer = player1;
  let gameOver = false;

  const getCurrentPlayer = () => currentPlayer;

  const playRound = (index) => {
    if(gameOver || gameBoard.getBoard()[index] !== "")return;

    gameBoard.updateBoard(index, currentPlayer.marker);

    if(checkWin()){
      displayController.setModalText(`${currentPlayer.name} wins!`);
      gameOver = true;
    }
    else if(checkTie()){
      displayController.setModalText(`Its a tie!`);
    }
    else{
      currentPlayer = currentPlayer === player1 ? player2 : player1;
    }
    displayController.render();
  };


 const checkWin = () => {
    const b = gameBoard.getBoard();
    const winCombos = [
      [0,1,2],[3,4,5],[6,7,8],
      [0,3,6],[1,4,7],[2,5,8],
      [0,4,8],[2,4,6],
    ];
    return winCombos.some(combo =>
      combo.every(i => b[i] === currentPlayer.marker)
    );
  };
  const checkTie = () =>{
    const b = gameBoard.getBoard();
    const isFull = b.every(cell => cell != '');
    return isFull && !checkWin();
    }

  const reset = () => {
  currentPlayer = player1;
  gameOver = false;
  };
  return {checkWin, checkTie, playRound,reset,getCurrentPlayer};
})();




const displayController = (function() {
const container = document.getElementById("game-container");
const modalPop = document.getElementById("end-screen");
const resetButton = document.getElementById("resetBtn");
const modalMessage = document.getElementById("modal-message");


resetButton.addEventListener("click", function(){
  gameBoard.resetBoard();
  modalPop.close();
  gameController.reset();
  displayController.render();
})

const setModalText = (text) => {
  modalMessage.textContent = text;
  modalPop.showModal();
}


const render = () => {
  const board = gameBoard.getBoard();
  container.innerHTML = '';

  const current = document.getElementById("player-container");
  const player = gameController.getCurrentPlayer();
  current.innerText = `${player.name}'s Turn (${player.marker})`;

  board.forEach((cell, index) => {
    const tile = document.createElement("div");
    tile.classList.add('tile');
    tile.textContent = cell;

    tile.addEventListener("click", () => {
      gameController.playRound(index);
      render();
    });

    tile.addEventListener("mouseover", () => {
      if(gameBoard.getBoard()[index] === ""){
        tile.style.backgroundColor = "gray";
      }
  })

    tile.addEventListener("mouseout", () => {
      tile.style.backgroundColor = ""; // resets to default
    });


    container.appendChild(tile);
  });
}


  return {render, setModalText};
})();



const startButton = document.getElementById("startBtn");

startButton.addEventListener("click",function(){
  displayController.render();
  startButton.style.display="none";
});

const modalPop = document.getElementById("end-screen");




