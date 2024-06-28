const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  boardState: {
    type: String,
    required: true
  },
  currentPlayer: {
    type: String,
    required: true
  },
});

module.exports = mongoose.model('Game', gameSchema);
