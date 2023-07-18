import React, { useState, useEffect } from 'react';

function TimerComponent({ setTime }) {
  const [running, setRunning] = useState(false);
  const [intervalId, setIntervalId] = useState(null);

  const start = () => {
    if (!running) {
      setRunning(true);
      const id = setInterval(() => {
        setTime(prevTime => prevTime + 1);
      }, 1000);
      setIntervalId(id);
    }
  };

  const stop = () => {
    if (running) {
      setRunning(false);
      clearInterval(intervalId);
      setIntervalId(null);
    }
  };

  const reset = () => {
    stop();
    setTime(0);
  };

  const toggleTimer = () => {
    if (running) {
      stop();
    } else {
      start();
    }
  };

  useEffect(() => {
    return () => {
      stop();
    };
  }, []);

  return (
    <div>
      <button onClick={toggleTimer}>{running ? 'Stop' : 'Start'} Timer</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}

export default TimerComponent;