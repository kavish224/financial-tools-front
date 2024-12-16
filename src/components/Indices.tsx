export const Indices = () => {
    return (
        <div className="p-2 rounded-md bg-[#fff] dark:bg-[#1c1d1f] h-60">
            <div className="grid grid-cols-4 gap-2 mb-2 font-bold text-sm">
                <h2 className="col-span-1">Indices</h2>
                <h3 className="col-span-1 text-center">Current</h3>
                <h3 className="col-span-1 text-center">Change</h3>
                <h3 className="col-span-1 text-center">%</h3>
            </div>
            <ul className="space-y-2">
                <li className="grid grid-cols-4 gap-2 text-sm">
                    <span>Nifty</span>
                    <span className="text-center">25,502.35</span>
                    <span className="text-center">+34.60</span>
                    <span className="text-center">0.14%</span>
                </li>
                <li className="grid grid-cols-4 gap-2 text-sm">
                    <span>Bank Nifty</span>
                    <span className="text-center">51,145.35</span>
                    <span className="text-center">+39.84</span>
                    <span className="text-center">0.09%</span>
                </li>
                <li className="grid grid-cols-4 gap-2 text-sm">
                    <span>Sensex</span>
                    <span className="text-center">81,785.55</span>
                    <span className="text-center">+78.40</span>
                    <span className="text-center">0.10%</span>
                </li>
                <li className="grid grid-cols-4 gap-2 text-sm">
                    <span>Gift Nifty</span>
                    <span className="text-center">25,520.00</span>
                    <span className="text-center">57.00</span>
                    <span className="text-center">0.20%</span>
                </li>
                <li className="grid grid-cols-4 gap-2 text-sm">
                    <span>Dow Jones</span>
                    <span className="text-center">41,250.51</span>
                    <span className="text-center">65.09</span>
                    <span className="text-center">0.15%</span>
                </li>
                <li className="grid grid-cols-4 gap-2 text-sm">
                    <span>Nasdaq</span>
                    <span className="text-center">19,581.52</span>
                    <span className="text-center">65.09</span>
                    <span className="text-center">0.33%</span>
                </li>
            </ul>
        </div>
    );
}
