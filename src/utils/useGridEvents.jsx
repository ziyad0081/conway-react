import { useEffect } from "react";
import { useGameContext } from "../contexts/GameStateContext";

const useGridEvents = () => {
    const { setGridSize, setMouse, resetToggledCells, setControlsVisible } = useGameContext();

    useEffect(() => {
        const updateGridSize = () => {
            const cellSize = 20;
            const rows = Math.floor(window.innerHeight / cellSize);
            const cols = Math.floor(window.innerWidth / cellSize);
            setGridSize(rows, cols);
            resetToggledCells();
        };

        updateGridSize();
        window.addEventListener("resize", updateGridSize);
        return () => window.removeEventListener("resize", updateGridSize);
    }, []);

    useEffect(() => {
        const handleMouseUpGlobal = () => {
            setMouse(false);
            setControlsVisible(true);
        };

        window.addEventListener("mouseup", handleMouseUpGlobal);
        return () => window.removeEventListener("mouseup", handleMouseUpGlobal);
    }, []);
};

export default useGridEvents;
