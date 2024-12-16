import { useState } from "react";
import FIIDIIActivityChart from "./FiiDiichart"

export const FiiDii = () => {
    const [fiiData, setFiiData] = useState(1054.48); // Positive value for FII
    const [diiData, setDiiData] = useState(-244.75); // Negative value for DII
    return (
        <div className=" rounded-md bg-[#fff] dark:bg-[#1c1d1f]">
            <FIIDIIActivityChart fiiData={fiiData} diiData={diiData} isDarkMode={false}/>
        </div>
    )
}