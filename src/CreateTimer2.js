import React, { useState, useEffect, useRef } from 'react';

function CreateTimer2() {
  const [time, setTime] = useState(0);
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

  const getTimeElapsed = () => {
    return time;
  }

  useEffect(() => {
    return () => {
      stop();
    };
  }, []);


}

export default CreateTimer2;