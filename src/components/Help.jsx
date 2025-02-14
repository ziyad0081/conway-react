import { useGameContext } from '../contexts/GameStateContext';


function Help() {
    
    const {gameState, setHelp} = useGameContext();
    return (
        < div className={`fixed z-50 top-0 right-0 h-full w-1/3 bg-[#222] p-10 border-l border-[#d4d4d4] text-[#d4d4d4] transition-transform transform ${gameState.helpToggled ? 'translate-x-0' : 'translate-x-full'}`}>
          <button className='absolute top-5 right-5' onClick={() => setHelp(false)}>X</button>
          <h1 className='text-4xl mb-4' >Conway&apos;s Game of Life</h1>
          <p className='text-md'>
            Conway&apos;s Game of Life is a cellular automaton devised by the British mathematician John Horton Conway in 1970. It is a zero-player game, meaning that its evolution is determined by its initial state, requiring no further input. One interacts with the Game of Life by creating an initial configuration and observing how it evolves.
          </p>
          <a href="https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life" className='text-xl text-[#d4d4d4] underline' target="_blank" rel="noopener noreferrer">Read more on Wikipedia</a>
          <h1 className='text-4xl my-4'>Rules</h1>
          <p className='text-lg mb-2'>1. Any live cell with fewer than two live neighbours dies, as if by underpopulation.</p>
            <p className='text-lg mb-2'>2. Any live cell with two or three live neighbours lives on to the next generation.</p>
            <p className='text-lg mb-2'>3. Any live cell with more than three live neighbours dies, as if by overpopulation.</p>
            <p className='text-lg mb-2'>4. Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.</p>
        </div >
    );
}



export default Help;