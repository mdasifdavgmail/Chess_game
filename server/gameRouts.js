const express = require('express');
const router = express.Router();

const Game = require('./Game');
const { validateMove } = require('./validation');
const authMiddleware = require('./auth');

router.get('/:gameId', authMiddleware, async (req, res) => {
  try {
    const gameId = req.params.gameId;
    const game = await Game.findById(gameId);
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }
    res.json(game); 
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

router.post('/:gameId/move', authMiddleware, async (req, res) => {
  try {
    const gameId = req.params.gameId;
    const { move } = req.body;

    const isValidMove = validateMove(move);

    if (!isValidMove) {
      return res.status(400).json({ message: 'Invalid move' });
    }

    const game = await Game.findById(gameId);
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }

    const result = makeMove(game, move);

    if (!result.valid) {
      return res.status(400).json({ message: result.error });
    }

    game.boardState = result.fen;
    await game.save();

    io.emit('gameState', { 
      boardState: result.fen, 
      moves: game.moves || [], 
      status: 'ongoing',
      eliminatedPieces: result.eliminatedPieces
    });

    res.json({ success: true, eliminatedPieces: result.eliminatedPieces });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
