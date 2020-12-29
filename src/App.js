import React, { useState, useEffect } from "react";

function App() {
  const [breakDuration, setBreakDuration] = useState(5);
  const [sessionDuration, setSessionDuration] = useState(25);
  const [time, setTime] = useState(1500);
  const [started, setStarted] = useState(false);
  const [timerType, setTimerType] = useState("Session");
  let audio = React.createRef();

  const reset = (e) => {
    setBreakDuration(5);
    setSessionDuration(25);
    setTime(1500);
    setStarted(false);
    setTimerType("Session");
    audio.current.pause();
    audio.current.currentTime = 0;
  };

  function incBreak() {
    if (breakDuration === 60) return;
    setBreakDuration(breakDuration + 1);
  }

  function decBreak() {
    if (breakDuration === 1) return;
    setBreakDuration(breakDuration - 1);
  }

  function incSession() {
    if (sessionDuration === 60) return;
    setSessionDuration(sessionDuration + 1);
    setTime((sessionDuration + 1) * 60);
  }

  function decSession() {
    if (sessionDuration === 1) return;
    setSessionDuration(sessionDuration - 1);
    setTime((sessionDuration - 1) * 60);
  }

  useEffect(() => {
    let intervalID;
    if (started) {
      intervalID = setInterval(() => {
        setTime(time - 1);
        console.log(time);
      }, 1000);
      if (time === 0) {
        audio.current.play();
        if (timerType === "Session") {
          setTime(breakDuration * 60);
          setTimerType("Break");
        } else {
          setTime(sessionDuration * 60);
          setTimerType("Session");
        }
      }
    } else {
      clearInterval(intervalID);
    }
    return () => clearInterval(intervalID);
  }, [started, time, breakDuration, timerType, sessionDuration, audio]);

  function computeTime() {
    let minutes = Math.floor(time / 60);
    let seconds = time - minutes * 60;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    return minutes + ":" + seconds;
  }

  return (
    <div>
      <TimerLengthControl
        nameID="break"
        title="Break Length"
        duration={breakDuration}
        increment={incBreak}
        decrement={decBreak}
      />
      <TimerLengthControl
        nameID="session"
        title="Session Length"
        duration={sessionDuration}
        increment={incSession}
        decrement={decSession}
      />

      <div id="timer-label">{timerType}</div>
      <div id="time-left">{computeTime()}</div>

      <button id="start_stop" onClick={() => setStarted(!started)}>
        Start/Stop
      </button>
      <button id="reset" onClick={reset}>
        Reset
      </button>
      <audio
        id="beep"
        preload="auto"
        ref={audio}
        src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"
      />
    </div>
  );
}

function TimerLengthControl(props) {
  return (
    <div className="TimerControl">
      <div id={props.nameID + "-label"}>{props.title}</div>
      <button id={props.nameID + "-increment"} onClick={props.increment}>
        up
      </button>
      <button id={props.nameID + "-decrement"} onClick={props.decrement}>
        down
      </button>
      <div id={props.nameID + "-length"}>{props.duration}</div>
    </div>
  );
}

export default App;
