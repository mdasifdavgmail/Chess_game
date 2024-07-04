import React, { useEffect, useState } from 'react';
import Chessboard from 'chessboardjsx';
import io from 'socket.io-client';
import './Game.css';

const socket = io('http://localhost:5000');

const pieceEmojis = {
  white: {
    p: '♙', 
    r: '♖', 
    n: '♘', 
    b: '♗', 
    q: '♕', 
    k: '♔'  
  },
  black: {
    p: '♟', 
    r: '♜', 
    n: '♞', 
    b: '♝', 
    q: '♛', 
    k: '♚'  
  }
};

const Game = () => {
  const [gameState, setGameState] = useState(null);
  const [moveHistory, setMoveHistory] = useState([]);
  const [gameStatus, setGameStatus] = useState('');
  const [eliminatedPieces, setEliminatedPieces] = useState([]);

  useEffect(() => {
    socket.emit('getInitialGameState');

    socket.on('gameState', (gameState) => {
      console.log('Received gameState:', gameState);
      setGameState(gameState);
      setEliminatedPieces(gameState.eliminatedPieces || []);
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
      <div className="eliminated-pieces">
        <h3>Eliminated Pieces</h3>
        <ul>
          {eliminatedPieces.map((piece, index) => (
            <li key={index} className={piece.color}>
              {pieceEmojis[piece.color][piece.piece]} {piece.color}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Game;
