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

  let eliminatedPiece = null;

  
  if (moveResult && moveResult.captured) {
    eliminatedPiece = {
      color: moveResult.color === 'w' ? 'black' : 'white',
      piece: moveResult.captured
    };
  }

  if (moveResult) {
    return {
      valid: true,
      fen: game.fen(),
      eliminatedPiece
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
