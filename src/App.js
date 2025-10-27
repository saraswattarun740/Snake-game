import React, { useState, useEffect, useCallback } from "react";
import "./App.css";

const App = () => {
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [food, setFood] = useState({ x: 15, y: 15 });
  const [direction, setDirection] = useState("RIGHT");
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(
    Number(localStorage.getItem("highScore")) || 0
  );
  const [gameOver, setGameOver] = useState(false);
  const [level, setLevel] = useState("medium");
  const [speed, setSpeed] = useState(150);
  const [gameStarted, setGameStarted] = useState(false);

  // ✅ Adjust speed when level changes
  useEffect(() => {
    const levelSpeeds = { easy: 200, medium: 150, hard: 90 };
    setSpeed(levelSpeeds[level]);
  }, [level]);

  // ✅ Move Snake
  const moveSnake = useCallback(() => {
    setSnake((prevSnake) => {
      const newSnake = [...prevSnake];
      const head = { ...newSnake[0] };

      if (direction === "UP") head.y -= 1;
      else if (direction === "DOWN") head.y += 1;
      else if (direction === "LEFT") head.x -= 1;
      else if (direction === "RIGHT") head.x += 1;

      // Wall collision
      if (head.x < 0 || head.x >= 20 || head.y < 0 || head.y >= 20) {
        setGameOver(true);
        setGameStarted(false);
        return prevSnake;
      }

      // Self collision
      for (let segment of newSnake) {
        if (segment.x === head.x && segment.y === head.y) {
          setGameOver(true);
          setGameStarted(false);
          return prevSnake;
        }
      }

      newSnake.unshift(head);

      // Food eaten
      if (head.x === food.x && head.y === food.y) {
        setScore((prev) => prev + 10);
        setFood({
          x: Math.floor(Math.random() * 20),
          y: Math.floor(Math.random() * 20),
        });
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food]);

  // ✅ Auto movement only if started
  useEffect(() => {
    if (!gameStarted || gameOver) return;
    const interval = setInterval(moveSnake, speed);
    return () => clearInterval(interval);
  }, [moveSnake, speed, gameOver, gameStarted]);

  // ✅ Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowUp" && direction !== "DOWN") setDirection("UP");
      if (e.key === "ArrowDown" && direction !== "UP") setDirection("DOWN");
      if (e.key === "ArrowLeft" && direction !== "RIGHT") setDirection("LEFT");
      if (e.key === "ArrowRight" && direction !== "LEFT") setDirection("RIGHT");
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [direction]);

  // ✅ Restart Game
  const restartGame = () => {
    if (score > highScore) {
      localStorage.setItem("highScore", score);
      setHighScore(score);
    }
    setSnake([{ x: 10, y: 10 }]);
    setFood({ x: 15, y: 15 });
    setDirection("RIGHT");
    setScore(0);
    setGameOver(false);
    setGameStarted(false);
  };

  // ✅ Start Game
  const startGame = () => {
    setGameOver(false);
    setGameStarted(true);
  };

  // ✅ Manual button controls
  const handleButtonPress = (dir) => {
    if (dir === "UP" && direction !== "DOWN") setDirection("UP");
    if (dir === "DOWN" && direction !== "UP") setDirection("DOWN");
    if (dir === "LEFT" && direction !== "RIGHT") setDirection("LEFT");
    if (dir === "RIGHT" && direction !== "LEFT") setDirection("RIGHT");
  };

  return (
    <div className="snake-container">
      <h1>🐍 Snake Game</h1>

      {/* Level Selector */}
      <div className="level-buttons">
        {["easy", "medium", "hard"].map((lvl) => (
          <button
            key={lvl}
            className={level === lvl ? "active" : ""}
            onClick={() => setLevel(lvl)}
          >
            {lvl.charAt(0).toUpperCase() + lvl.slice(1)}
          </button>
        ))}
      </div>

      {/* Score */}
      <div className="scoreboard">
        <p>Score: {score}</p>
        <p>High: {highScore}</p>
      </div>

      {/* Game Board */}
      <div className="board">
        {Array.from({ length: 20 }).map((_, row) => (
          <div key={row} className="row">
            {Array.from({ length: 20 }).map((_, col) => {
              const isSnake = snake.some((s) => s.x === col && s.y === row);
              const isFood = food.x === col && food.y === row;
              return (
                <div
                  key={col}
                  className={`cell ${isSnake ? "snake" : ""} ${
                    isFood ? "food" : ""
                  }`}
                />
              );
            })}
          </div>
        ))}
      </div>

      {/* Start Button */}
      {!gameStarted && !gameOver && (
        <button className="start-btn" onClick={startGame}>
          ▶️ Start Game
        </button>
      )}

      {/* Arrow Controls */}
      <div className="controls">
        <button onClick={() => handleButtonPress("UP")}>⬆️</button>
        <div className="middle-buttons">
          <button onClick={() => handleButtonPress("LEFT")}>⬅️</button>
          <button onClick={() => handleButtonPress("DOWN")}>⬇️</button>
          <button onClick={() => handleButtonPress("RIGHT")}>➡️</button>
        </div>
      </div>

      {gameOver && (
        <div className="game-over">
          <h3>Game Over!</h3>
          <button onClick={restartGame}>Restart</button>
        </div>
      )}
    </div>
  );
};

export default App;
