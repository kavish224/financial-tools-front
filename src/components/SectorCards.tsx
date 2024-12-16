import HeatmapComponent from "./HeatMap"
import TradingViewWidget from "./TradingViewWidget"

export const SectorCards = () => {
    return (
        // <div className=" bg-[#fff] h-80 flex justify-center rounded-md items-center dark:bg-[#1c1d1f]">
        //     {/* <TradingViewWidget/> */}
        //     <HeatmapComponent/>
        // </div>
        <div className="w-full h-full">
            <div className="relative w-full h-[400px] sm:h-[460px]">
                <HeatmapComponent />
            </div>
        </div>
    )
}