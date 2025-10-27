import React, { useState, useEffect } from "react";
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
  const [level, setLevel] = useState("medium"); // ✅ New state
  const [speed, setSpeed] = useState(150); // ✅ Default medium speed

  useEffect(() => {
    const levelSpeeds = { easy: 200, medium: 150, hard: 100 };
    setSpeed(levelSpeeds[level]);
  }, [level]);

  useEffect(() => {
    if (gameOver) return;
    const interval = setInterval(moveSnake, speed);
    return () => clearInterval(interval);
  }, [snake, direction, gameOver, speed]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case "ArrowUp":
          if (direction !== "DOWN") setDirection("UP");
          break;
        case "ArrowDown":
          if (direction !== "UP") setDirection("DOWN");
          break;
        case "ArrowLeft":
          if (direction !== "RIGHT") setDirection("LEFT");
          break;
        case "ArrowRight":
          if (direction !== "LEFT") setDirection("RIGHT");
          break;
        default:
          break;
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [direction]);

  const moveSnake = () => {
    const newSnake = [...snake];
    const head = { ...newSnake[0] };

    if (direction === "UP") head.y -= 1;
    if (direction === "DOWN") head.y += 1;
    if (direction === "LEFT") head.x -= 1;
    if (direction === "RIGHT") head.x += 1;

    // Wall collision
    if (head.x < 0 || head.x >= 20 || head.y < 0 || head.y >= 20) {
      setGameOver(true);
      return;
    }

    // Self collision
    for (let segment of newSnake) {
      if (segment.x === head.x && segment.y === head.y) {
        setGameOver(true);
        return;
      }
    }

    newSnake.unshift(head);

    // Eating food
    if (head.x === food.x && head.y === food.y) {
      setScore(score + 10);
      const newFood = {
        x: Math.floor(Math.random() * 20),
        y: Math.floor(Math.random() * 20),
      };
      setFood(newFood);
    } else {
      newSnake.pop();
    }

    setSnake(newSnake);
  };

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
  };

  return (
    <div className="snake-container">
      <h1>🐍 Snake Game</h1>

      {/* ✅ Level Buttons */}
      <div className="level-buttons">
        <button
          className={level === "easy" ? "active" : ""}
          onClick={() => setLevel("easy")}
        >
          Easy
        </button>
        <button
          className={level === "medium" ? "active" : ""}
          onClick={() => setLevel("medium")}
        >
          Medium
        </button>
        <button
          className={level === "hard" ? "active" : ""}
          onClick={() => setLevel("hard")}
        >
          Hard
        </button>
      </div>

      <div className="scoreboard">
        <p>Score: {score}</p>
        <p>High: {highScore}</p>
      </div>

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
