import { useEffect } from "react";
import { useGameContext } from "../contexts/GameStateContext";

function GameGrid(){
    const { gameState, gridRef, setMouse, setHelp, updateToggledCells, setToggledCells, incrementGeneration ,setControlsVisible, resetGeneration } = useGameContext()

    function getLiveNeighboursCount(row, col) {
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
            if (r >= 0 && r < gameState.gridSize.rows && c >= 0 && c < gameState.gridSize.cols) {
                const cellIdx = r * gameState.gridSize.cols + c;
                // Check if the cell is toggled
                if (gameState.toggledCells.has(cellIdx)) {
                    count++;
                }
            }
        }
        return count;
    }
    

    function updateGame() {
        // Conway game of life 
        const newToggledCells = new Set();
        const cells = Array.from(gameState.toggledCells);
        const rows = gameState.gridSize.rows;
        const cols = gameState.gridSize.cols;
        for (let i = 0; i < cells.length; i++) {
            // Get cell index and project onto 2D grid (row , col)
            const cellIdx = cells[i];
            const row = Math.floor(cellIdx / cols);
            const col = cellIdx % cols;
            // Get live neighbours count
            const liveNeighbours = getLiveNeighboursCount(row, col);


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
                if (!gameState.toggledCells.has(cellIdx)) {
                    const liveNeighbours = getLiveNeighboursCount(row, col);
                    if (liveNeighbours === 3) {
                        newToggledCells.add(cellIdx);
                    }
                }
            }
        }


        setToggledCells(newToggledCells);
        incrementGeneration();
    }

    useEffect(() => {
        let interval;
        if (gameState.gamePlaying) {
            interval = setInterval(() => {
                updateGame();
            }, gameState.gameSpeed);
        }

        return () => {
            clearInterval(interval);
        };
    })

    const handleMouseDown = (index) => {
        setMouse(true);
        setControlsVisible(false);
        setHelp(false)
        updateToggledCells(index);
    };



    const handleMouseEnter = (index) => {
        if (gameState.isMouseDown) {
            resetGeneration();
            updateToggledCells(index);
        }
    };

    
    
    return(
        <div
            className="grid bg-[#222]"
            ref={gridRef}
            style={{
                display: "grid",
                gridTemplateColumns: `repeat(${gameState.gridSize.cols}, 1fr)`,
                gridTemplateRows: `repeat(${gameState.gridSize.rows}, 1fr)`,
                width: "100vw",
                height: "100vh",
            }}
        >
            {Array.from({ length: gameState.gridSize.rows * gameState.gridSize.cols }).map((_, index) => (
                <div
                    key={index}
                    onMouseDown={() => handleMouseDown(index)}
                    onMouseEnter={() => handleMouseEnter(index)}
                    className={"border h-[100%] w-[100%] transition-all ease-in border-[#404040] " + (gameState.toggledCells.has(index) ? "bg-[#d4d4d4]" : "")}
                />
            ))}
        </div>
    );

}


export default GameGrid;