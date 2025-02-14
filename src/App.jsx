import './App.css'
import Help from './components/Help';
import TopControls from './components/TopControls';
import { useGameContext } from './contexts/GameStateContext';
import BottomControls from './components/BottomControls';
import GameGrid from './components/GameGrid';
import useGridEvents from './utils/useGridEvents';


function App() {

  const { gameState} = useGameContext();

  useGridEvents();

  return (
    <div className='relative'>
      
      {gameState.controlsVisible && <BottomControls />}
      
      <Help/>

      {gameState.controlsVisible && <TopControls/>}

      <GameGrid/>
      
    </div>
  );
}

export default App
