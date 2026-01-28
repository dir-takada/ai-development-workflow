'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

type TetrominoType = 'I' | 'J' | 'L' | 'O' | 'S' | 'T' | 'Z';

interface Tetromino {
  type: TetrominoType;
  shape: number[][];
  color: string;
}

const TETROMINOS: Record<TetrominoType, Omit<Tetromino, 'type'>> = {
  I: {
    shape: [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    color: '#00f0f0',
  },
  J: {
    shape: [
      [1, 0, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
    color: '#0000f0',
  },
  L: {
    shape: [
      [0, 0, 1],
      [1, 1, 1],
      [0, 0, 0],
    ],
    color: '#f0a000',
  },
  O: {
    shape: [
      [1, 1],
      [1, 1],
    ],
    color: '#f0f000',
  },
  S: {
    shape: [
      [0, 1, 1],
      [1, 1, 0],
      [0, 0, 0],
    ],
    color: '#00f000',
  },
  T: {
    shape: [
      [0, 1, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
    color: '#a000f0',
  },
  Z: {
    shape: [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 0],
    ],
    color: '#f00000',
  },
};

const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;
const CELL_SIZE = 30;

const createEmptyBoard = (): number[][] => {
  return Array.from({ length: BOARD_HEIGHT }, () => Array(BOARD_WIDTH).fill(0));
};

const getRandomTetromino = (): Tetromino => {
  const types: TetrominoType[] = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'];
  const type = types[Math.floor(Math.random() * types.length)];
  return { type, ...TETROMINOS[type] };
};

export default function TetrisPage() {
  const [board, setBoard] = useState<number[][]>(createEmptyBoard());
  const [currentPiece, setCurrentPiece] = useState<Tetromino | null>(null);
  const [nextPiece, setNextPiece] = useState<Tetromino>(getRandomTetromino());
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

  const isColliding = useCallback(
    (piece: Tetromino, pos: { x: number; y: number }, boardState: number[][]) => {
      for (let y = 0; y < piece.shape.length; y++) {
        for (let x = 0; x < piece.shape[y].length; x++) {
          if (piece.shape[y][x]) {
            const newX = pos.x + x;
            const newY = pos.y + y;
            if (
              newX < 0 ||
              newX >= BOARD_WIDTH ||
              newY >= BOARD_HEIGHT ||
              (newY >= 0 && boardState[newY][newX])
            ) {
              return true;
            }
          }
        }
      }
      return false;
    },
    []
  );

  const rotatePiece = useCallback((piece: Tetromino): Tetromino => {
    const rotated = piece.shape[0].map((_, index) =>
      piece.shape.map(row => row[index]).reverse()
    );
    return { ...piece, shape: rotated };
  }, []);

  const mergePieceToBoard = useCallback(
    (piece: Tetromino, pos: { x: number; y: number }, boardState: number[][]) => {
      const newBoard = boardState.map(row => [...row]);
      for (let y = 0; y < piece.shape.length; y++) {
        for (let x = 0; x < piece.shape[y].length; x++) {
          const boardY = pos.y + y;
          const boardX = pos.x + x;
          // Add comprehensive boundary checks for all four directions
          if (
            piece.shape[y][x] &&
            boardY >= 0 &&
            boardY < BOARD_HEIGHT &&
            boardX >= 0 &&
            boardX < BOARD_WIDTH
          ) {
            newBoard[boardY][boardX] = 1;
          }
        }
      }
      return newBoard;
    },
    []
  );

  const clearLines = useCallback((boardState: number[][]) => {
    let linesCleared = 0;
    const newBoard = boardState.filter(row => {
      if (row.every(cell => cell === 1)) {
        linesCleared++;
        return false;
      }
      return true;
    });

    while (newBoard.length < BOARD_HEIGHT) {
      newBoard.unshift(Array(BOARD_WIDTH).fill(0));
    }

    return { newBoard, linesCleared };
  }, []);

  const spawnNewPiece = useCallback(() => {
    const piece = nextPiece;
    const startX = Math.floor(BOARD_WIDTH / 2) - Math.floor(piece.shape[0].length / 2);
    const startY = 0;

    setCurrentPiece(piece);
    setPosition({ x: startX, y: startY });
    setNextPiece(getRandomTetromino());

    if (isColliding(piece, { x: startX, y: startY }, board)) {
      setGameOver(true);
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    }
  }, [nextPiece, board, isColliding]);

  const moveDown = useCallback(() => {
    if (!currentPiece || gameOver || isPaused) return;

    const newPos = { x: position.x, y: position.y + 1 };

    if (!isColliding(currentPiece, newPos, board)) {
      setPosition(newPos);
    } else {
      const mergedBoard = mergePieceToBoard(currentPiece, position, board);
      const { newBoard, linesCleared } = clearLines(mergedBoard);
      setBoard(newBoard);
      setScore(prev => prev + linesCleared * 100);
      spawnNewPiece();
    }
  }, [currentPiece, position, board, gameOver, isPaused, isColliding, mergePieceToBoard, clearLines, spawnNewPiece]);

  const moveLeft = useCallback(() => {
    if (!currentPiece || gameOver || isPaused) return;
    const newPos = { x: position.x - 1, y: position.y };
    if (!isColliding(currentPiece, newPos, board)) {
      setPosition(newPos);
    }
  }, [currentPiece, position, board, gameOver, isPaused, isColliding]);

  const moveRight = useCallback(() => {
    if (!currentPiece || gameOver || isPaused) return;
    const newPos = { x: position.x + 1, y: position.y };
    if (!isColliding(currentPiece, newPos, board)) {
      setPosition(newPos);
    }
  }, [currentPiece, position, board, gameOver, isPaused, isColliding]);

  const rotate = useCallback(() => {
    if (!currentPiece || gameOver || isPaused) return;
    const rotated = rotatePiece(currentPiece);
    if (!isColliding(rotated, position, board)) {
      setCurrentPiece(rotated);
    }
  }, [currentPiece, position, board, gameOver, isPaused, rotatePiece, isColliding]);

  const hardDrop = useCallback(() => {
    if (!currentPiece || gameOver || isPaused) return;
    let newPos = { ...position };
    while (!isColliding(currentPiece, { x: newPos.x, y: newPos.y + 1 }, board)) {
      newPos.y++;
    }
    // Directly merge the piece at the final position to avoid async state issues
    const mergedBoard = mergePieceToBoard(currentPiece, newPos, board);
    const { newBoard, linesCleared } = clearLines(mergedBoard);
    setBoard(newBoard);
    setScore(prev => prev + linesCleared * 100);
    spawnNewPiece();
  }, [currentPiece, position, board, gameOver, isPaused, isColliding, mergePieceToBoard, clearLines, spawnNewPiece]);

  const resetGame = useCallback(() => {
    setBoard(createEmptyBoard());
    setCurrentPiece(null);
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
    setNextPiece(getRandomTetromino());
  }, []);

  useEffect(() => {
    if (!currentPiece) {
      spawnNewPiece();
    }
  }, [currentPiece, spawnNewPiece]);

  useEffect(() => {
    if (gameOver || isPaused) return;

    gameLoopRef.current = setInterval(() => {
      moveDown();
    }, 1000);

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [moveDown, gameOver, isPaused]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (gameOver) {
        if (e.key === 'Enter') {
          resetGame();
        }
        return;
      }

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          moveLeft();
          break;
        case 'ArrowRight':
          e.preventDefault();
          moveRight();
          break;
        case 'ArrowDown':
          e.preventDefault();
          moveDown();
          break;
        case 'ArrowUp':
          e.preventDefault();
          rotate();
          break;
        case ' ':
          e.preventDefault();
          hardDrop();
          break;
        case 'p':
        case 'P':
          setIsPaused(prev => !prev);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [moveLeft, moveRight, moveDown, rotate, hardDrop, gameOver, resetGame]);

  const renderBoard = () => {
    const displayBoard = board.map(row => [...row]);

    if (currentPiece && !gameOver) {
      for (let y = 0; y < currentPiece.shape.length; y++) {
        for (let x = 0; x < currentPiece.shape[y].length; x++) {
          const boardY = position.y + y;
          const boardX = position.x + x;
          if (currentPiece.shape[y][x] && boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
            displayBoard[boardY][boardX] = 2;
          }
        }
      }
    }

    return displayBoard.map((row, y) => (
      <div key={y} className="flex">
        {row.map((cell, x) => (
          <div
            key={x}
            className="border border-gray-700"
            style={{
              width: CELL_SIZE,
              height: CELL_SIZE,
              backgroundColor:
                cell === 2 && currentPiece
                  ? currentPiece.color
                  : cell === 1
                  ? '#666'
                  : '#1a1a1a',
            }}
          />
        ))}
      </div>
    ));
  };

  const renderNextPiece = () => {
    const maxSize = Math.max(nextPiece.shape.length, nextPiece.shape[0].length);
    return (
      <div className="inline-block">
        {nextPiece.shape.map((row, y) => (
          <div key={y} className="flex">
            {row.map((cell, x) => (
              <div
                key={x}
                className="border border-gray-700"
                style={{
                  width: CELL_SIZE * 0.7,
                  height: CELL_SIZE * 0.7,
                  backgroundColor: cell ? nextPiece.color : '#1a1a1a',
                }}
              />
            ))}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-8">
      <div className="flex gap-8">
        <div className="bg-gray-800 p-6 rounded-lg shadow-2xl">
          <h1 className="text-4xl font-bold text-white mb-6 text-center">TETRIS</h1>
          <div className="relative">
            {renderBoard()}
            {gameOver && (
              <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-white text-3xl font-bold mb-4">GAME OVER</p>
                  <p className="text-white text-xl mb-4">Score: {score}</p>
                  <p className="text-gray-300 text-sm">Press Enter to restart</p>
                </div>
              </div>
            )}
            {isPaused && !gameOver && (
              <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center">
                <p className="text-white text-3xl font-bold">PAUSED</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="bg-gray-800 p-6 rounded-lg shadow-xl">
            <h2 className="text-xl font-bold text-white mb-4">Next</h2>
            <div className="flex justify-center">{renderNextPiece()}</div>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg shadow-xl">
            <h2 className="text-xl font-bold text-white mb-4">Score</h2>
            <p className="text-3xl font-bold text-yellow-400">{score}</p>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg shadow-xl">
            <h2 className="text-xl font-bold text-white mb-4">Controls</h2>
            <div className="text-gray-300 text-sm space-y-2">
              <p>← → : Move</p>
              <p>↓ : Soft Drop</p>
              <p>↑ : Rotate</p>
              <p>Space : Hard Drop</p>
              <p>P : Pause</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
