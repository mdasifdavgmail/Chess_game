const Chess = require('chess.js').Chess;

function initializeGame() {
  return new Chess();
}

function makeMove(game, move) {
  const moveResult = game.move({
    from: move.sourceSquare,
    to: move.targetSquare,
    promotion: 'q' 
  });

  if (moveResult) {
    return {
      valid: true,
      fen: game.fen()
    };
  } else {
    return {
      valid: false,
      error: 'Invalid move'
    };
  }
}

module.exports = {
  initializeGame,
  makeMove
};
