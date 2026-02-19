import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon, Monitor, Home, Settings, Info, Trophy, History } from "lucide-react";

interface GameState {
  board: (string | null)[];
  currentPlayer: string;
  winner: string | null;
  isDraw: boolean;
  gameMode: 'player' | 'computer';
  scores: { player: number; computer: number; draws: number };
}

interface GameHistory {
  id: string;
  date: string;
  winner: string;
  gameMode: string;
  duration: number;
}

// Theme Context
const ThemeContext = React.createContext<{
  theme: string;
  setTheme: (theme: string) => void;
}>({ theme: 'system', setTheme: () => {} });

// Utility Functions
const saveToLocalStorage = (key: string, data: any) => {
  localStorage.setItem(key, JSON.stringify(data));
};

const loadFromLocalStorage = (key: string, defaultValue: any) => {
  const item = localStorage.getItem(key);
  return item ? JSON.parse(item) : defaultValue;
};

// Game Logic
const calculateWinner = (squares: (string | null)[]): string | null => {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6] // diagonals
  ];

  for (const [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
};

// Computer Move Logic
const getComputerMove = (board: (string | null)[]): number => {
  const availableMoves = board.map((cell, index) => cell === null ? index : -1).filter(index => index !== -1);
  return availableMoves[Math.floor(Math.random() * availableMoves.length)];
};

// Components
const Navigation = () => {
  const location = useLocation();
  const { theme, setTheme } = React.useContext(ThemeContext);

  const navItems = [
    { path: '/', icon: Home, label: 'Game' },
    { path: '/history', icon: History, label: 'History' },
    { path: '/settings', icon: Settings, label: 'Settings' },
    { path: '/about', icon: Info, label: 'About' }
  ];

  return (
    <motion.nav 
      className="navigation"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="nav-container">
        <motion.div 
          className="logo"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Trophy className="logo-icon" />
          <span>Tic Tac Toe</span>
        </motion.div>
        
        <div className="nav-links">
          {navItems.map((item) => (
            <motion.div
              key={item.path}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link 
                to={item.path}
                className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
              >
                <item.icon className="nav-icon" />
                <span>{item.label}</span>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.button
          className="theme-toggle"
          onClick={() => setTheme(theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light')}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {theme === 'light' ? <Sun /> : theme === 'dark' ? <Moon /> : <Monitor />}
        </motion.button>
      </div>
    </motion.nav>
  );
};

const GameBoard = ({ gameState, onMove }: { gameState: GameState; onMove: (index: number) => void }) => {
  const renderSquare = (index: number) => {
    const isWinningSquare = gameState.winner && 
      [0, 1, 2, 3, 4, 5, 6, 7, 8].some(i => 
        gameState.board[i] === gameState.winner && 
        [index].includes(i)
      );

    return (
      <motion.button
        key={index}
        className={`square ${isWinningSquare ? 'winning' : ''}`}
        onClick={() => onMove(index)}
        disabled={gameState.board[index] !== null || gameState.winner !== null}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: index * 0.1 }}
      >
        <AnimatePresence>
          {gameState.board[index] && (
            <motion.div
              className={`player ${gameState.board[index]}`}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ duration: 0.3 }}
            >
              {gameState.board[index]}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    );
  };

  return (
    <motion.div 
      className="game-board"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="board-grid">
        {Array.from({ length: 9 }, (_, i) => renderSquare(i))}
      </div>
    </motion.div>
  );
};

const GamePage = () => {
  const { theme } = React.useContext(ThemeContext);
  const [gameState, setGameState] = useState<GameState>(() => 
    loadFromLocalStorage('gameState', {
      board: Array(9).fill(null),
      currentPlayer: 'X',
      winner: null,
      isDraw: false,
      gameMode: 'player',
      scores: { player: 0, computer: 0, draws: 0 }
    })
  );

  const [gameMode, setGameMode] = useState<'player' | 'computer'>('player');
  const [gameStartTime, setGameStartTime] = useState<number | null>(null);

  useEffect(() => {
    saveToLocalStorage('gameState', gameState);
  }, [gameState]);

  const handleMove = (index: number) => {
    if (gameState.board[index] || gameState.winner) return;

    const newBoard = [...gameState.board];
    newBoard[index] = gameState.currentPlayer;

    const winner = calculateWinner(newBoard);
    const isDraw = !winner && newBoard.every(cell => cell !== null);

    if (winner || isDraw) {
      const endTime = Date.now();
      const duration = gameStartTime ? endTime - gameStartTime : 0;
      
      // Save to history
      const history = loadFromLocalStorage('gameHistory', []);
      const newHistoryItem: GameHistory = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        winner: winner || 'Draw',
        gameMode: gameState.gameMode,
        duration
      };
      history.unshift(newHistoryItem);
      saveToLocalStorage('gameHistory', history.slice(0, 50)); // Keep last 50 games

      // Update scores
      const newScores = { ...gameState.scores };
      if (winner) {
        if (gameState.gameMode === 'computer') {
          newScores.computer += 1;
        } else {
          newScores.player += 1;
        }
      } else {
        newScores.draws += 1;
      }

      setGameState({
        ...gameState,
        board: newBoard,
        winner,
        isDraw,
        scores: newScores
      });
    } else {
      setGameState({
        ...gameState,
        board: newBoard,
        currentPlayer: gameState.currentPlayer === 'X' ? 'O' : 'X'
      });

      // Computer move
      if (gameState.gameMode === 'computer' && gameState.currentPlayer === 'X') {
        setTimeout(() => {
          const computerMove = getComputerMove(newBoard);
          if (computerMove !== undefined) {
            handleMove(computerMove);
          }
        }, 500);
      }
    }
  };

  const resetGame = () => {
    setGameState({
      ...gameState,
      board: Array(9).fill(null),
      currentPlayer: 'X',
      winner: null,
      isDraw: false,
      gameMode: gameMode
    });
    setGameStartTime(Date.now());
  };

  const resetScores = () => {
    setGameState({
      ...gameState,
      scores: { player: 0, computer: 0, draws: 0 }
    });
  };

  return (
    <motion.div 
      className="game-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div className="game-header">
        <h1>Tic Tac Toe</h1>
        <div className="game-mode-selector">
          <motion.button
            className={`mode-btn ${gameMode === 'player' ? 'active' : ''}`}
            onClick={() => setGameMode('player')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Player vs Player
          </motion.button>
          <motion.button
            className={`mode-btn ${gameMode === 'computer' ? 'active' : ''}`}
            onClick={() => setGameMode('computer')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Player vs Computer
          </motion.button>
        </div>
      </motion.div>

      <div className="game-info">
        <motion.div className="current-player" animate={{ scale: gameState.currentPlayer === 'X' ? 1.1 : 1 }}>
          Current Player: <span className={`player ${gameState.currentPlayer}`}>{gameState.currentPlayer}</span>
        </motion.div>
        
        {gameState.winner && (
          <motion.div 
            className="winner-message"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            Winner: <span className={`player ${gameState.winner}`}>{gameState.winner}</span>!
          </motion.div>
        )}
        
        {gameState.isDraw && (
          <motion.div 
            className="draw-message"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            It's a Draw!
          </motion.div>
        )}
      </div>

      <GameBoard gameState={gameState} onMove={handleMove} />

      <motion.div className="game-controls">
        <motion.button
          className="reset-btn"
          onClick={resetGame}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          New Game
        </motion.button>
        <motion.button
          className="reset-scores-btn"
          onClick={resetScores}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Reset Scores
        </motion.button>
      </motion.div>

      <motion.div className="scores" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="score-item">
          <span>Player X:</span>
          <span className="score">{gameState.scores.player}</span>
        </div>
        <div className="score-item">
          <span>Player O:</span>
          <span className="score">{gameState.scores.computer}</span>
        </div>
        <div className="score-item">
          <span>Draws:</span>
          <span className="score">{gameState.scores.draws}</span>
        </div>
      </motion.div>
    </motion.div>
  );
};

const HistoryPage = () => {
  const [history] = useState<GameHistory[]>(() => loadFromLocalStorage('gameHistory', []));

  return (
    <motion.div 
      className="history-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1>Game History</h1>
      
      {history.length === 0 ? (
        <motion.div 
          className="no-history"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <History className="no-history-icon" />
          <p>No games played yet</p>
        </motion.div>
      ) : (
        <motion.div className="history-list">
          {history.map((game, index) => (
            <motion.div
              key={game.id}
              className="history-item"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div className="history-date">
                {new Date(game.date).toLocaleDateString()}
              </div>
              <div className="history-winner">
                Winner: <span className={`player ${game.winner}`}>{game.winner}</span>
              </div>
              <div className="history-mode">
                Mode: {game.gameMode}
              </div>
              <div className="history-duration">
                Duration: {Math.round(game.duration / 1000)}s
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};

const SettingsPage = () => {
  const { theme, setTheme } = React.useContext(ThemeContext);

  return (
    <motion.div 
      className="settings-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1>Settings</h1>
      
      <motion.div className="settings-section">
        <h2>Theme</h2>
        <div className="theme-options">
          <motion.button
            className={`theme-option ${theme === 'light' ? 'active' : ''}`}
            onClick={() => setTheme('light')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Sun className="theme-icon" />
            <span>Light</span>
          </motion.button>
          
          <motion.button
            className={`theme-option ${theme === 'dark' ? 'active' : ''}`}
            onClick={() => setTheme('dark')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Moon className="theme-icon" />
            <span>Dark</span>
          </motion.button>
          
          <motion.button
            className={`theme-option ${theme === 'system' ? 'active' : ''}`}
            onClick={() => setTheme('system')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Monitor className="theme-icon" />
            <span>System</span>
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

const AboutPage = () => {
  return (
    <motion.div 
      className="about-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1>About</h1>
      
      <motion.div 
        className="about-content"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="about-section">
          <h2>Tic Tac Toe</h2>
          <p>A modern desktop application built with Tauri and React.</p>
        </div>
        
        <div className="about-section">
          <h3>Features</h3>
          <ul>
            <li>Player vs Player mode</li>
            <li>Player vs Computer mode</li>
            <li>Game history tracking</li>
            <li>Score persistence</li>
            <li>Theme customization</li>
            <li>Modern animations</li>
          </ul>
        </div>
        
        <div className="about-section">
          <h3>Developer</h3>
          <p>Developed by Eyuel Engida</p>
        </div>
        
        <div className="about-section">
          <h3>Last Updated</h3>
          <p>{new Date().toLocaleDateString()}</p>
        </div>
        
        <div className="about-section">
          <h3>Version</h3>
          <p>1.0.0</p>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Main App Component
function App() {
  const [theme, setTheme] = useState(() => loadFromLocalStorage('theme', 'system'));

  useEffect(() => {
    saveToLocalStorage('theme', theme);
    
    const applyTheme = () => {
      const root = document.documentElement;
      const actualTheme = theme === 'system' 
        ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
        : theme;
      
      root.setAttribute('data-theme', actualTheme);
    };

    applyTheme();
    
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addEventListener('change', applyTheme);
      return () => mediaQuery.removeEventListener('change', applyTheme);
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <Router>
        <div className="app">
          <Navigation />
          <main className="main-content">
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<GamePage />} />
                <Route path="/history" element={<HistoryPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/about" element={<AboutPage />} />
              </Routes>
            </AnimatePresence>
          </main>
        </div>
      </Router>
    </ThemeContext.Provider>
  );
}

export default App;
