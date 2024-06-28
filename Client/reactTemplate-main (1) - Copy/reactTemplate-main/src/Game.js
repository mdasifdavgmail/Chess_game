import React, { useEffect, useState } from 'react';
import Chessboard from 'chessboardjsx';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

const Game = () => {
  const [gameState, setGameState] = useState(null);
  const [moveHistory, setMoveHistory] = useState([]);
  const [gameStatus, setGameStatus] = useState('');

  useEffect(() => {
    socket.emit('getInitialGameState');

    socket.on('gameState', (gameState) => {
      console.log('Received gameState:', gameState);
      setGameState(gameState);
    });

    return () => {
      socket.off('gameState');
    };
  }, []);

  const handleMove = (move) => {
    console.log('Dropped move:', move);
    socket.emit('makeMove', { move }, (response) => {
      if (response.error) {
        console.error('Move error:', response.error);
      } else {
        console.log('Move successful:', response);
      }
    });
  };

  useEffect(() => {
    if (gameState) {
      setMoveHistory(gameState.moves || []);
      setGameStatus(gameState.status || '');
    }
  }, [gameState]);

  return (
    <div className="game">
      <div className="board">
        <Chessboard
          position={gameState ? gameState.boardState : 'start'}
          draggable={true}
          onDrop={(move) => handleMove(move)}
        />
      </div>
      <div className="info">
        <div className="history">
          <h3>Move History</h3>
          <ul>
            {moveHistory.map((move, index) => (
              <li key={index}>{move}</li>
            ))}
          </ul>
        </div>
        <div className="status">
          <h3>Game Status</h3>
          <p>{gameStatus}</p>
        </div>
      </div>
    </div>
  );
};

export default Game;
