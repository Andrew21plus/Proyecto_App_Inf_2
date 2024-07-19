// src/pages/TicTacToeComponent.js
import React, { useState, useEffect } from 'react';
import '../utils/TicTacToeComponent.css';

const TicTacToeComponent = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);

  useEffect(() => {
    if (!isXNext && !calculateWinner(board) && board.includes(null)) {
      const bestMove = getBestMove(board, 'O');
      if (bestMove !== undefined) {
        const newBoard = board.slice();
        newBoard[bestMove] = 'O';
        setBoard(newBoard);
        setIsXNext(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isXNext, board,]);

  const handleClick = (index) => {
    const newBoard = board.slice();
    if (newBoard[index] || calculateWinner(board)) return;
    newBoard[index] = 'X';
    setBoard(newBoard);
    setIsXNext(false);
  };

  const calculateWinner = (board) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }
    return null;
  };

  const getBestMove = (board, player) => {
    const opponent = player === 'X' ? 'O' : 'X';
    const emptyIndices = board.map((val, idx) => (val === null ? idx : null)).filter(val => val !== null);

    if (calculateWinner(board) === player) return { score: 10 };
    if (calculateWinner(board) === opponent) return { score: -10 };
    if (emptyIndices.length === 0) return { score: 0 };

    const moves = [];

    for (let i = 0; i < emptyIndices.length; i++) {
      const idx = emptyIndices[i];
      const newBoard = board.slice();
      newBoard[idx] = player;
      const result = getBestMove(newBoard, opponent);
      moves.push({ index: idx, score: result.score });
    }

    let bestMove;
    if (player === 'O') {
      let bestScore = -Infinity;
      for (let i = 0; i < moves.length; i++) {
        if (moves[i].score > bestScore) {
          bestScore = moves[i].score;
          bestMove = moves[i];
        }
      }
    } else {
      let worstScore = Infinity;
      for (let i = 0; i < moves.length; i++) {
        if (moves[i].score < worstScore) {
          worstScore = moves[i].score;
          bestMove = moves[i];
        }
      }
    }

    return bestMove ? bestMove.index : emptyIndices[0]; // Asegurarse de que siempre retornemos un índice válido
  };

  const winner = calculateWinner(board);
  const isBoardFull = board.every(cell => cell !== null);
  const status = winner
    ? `Ganador: ${winner}`
    : isBoardFull
    ? 'Empate'
    : `Siguiente: ${isXNext ? 'X' : 'O'}`;

  return (
    <div className='game'>
      <div className='status'>{status}</div>
      <div className='board'>
        {board.map((value, index) => (
          <button key={index} className='square' onClick={() => handleClick(index)}>
            {value}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TicTacToeComponent;
