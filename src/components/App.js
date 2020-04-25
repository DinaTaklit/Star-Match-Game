import React, { useState } from 'react';
import Game from './Game'


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
