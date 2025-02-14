import html2canvas from "html2canvas";
import { useGameContext } from "../contexts/GameStateContext";
import Download from "/src/assets/download_icon.svg?react";
import DownloadCompleted from "/src/assets/download_completed.svg?react";
import { useState } from "react";

function BottomControls() {
    const { setSpeed, handleReset, handleGamePlaying, gridRef, gameState } = useGameContext();

    const [downloadCompleted, setDownloadCompleted] = useState(false);
    function fnv1aHash(str) {
          let hash = 0x811c9dc5; // FNV-1a 32-bit offset basis
          for (let i = 0; i < str.length; i++) {
            hash ^= str.charCodeAt(i);
            hash = (hash * 0x01000193) >>> 0; // FNV-1a prime
          }
          return hash >>> 0; // Ensure unsigned 32-bit integer
        }
    
        function hashSetShort(set) {
          const sortedArray = Array.from(set).sort(); // Sort for consistency
          const stringified = JSON.stringify(sortedArray); // Convert to string
    
          // Generate a short 32-bit hash
          const hash = fnv1aHash(stringified);
    
          // Convert the number to Base64
          return btoa(String.fromCharCode(
            (hash >> 24) & 0xff,
            (hash >> 16) & 0xff,
            (hash >> 8) & 0xff,
            hash & 0xff
          )).replace(/=+$/, ''); // Trim padding
        }
    
    
        function handleDownload(){
          if (gridRef.current) {
            html2canvas(gridRef.current).then((canvas) => {
            const image = canvas.toDataURL("image/png");
            const link = document.createElement("a");
            const download_link = `Conway-${hashSetShort(gameState.toggledCells)}.png`
            link.href = image;
            link.download = download_link;
            link.click();
            setDownloadCompleted(true);
            setTimeout(() => {
                    setDownloadCompleted(false);
                }, 2500);
            })
    
          }
        }
    
    return (
        <div className={'flex gap-10 absolute bottom-5 left-1/2 -translate-x-1/2 -translate-y-1/2 '}>
            <div className='text-xl bg-[#222] p-4 text-[#e5e5e5] border-[#a1a1a1] border cursor-pointer' onClick={() => handleGamePlaying()}>
                <button className='cursor-pointer'>
                    {gameState.gamePlaying ? "Pause" : "Play"}
                </button>
            </div>
            <div className='text-xl bg-[#222] p-4 text-[#e5e5e5] border-[#a1a1a1] border cursor-pointer' onClick={() => handleReset()}>
                <button className='cursor-pointer' >
                    Reset
                </button>
            </div>

            <div className='flex text-xl bg-[#222] p-4 text-[#e5e5e5] border-[#a1a1a1] border cursor-pointer' title='Controls the duration of each generation'>
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
            <div className='text-xl bg-[#222] p-2 flex flex-col justify-center items-center h-16 w-16  text-[#e5e5e5] border-[#a1a1a1] border cursor-pointer' title='Save a picture of the current state'>
                <button className='cursor-pointer' onClick={() => handleDownload()}>
                    {!downloadCompleted ? <Download height="2rem" width="2rem" fill="#D4D4D4" /> : <DownloadCompleted height="2rem" width="2rem" />}
                </button>
            </div>
        </div>
    );
}


export default BottomControls;