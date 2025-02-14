import './App.css'
import { useState, useEffect, useRef } from "react";


function App() {

  
    const [gridSize, setGridSize] = useState({ rows: 20, cols: 20 });
    const [gamePlaying, setGamePlaying] = useState(false);
    const [toggledCells, setToggledCells] = useState(new Set());
    const [controlsVisible, setControlsVisible] = useState(true);
    const [currentGeneration, setCurrentGeneration] = useState(0);
    const [gameSpeed, setSpeed] = useState(200);
    const [helpToggled , setHelpToggled] = useState(false);
    const gridRef = useRef(null); 
    const [isMouseDown, setIsMouseDown] = useState(false);

    const handleMouseDown = (index) => {
      setIsMouseDown(true);
      setControlsVisible(false);
      setHelpToggled(false)
      updateToggledCells(index);
    };

    

    const handleMouseEnter = (index) => {
      if (isMouseDown) {
        setCurrentGeneration(0);
        updateToggledCells(index);
      }
    };

    const handleReset = () => {
      setCurrentGeneration(0);
      setToggledCells(new Set());
    };

    function handleToggleHelp(){
      setHelpToggled(!helpToggled);
    }
    function handleGamePlaying(){
      setGamePlaying(!gamePlaying);
      setHelpToggled(false);
    }

    function updateToggledCells(cellIdx) {
      setToggledCells((prev)=>{
        const cells = new Set(prev);
        if(cells.has(cellIdx)){
          cells.delete(cellIdx)
        }
        else{
          cells.add(cellIdx)
        }
        return cells;
      })
    }

    useEffect(() => {
      
      const updateGridSize = () => {
        const cellSize = 20; 
        const rows = Math.floor(window.innerHeight / cellSize);
        const cols = Math.floor(window.innerWidth / cellSize);
        setGridSize({ rows, cols });
        setToggledCells(new Set());

      };

      updateGridSize();
      window.addEventListener("resize", updateGridSize);
      return () => window.removeEventListener("resize", updateGridSize);
    }, []);

    useEffect(() => {
      // Prevent mouse dragging issues
      const handleMouseUpGlobal = () => { setIsMouseDown(false); setControlsVisible(true)};
      window.addEventListener("mouseup", handleMouseUpGlobal);
      return () => window.removeEventListener("mouseup", handleMouseUpGlobal);
    }, []);

    function getLiveNeighboursCount(row, col){
      // All possible 8 neighbours
      const neighbours = [

        [row - 1, col - 1],
        [row - 1, col],
        [row - 1, col + 1],
        [row, col - 1],
        [row, col + 1],
        [row + 1, col - 1],
        [row + 1, col],
        [row + 1, col + 1],
      ];
      let count = 0;
      for (let i = 0; i < neighbours.length; i++) {
        const [r, c] = neighbours[i];

        // boundary check
        if (r >= 0 && r < gridSize.rows && c >= 0 && c < gridSize.cols) {
          const cellIdx = r * gridSize.cols + c;
          // Check if the cell is toggled
          if (toggledCells.has(cellIdx)) {
            count++;
          }
        }
      }
      return count;
    }
    function updateGame(){
      // Conway game of life 
      const newToggledCells = new Set();
      const cells = Array.from(toggledCells);
      const rows = gridSize.rows;
      const cols = gridSize.cols;
      for (let i = 0; i < cells.length; i++) {
        // Get cell index and project onto 2D grid (row , col)
        const cellIdx = cells[i];
        const row = Math.floor(cellIdx / cols);
        const col = cellIdx % cols;
        // Get live neighbours count
        const liveNeighbours = getLiveNeighboursCount(row, col);
        console.log(liveNeighbours, "liveee");
        
        // If the cell has 2 or 3 live neighbours, it stays alive
        if (liveNeighbours === 2 || liveNeighbours === 3) {
          newToggledCells.add(cellIdx);
        }

        // if it has more than that , it dies from overpopulation, or less than that, it dies from underpopulation
      }
      // if a dead cell has 3 neighbours, it becomes alive
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const cellIdx = row * cols + col;
          if (!toggledCells.has(cellIdx)) {
            const liveNeighbours = getLiveNeighboursCount(row, col);
            if (liveNeighbours === 3) {
              newToggledCells.add(cellIdx);
            }
          }
        }
      }
      
      
      setToggledCells(newToggledCells);
      setCurrentGeneration(currentGeneration+1);
    }
    useEffect(() => {
      let interval ;
      if(gamePlaying){
        interval = setInterval(() => {
          updateGame();
        }, gameSpeed);
      }

      return () => {
        clearInterval(interval);
      };
    })

    




    return (
      <div className='relative'>
        {controlsVisible &&
        <div className={'flex gap-10 absolute bottom-5 left-1/2 -translate-x-1/2 -translate-y-1/2 '}>
          <div className='text-xl bg-[#222] p-4 text-neutral-200 border-neutral-400 border cursor-pointer'>
          <button className='cursor-pointer' onClick={() => handleGamePlaying()}>
            {gamePlaying ? "Pause" : "Play"}
          </button>
          </div>
          <div className='text-xl bg-[#222] p-4 text-neutral-200 border-neutral-400 border cursor-pointer'>
          <button className='cursor-pointer' onClick={() => handleReset()}>
            Reset
          </button>
          </div>
            <div className='flex text-xl bg-[#222] p-4 text-neutral-200 border-neutral-400 border cursor-pointer'>
              <label className='cursor-pointer'>
                Delay:
              </label>
              <input
                type="range"
                min="50"
                max="1000"
                step="50"
                defaultValue="200"
                onChange={(e) => setSpeed(Number(e.target.value))}
                className='ml-2'
              />
            </div>
          </div>
        }

        

        

        {
          <div className={`fixed z-50 top-0 right-0 h-full w-1/3 bg-[#222] p-10 border-l border-neutral-300 text-neutral-300 transition-transform transform ${helpToggled ? 'translate-x-0' : 'translate-x-full'}`}>
          <button className='absolute top-5 right-5' onClick={() => handleToggleHelp()}>X</button>
          <h1 className='text-4xl'>Conway&apos;s Game of Life</h1>
          <p className='text-xl'>
            Conway&apos;s Game of Life is a cellular automaton devised by the British mathematician John Horton Conway in 1970. It is a zero-player game, meaning that its evolution is determined by its initial state, requiring no further input. One interacts with the Game of Life by creating an initial configuration and observing how it evolves.
          </p>
          <a href="https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life" className='text-xl text-blue-500' target="_blank" rel="noopener noreferrer">Read more on Wikipedia</a>
          <h1 className='text-4xl'>Rules</h1>
          <p className='text-xl'>1. Any live cell with fewer than two live neighbours dies, as if by underpopulation.</p>
          <p className='text-xl'>2. Any live cell with two or three live neighbours lives on to the next generation.</p>
          <p className='text-xl'>3. Any live cell with more than three live neighbours dies, as if by overpopulation.</p>
          <p className='text-xl'>4. Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.</p>
        </div>
        }

        {controlsVisible && <div className='absolute flex w-full pt-2 px-10 justify-between pointer-events-none'>
          
          <div className=' text-xl bg-[#222] p-3 text-neutral-200 border-neutral-400 border cursor-pointer'>
            <span>Generation: {currentGeneration}</span>
          </div>
          
          <div className=' text-neutral-300 text-4xl bg-[#222] px-10 py-2 border border-neutral-400'>Conway&apos;s Game of life</div>

          <button className=' w-14 h-14 flex items-center justify-center rounded-full  text-neutral-300 text-4xl bg-[#222] border-3 border-neutral-400 cursor-pointer' onClick={() => handleToggleHelp()}>?</button>
          
        </div>
        }



          <div
            className="grid"
            ref={gridRef}
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${gridSize.cols}, 1fr)`,
              gridTemplateRows: `repeat(${gridSize.rows}, 1fr)`,
              width: "100vw",
              height: "100vh",
            }}
          >
            {Array.from({ length: gridSize.rows * gridSize.cols }).map((_, index) => (
              <div
                key={index}
                onMouseDown={() => handleMouseDown(index)}
                onMouseEnter={() => handleMouseEnter(index)}
                className={"border h-[100%] w-[100%] transition-all ease-in border-neutral-700 " + (toggledCells.has(index) ? "bg-neutral-300" : "")}
              />
            ))}
          </div>
        </div>
    );
  }

export default App
