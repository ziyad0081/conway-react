import { createContext, useContext, useRef, useState } from "react";
import propTypes from "prop-types";
// Create the context
const GameContext = createContext();

// Create a custom hook to use the GameContext
export const useGameContext = () => useContext(GameContext);

// Create the provider component
export const GameProvider = ({ children }) => {
    const gridRef = useRef(null);
    const [gameState, setGameState] = useState({
        gridSize: { rows: 20, cols: 20 },
        gamePlaying: false,
        toggledCells: new Set(),
        controlsVisible: true,
        currentGeneration: 0,
        gameSpeed: 200,
        helpToggled: false,
        isMouseDown: false,
    });
    const handleReset = () => {
        setGameState(prevState => ({
            ...prevState,
            currentGeneration: 0,
            toggledCells: new Set()
        }));
    };

    // Function to toggle the help menu
    const handleToggleHelp = () => {
        setGameState(prevState => ({
            ...prevState,
            helpToggled: !prevState.helpToggled
        }));
    };

    // Function to toggle game playing and reset help toggle
    const handleGamePlaying = () => {
        setGameState(prevState => ({
            ...prevState,
            gamePlaying: !prevState.gamePlaying,
            helpToggled: false // Close the help menu when the game starts or pauses
        }));
    };


    // Update a specific part of the state
    const setGridSize = (n_rows, n_cols) => {
        setGameState(prevState => ({ ...prevState, gridSize: {rows : n_rows, cols : n_cols } }));
    };

    const resetToggledCells = () => {
        setGameState(prevState => ({ ...prevState, toggledCells: new Set() }));
    }


    const toggleGamePlaying = () => {
        setGameState(prevState => ({ ...prevState, gamePlaying: !prevState.gamePlaying }));
    };

    const setHelp = (state) => {
        setGameState(prevState => ({ ...prevState, helpToggled: state }));
    };
    const updateToggledCells = (index) => {
        setGameState(prevState => {
            const newToggledCells = new Set(prevState.toggledCells);
            if (newToggledCells.has(index)) {
                newToggledCells.delete(index);
            } else {
                newToggledCells.add(index);
            }
            return { ...prevState, toggledCells: newToggledCells };
        });
    };

    const setToggledCells = (newToggledCells) => {
        setGameState(prevState => ({ ...prevState, toggledCells: newToggledCells }));
    };


    const setControlsVisible = (state) => {
        setGameState(prevState => ({ ...prevState, controlsVisible: state }));
    };

    const incrementGeneration = () => {
        setGameState(prevState => ({ ...prevState, currentGeneration: prevState.currentGeneration + 1 }));
    };

    const resetGeneration = () => {
        setGameState(prevState => ({ ...prevState, currentGeneration: 0 }));
    }

    const setSpeed = (speed) => {
        setGameState(prevState => ({ ...prevState, gameSpeed: speed }));
    };

    const setMouse = (state) => {
        setGameState(prevState => ({ ...prevState, isMouseDown: state }));
    };

    return (
        <GameContext.Provider value={{ gameState, setGridSize, toggleGamePlaying, setHelp, setControlsVisible, incrementGeneration, setSpeed, setMouse, handleReset, handleToggleHelp, handleGamePlaying, gridRef, updateToggledCells, resetGeneration, resetToggledCells, setToggledCells }}>
            {children}
        </GameContext.Provider>
    );
};
GameProvider.propTypes = {
    children: propTypes.node.isRequired,
};