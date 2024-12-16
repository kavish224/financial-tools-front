"use client"
import TradingViewWidget from "@/components/TradingViewWidget"




function Page  ()  {
    return (
        <div className=" bg-[#fff] h-80 flex justify-center rounded-md items-center dark:bg-[#1c1d1f]">
            <TradingViewWidget/>
        </div>
    )
}

export default Page;