const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const authRoutes = require('./authRoutes');
const gameRoutes = require('./gameRouts');
const { initializeGame, makeMove } = require('./chessLogic');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }
});

const PORT = process.env.PORT || 5000;

const corsOptions = {
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/chessDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB');
});

let game = initializeGame(); 

io.on('connection', (socket) => {
  console.log('Socket connected');

  socket.on('getInitialGameState', async () => {
    socket.emit('gameState', { boardState: game.fen(), moves: [], status: 'ongoing' });
  });

  socket.on('makeMove', async ({ move }, callback) => {
    console.log('Received move:', move);

    const result = makeMove(game, move);

    if (result.valid) {
      io.emit('gameState', { boardState: result.fen, moves: ['move1', 'move2'], status: 'ongoing' });
      callback({ success: true });
    } else {
      callback({ error: result.error });
    }
  });

  socket.on('disconnect', () => {
    console.log('Socket disconnected');
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/game', gameRoutes);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
