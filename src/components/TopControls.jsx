import { useGameContext } from "../contexts/GameStateContext";


function TopControls(){
    
    const {gameState,setHelp} = useGameContext();
    return (
        <div className='absolute flex w-full pt-2 px-10 justify-between pointer-events-none'>

            <div className=' text-xl bg-[#222] p-3 text-[#e5e5e5] border-[#a1a1a1] border cursor-pointer'>
                <span>Generation: {gameState.currentGeneration}</span>
            </div>

            <div className=' text-[#d4d4d4] text-4xl bg-[#222] px-10 py-2 border border-[#a1a1a1]'>Conway&apos;s Game of life</div>

            <button className=' w-14 h-14 flex items-center justify-center rounded-full  text-[#d4d4d4] text-4xl bg-[#222] border-3 border-[#a1a1a1] pointer-events-auto cursor-pointer' onClick={() => setHelp(true)}>?</button>

        </div>
        
    );
}


export default TopControls;