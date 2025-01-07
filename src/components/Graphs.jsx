import React from 'react';
import { Gauge } from '@mui/x-charts/Gauge';

const Graphs = ({
    totalCalories,
    totalCarbs,
    totalFats,
    totalFiber,
    totalProtein,
    macroTargets,
    setYourState
}) => {
    const {
        targetCalories = 2000,
        proteinGrams = 160,
        fatsGrams = 70,
        carbsGrams = 250,
    } = macroTargets || {};

    const fiberMax = 30; // setuju vlakninu kvuli tomu ze to je ok amount

    const clampValue = (val, max) => Math.min(val, max);

    // kdyz to je vic nez max da to cerveny
    const ratioStyle = (val, max) => {
        if (val > max) return 'text-red-600 font-semibold';
        return 'text-black';
    };

    // pocitacka procent
    const calculatePercentage = (val, max) => {
        const percent = (val / max) * 100;
        return percent > 100 ? 100 : percent;
    };

    return (
        <div className="flex flex-col min-h-screen w-full bg-gradient-to-t from-pink-400 to-pink-100 bg-opacity-85 p-4 justify-center items-center gap-6 overflow-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-4xl">


                <div className="relative flex flex-col items-center bg-gray-100 p-4 rounded-lg shadow">
                    <p className="p-1 border-b-2 border-black mb-2">Kalorie (kcal)</p>
                    <Gauge
                        width={120}
                        height={120}
                        value={clampValue(totalCalories, targetCalories)}
                        valueMax={targetCalories}
                    />

                    <div className="absolute inset-0 top-1 flex items-center justify-center pointer-events-none">
                        <p className={`${ratioStyle(totalCalories, targetCalories)} text-xl font-bold bg-gray-100 w-[60px] text-center`}>
                            {`${Math.round((totalCalories / targetCalories) * 100)}%`}
                        </p>
                    </div>
                    <p className={`${ratioStyle(totalCalories, targetCalories)} mt-2`}>
                        {`${Math.round(totalCalories)} / ${Math.round(targetCalories)} kcal`}
                    </p>
                </div>



                <div className="relative flex flex-col items-center bg-gray-100 p-4 rounded-lg shadow">
                    <p className="p-1 border-b-2 border-black mb-2">Protein (g)</p>
                    <Gauge
                        width={120}
                        height={120}
                        value={clampValue(totalProtein, proteinGrams)}
                        valueMax={proteinGrams}
                    />

                    <div className="absolute inset-0 top-1 flex items-center justify-center pointer-events-none">
                        <p className={`${ratioStyle(totalProtein, proteinGrams)} text-xl font-bold bg-gray-100 w-[60px] text-center`}>
                            {`${Math.round((totalProtein / proteinGrams) * 100)}%`}
                        </p>
                    </div>
                    <p className={`${ratioStyle(totalProtein, proteinGrams)} mt-2`}>
                        {`${Math.round(totalProtein)} / ${Math.round(proteinGrams)} g`}
                    </p>
                </div>


                <div className="relative flex flex-col items-center bg-gray-100 p-4 rounded-lg shadow">
                    <p className="p-1 border-b-2 border-black mb-2">Tuky (g)</p>
                    <Gauge
                        width={120}
                        height={120}
                        value={clampValue(totalFats, fatsGrams)}
                        valueMax={fatsGrams}
                    />

                    <div className="absolute inset-0 top-1 flex items-center justify-center pointer-events-none">
                        <p className={`${ratioStyle(totalFats, fatsGrams)} text-xl font-bold bg-gray-100 w-[60px] text-center`}>
                            {`${Math.round((totalFats / fatsGrams) * 100)}%`}
                        </p>
                    </div>
                    <p className={`${ratioStyle(totalFats, fatsGrams)} mt-2`}>
                        {`${Math.round(totalFats)} / ${Math.round(fatsGrams)} g`}
                    </p>
                </div>


                <div className="relative flex flex-col items-center bg-gray-100 p-4 rounded-lg shadow">
                    <p className="p-1 border-b-2 border-black mb-2">Sacharidy (g)</p>
                    <Gauge
                        width={120}
                        height={120}
                        value={clampValue(totalCarbs, carbsGrams)}
                        valueMax={carbsGrams}
                    />

                    <div className="absolute inset-0 top-1 flex items-center justify-center pointer-events-none">
                        <p className={`${ratioStyle(totalCarbs, carbsGrams)} text-xl font-bold bg-gray-100 w-[60px] text-center`}>
                            {`${Math.round((totalCarbs / carbsGrams) * 100)}%`}
                        </p>
                    </div>
                    <p className={`${ratioStyle(totalCarbs, carbsGrams)} mt-2`}>
                        {`${Math.round(totalCarbs)} / ${Math.round(carbsGrams)} g`}
                    </p>
                </div>


                <div className="relative flex flex-col items-center bg-gray-100 p-4 rounded-lg shadow">
                    <p className="p-1 border-b-2 border-black mb-2">Vláknina (g)</p>
                    <Gauge
                        width={120}
                        height={120}
                        value={clampValue(totalFiber, fiberMax)}
                        valueMax={fiberMax}
                    />

                    <div className="absolute inset-0 top-1 flex items-center justify-center pointer-events-none">
                        <p className={`${ratioStyle(totalFiber, fiberMax)} text-xl font-bold bg-gray-100 w-[60px] text-center`}>
                            {`${Math.round((totalFiber / fiberMax) * 100)}%`}
                        </p>
                    </div>
                    <p className={`${ratioStyle(totalFiber, fiberMax)} mt-2`}>
                        {`${Math.round(totalFiber)} / ${fiberMax} g`}
                    </p>
                </div>
            </div>


            <button
                className="text-white p-2 mesh-gradient rounded-xl font-semibold w-[276px] mt-6"
                onClick={() => setYourState(prev => !prev)}
            >
                Odejít
            </button>
        </div>
    )

}

export default Graphs;
