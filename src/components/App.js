import React, { useState, useEffect } from 'react';
import utils from '../math-utils';
import StarsDisplay from './StarsDisplay';
import PlayNumber from './PlayNumber';
import PlayAgain from './PlayAgain';


// Introduce a custom hook to hold that will manage the states of the game
const useGameState = () => {
  const [stars, setStars] = useState(utils.random(1, 9));
  const [availableNums, setAvailableNums] = useState(utils.range(1, 9));
  const [candidateNums, setCandidateNums] = useState([]);

  const [secondsLeft, setSecondsLeft] = useState(10); // add seconds left state

  // Add secondsLeft side effect using setTimeout with useEffect method instead of setIntervale to learn more about react hooks

  useEffect(() => {
    // The effect itself run after the componenet got rendred
    // invoke the function if the secondsLeft > 0
    if (secondsLeft > 0 && availableNums.length > 0) {
      const timerId = setTimeout(() => {
        setSecondsLeft(secondsLeft - 1);
      }, 1000);
      // clear the Timout after each change (the component is about rerendring) on the component to avoid create the setTimout on every state change even once not needed this can be done using return statement which can invoke a function => it is a mecanism of use Effect hook
      return () => clearTimeout(timerId);
    }
  });

  // hold the set states in same place too
  const setGameState = (newCandidateNums) => {
    if (utils.sum(newCandidateNums) !== stars) {
      setCandidateNums(newCandidateNums);
    } else {
      const newAvailableNums = availableNums.filter(
        (n) => !newCandidateNums.includes(n)
      );
      setStars(utils.randomSumIn(newAvailableNums, 9));
      setAvailableNums(newAvailableNums);
      setCandidateNums([]);
    }
  };
  return { stars, availableNums, candidateNums, secondsLeft, setGameState };
};

// v1 STAR MATCH - Starting Template

const Game = (props) => {
  const {
    stars,
    availableNums,
    candidateNums,
    secondsLeft,
    setGameState,
  } = useGameState();

  const candidatesAreWrong = utils.sum(candidateNums) > stars; // Cehcek if the candidates are wrong

  // const gameIsDone = availableNums.length === 0; // check if the game is done or not => no more needed we can use gameStatus instead

  // check the game status after seconds left is 0
  const gameStatus =
    availableNums.length === 0 ? 'won' : secondsLeft === 0 ? 'lost' : 'active';

  // Reset the game one the game is done => no need anymore after using the logic of key elemnt and unmounting see StartMatch component
  // const resetGame = () => {
  //   setStars(utils.random(1,9));
  //   setAvailableNums(utils.range(1,9));
  //   setCandidateNums([]);
  // }

  const numberStatus = (number) => {
    if (!availableNums.includes(number)) {
      return 'used';
    }
    if (candidateNums.includes(number)) {
      return candidatesAreWrong ? 'wrong' : 'candidate';
    }
    return 'available';
  };
  const onNumberClick = (number, currentStatus) => {
    if (gameStatus !== 'active' || currentStatus === 'used') {
      return;
    }
    const newCandidateNums =
      currentStatus === 'available'
        ? candidateNums.concat(number)
        : candidateNums.filter((cn) => cn !== number);

    setGameState(newCandidateNums);
  };

  return (
    <div className="game">
      <div className="help">
        Pick 1 or more numbers that sum to the number of stars
      </div>
      <div className="body">
        <div className="left">
          {gameStatus !== 'active' ? (
            <PlayAgain onClick={props.startNewGame} gameStatus={gameStatus} />
          ) : (
            <StarsDisplay count={stars}></StarsDisplay>
          )}
        </div>
        <div className="right">
          {utils.range(1, 9).map((number) => (
            <PlayNumber
              key={number}
              status={numberStatus(number)}
              number={number}
              onClick={onNumberClick}
            ></PlayNumber>
          ))}
        </div>
      </div>
      <div className="timer">Time Remaining: {secondsLeft}</div>
    </div>
  );
};

// Create the StartMatch Game componenet which will hold the logic of the start game
const StarMatch = () => {
  const [gameId, setGameId] = useState(1);
  return <Game key={gameId} startNewGame={() => setGameId(gameId + 1)} />;
};



export default function App() {
  return (
    <div>
      <StarMatch></StarMatch>
    </div>
  );
}
