import React, { useRef, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { ExclamationMark, Trash, Question } from "@phosphor-icons/react";
import { useNavigate } from "react-router-dom";
import Stack from '@mui/material/Stack';
import { Gauge } from '@mui/x-charts/Gauge';
import Navbar from "../components/Navbar";
import Graphs from "../components/Graphs";

const DashBoard = () => {
    const foodRef = useRef(null);
    const gramRef = useRef(null);
    const navigate = useNavigate();
    const { currentUser } = useSelector((state) => state.user);
    const userID = currentUser._id;
    const [loading, setLoading] = useState(false);
    const [meals, setMeals] = useState([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedMealID, setSelectedMealID] = useState(null);
    const [totalCalories, setTotalCalories] = useState(0);
    const [totalProtein, setTotalProtein] = useState(0);
    const [totalFats, setTotalFats] = useState(0);
    const [totalCarbs, setTotalCarbs] = useState(0);
    const [totalFiber, setTotalFiber] = useState(0);
    const [graphs, setGraphs] = useState(false);
    const [under640, setUnder640] = useState(false);
    const [selectedMeal, setSelectedMeal] = useState(null);
    const [macroTargets, setMacroTargets] = useState(null);

    useEffect(() => {
        if(!currentUser?.gender || !currentUser?.age || !currentUser?.height || !currentUser?.weight || !currentUser?.goal || !currentUser?.goalWeight) {
            
            navigate("/getinfo")
            toast.error("Nevyplnil jsi všechno info o sobě.", {toastId: "notAllInfo"})
        }
    }, [])



    const weight = currentUser?.weight;
    const height = currentUser?.height;
    const goal = currentUser?.goal; 
    const goalWeight = currentUser?.goalWeight;
    const age = currentUser?.age; 
    const gender = currentUser?.gender;

    const calculateMacroTargets = () => {
        if (!weight || !height || !goal) {
            return;
        }

        const PROTEIN_PERCENTAGE = 0.30;
        const FATS_PERCENTAGE = 0.25;
        const CARBS_PERCENTAGE = 0.45;

        // pocita se tady bmr kvuli kaloriim
        let BMR;
        if (gender === 'male') {
            BMR = 10 * weight + 6.25 * height - 5 * age + 5;
        } else if (gender === 'female') {
            BMR = 10 * weight + 6.25 * height - 5 * age - 161;
        } else {
            BMR = 10 * weight + 6.25 * height - 5 * age + 5;
        }

        const ACTIVITY_MULTIPLIER = 1.55;
        const TDEE = BMR * ACTIVITY_MULTIPLIER;

        let targetCalories;
        switch (goal.toLowerCase()) {
            case 'cut':
                targetCalories = TDEE - 500; // cut
                break;
            case 'maintain':
                targetCalories = TDEE;
                break;
            case 'bulk':
                targetCalories = TDEE + 500; // bulk
                break;
            default:
                targetCalories = TDEE;
        }

        const proteinCalories = targetCalories * PROTEIN_PERCENTAGE;
        const fatsCalories = targetCalories * FATS_PERCENTAGE;
        const carbsCalories = targetCalories * CARBS_PERCENTAGE;

        const proteinGrams = Math.round(proteinCalories / 4);
        const fatsGrams = Math.round(fatsCalories / 9);
        const carbsGrams = Math.round(carbsCalories / 4);

        return {
            targetCalories,
            proteinGrams,
            fatsGrams,
            carbsGrams,
        };
    };

    useEffect(() => {
        const targets = calculateMacroTargets();
        if (targets) {
            setMacroTargets(targets);
        }
    }, [weight, height, goal, age, gender]);

    const calculateTotals = () => {
        const totals = meals.reduce(
            (acc, meal) => {
                acc.calories += meal.calories || 0;
                acc.protein += meal.protein_g || 0;
                acc.fats += meal.fat_total_g || 0;
                acc.carbs += meal.carbohydrates_total_g || 0;
                acc.fiber += meal.fiber_g || 0;
                return acc;
            },
            { calories: 0, protein: 0, fats: 0, carbs: 0, fiber: 0 }
        );

        setTotalCalories(totals.calories);
        setTotalProtein(totals.protein);
        setTotalFats(totals.fats);
        setTotalCarbs(totals.carbs);
        setTotalFiber(totals.fiber);
    };

    const openDeleteConfirmation = (mealID) => {
        setSelectedMealID(mealID);
        setShowDeleteModal(true);
    };

    const closeDeleteConfirmation = () => {
        setSelectedMealID(null);
        setShowDeleteModal(false);
    };

    const confirmDelete = async () => {
        if (!selectedMealID) {
            toast.error("Nebylo vybráno žádné jídlo ke smazaní");
            return;
        }

        try {
            const response = await fetch(`/api/meals/${selectedMealID}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ userID }), 
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to delete meal.");
            }

            toast.success("Jídlo úspěšně vymazáno!");
            fetchMeals();
        } catch (error) {
            toast.error(error.message);
        } finally {
            closeDeleteConfirmation();
        }
    };


    // se to tady ukalada
    const saveMeal = async (mealData) => {
        try {
            const response = await fetch("/api/meals/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...mealData,
                    userID,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to save meal.");
            }

            return data;
        } catch (error) {
            throw new Error(error.message || "An error occurred while saving the meal.");
        }
    };

    // fetchhovaci funkce na jidla aby tam byli
    const fetchMeals = async () => {
        try {
            const response = await fetch(`/api/meals/${userID}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to fetch meals.");
            }

            setMeals(data);
        } catch (error) {
            toast.error(error.message);
        }
    };

    useEffect(() => {
        fetchMeals();
    }, []);

    useEffect(() => {
        calculateTotals();
    }, [meals]);

    const submitFunction = async (e) => {
        e.preventDefault();

        const food = foodRef.current.value.trim();
        const grams = gramRef.current.value.trim();

        if (!food) {
            toast.error("Prosíme zadejte jídlo.");
            return;
        }

        if (!grams) {
            toast.error("Zadejte váhu v gramech (g)");
            return;
        }

        if (isNaN(grams) || Number(grams) <= 0) {
            toast.error("Zadejte gramáž jako číslo");
            return;
        }

        setLoading(true);

        try {
            const apiKey = import.meta.env.VITE_CALORIES_API;

            if (!apiKey) {
                throw new Error("API key is not defined. Please set VITE_CALORIES_API in your .env file.");
            }

            const query = `${grams} grams ${food}`;

            const apiUrl = `https://api.calorieninjas.com/v1/nutrition?query=${encodeURIComponent(query)}`;

            const response = await fetch(apiUrl, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "X-Api-Key": apiKey,
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to fetch data from CalorieNinja.");
            }

            const data = await response.json();

            if (data && data.items && data.items.length > 0) {
                toast.success("Úspěšne jsme navázali spojení s databází😉");
                foodRef.current.value = "";
                gramRef.current.value = "";

                const mealData = data.items.map((item) => ({
                    name: item.name,
                    serving_size_g: item.serving_size_g,
                    calories: item.calories,
                    protein_g: item.protein_g,
                    carbohydrates_total_g: item.carbohydrates_total_g,
                    fat_total_g: item.fat_total_g,
                    fiber_g: item.fiber_g,
                }));

                const savePromises = mealData.map((meal) => saveMeal(meal));
                await Promise.all(savePromises);
                toast.success("Jídlo bylo úspěšně zapsáno!");
                fetchMeals();
            } else {
                throw new Error("No data found for the given input.");
            }
        } catch (err) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 640) {
                setUnder640(true);
                console.log("Screen width is under 640px");
            } else {
                setUnder640(false);
                console.log("Screen width is 640px or above");
            }
        };

        handleResize();

        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    console.log(meals);
    return (
        <div className="min-h-screen w-full overflow-x-hidden bg-gradient-to-t from-pink-400 to-pink-100">
            <Navbar />
            <div className={`w-full h-full flex md:flex-row flex-col items-center justify-center overflow-x-hidden  ${ graphs ? "" : "pt-[15vh]" }`}>
                {graphs ? (
                    <Graphs
                        totalCalories={totalCalories}
                        totalCarbs={totalCarbs}
                        totalFats={totalFats}
                        totalFiber={totalFiber}
                        totalProtein={totalProtein}
                        macroTargets={macroTargets}
                        setYourState={setGraphs}
                    />
                ) : (
                    <div className="w-full max-w-2xl overflow-x-hidden p-6 rounded-lg shadow-lg bg-black bg-opacity-60 flex flex-col items-center">
                        <div className="flex justify-between items-center mb-4 w-full">
                            <h2 className="text-2xl font-bold bg-clip-text bg-gradient-to-r from-indigo-300 to-pink-300 text-transparent">
                                Kalkulacka Kalorii - Pis Anglicky kvuli API
                            </h2>
                            <button
                                type="button"
                                className="text-white p-2 mesh-gradient rounded-xl font-semibold"
                                onClick={() => setGraphs(true)} 
                            >
                                Otevřít grafy
                            </button>
                        </div>
                        <form onSubmit={submitFunction} className="flex flex-col w-full gap-y-3">
                            <input
                                ref={foodRef}
                                type="text"
                                placeholder="Food"
                                className="p-2 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
                                disabled={loading}
                            />
                            <input
                                ref={gramRef}
                                type="number"
                                placeholder="Grams"
                                className="p-2 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
                                min="1"
                                disabled={loading}
                            />
                            <button
                                type="submit"
                                className="p-4 disabled:opacity-50 mesh-gradient rounded-xl transition-colors duration-300"
                                disabled={loading}
                            >
                                {loading ? "Počítam🧐" : (
                                    <div className="flex justify-center items-center font-bold">
                                        Spočítej
                                        <ExclamationMark size={24} weight="bold" color="black" />
                                    </div>
                                )}
                            </button>
                        </form>

                        {meals.length > 0 && (
                            <div className="mt-6 w-full bg-white bg-opacity-60 p-4 rounded-xl shadow">
                                <h3 className="text-xl font-semibold mb-3">Tvá jídla</h3>

                                <div>
                                    {meals.map((meal) => (
                                        <div key={meal._id} className="bg-[#f0f0f0] p-6 relative border-2 border-[--llgr] border-b-0 last:rounded-b-xl last:border-b-2 first:rounded-t-xl">
                                            <p className="text-xl flex justify-between sm:items-center items-end sm:flex flex-col">
                                                🔥 Nutrition - {meal.name} of {meal.serving_size_g}g
                                                {under640 ? (
                                                    <Question
                                                        size={24}
                                                        weight="bold"
                                                        color="#000"
                                                        className="cursor-pointer"
                                                        onClick={() => setSelectedMeal(meal)}
                                                    />
                                                ) : (
                                                    <p className="text-lg">{meal.calories}kcal</p>
                                                )}
                                            </p>
                                            <div className="flex justify-between items-center mt-2">
                                                {!under640 && (
                                                    <ul>
                                                        <li>Calories: {meal.calories} Kcal 👀</li>
                                                        <li>Protein: {meal.protein_g} g 💪</li>
                                                        <li>Fats: {meal.fat_total_g} g 🍕</li>
                                                        <li>Fiber: {meal.fiber_g} g 🥬</li>
                                                        <li>Carbohydrates: {meal.carbohydrates_total_g} g 🍬</li>
                                                    </ul>
                                                )}

                                                <div className={`flex ${under640 && ("justify-between w-full")}`}>
                                                    {!under640 ? (
                                                        <p>Time: {new Date(meal.createdAt).toLocaleString()} 🕛</p>
                                                    ) : (
                                                        <p className="text-lg">{meal.calories}kcal</p>
                                                    )}
                                                    <button className="cursor-pointer"
                                                        onClick={() => openDeleteConfirmation(meal._id)}
                                                    >
                                                        <Trash
                                                            size={24}
                                                            color="red"
                                                            weight="bold"
                                                        />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {showDeleteModal && (
                            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                                <div className="bg-white p-4 rounded-xl shadow-lg w-11/12 max-w-md">
                                    <h2 className="text-xl font-bold mb-4">Potvrďte smazaní</h2>
                                    <p>Opravdu chcete jídlo smazat?</p>
                                    <div className="mt-6 flex justify-end gap-4">
                                        <button
                                            onClick={confirmDelete}
                                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                                        >
                                            Ano, smazat
                                        </button>
                                        <button
                                            onClick={closeDeleteConfirmation}
                                            className="px-4 py-2 bg-gray-300 text-black rounded-lg hover:bg-gray-400 transition-colors"
                                        >
                                            Ne
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {selectedMeal && (
                            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                                <div className="bg-white p-5 rounded-xl shadow-lg w-11/12 max-w-md">
                                    <h2 className="text-xl font-bold mb-2">Nutrition Details</h2>
                                    <ul className="mb-4">
                                        <li>Calories: {selectedMeal.calories} Kcal 👀</li>
                                        <li>Protein: {selectedMeal.protein_g} g 💪</li>
                                        <li>Fats: {selectedMeal.fat_total_g} g 🍕</li>
                                        <li>Fiber: {selectedMeal.fiber_g} g 🥬</li>
                                        <li>Carbohydrates: {selectedMeal.carbohydrates_total_g} g 🍬</li>
                                        <li className="flex">
                                            <p>Time: {new Date(selectedMeal.createdAt).toLocaleString()} 🕛</p>
                                        </li>
                                    </ul>
                                    <div className="flex justify-end gap-4">
                                        <button
                                            onClick={() => setSelectedMeal(null)}
                                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                                        >
                                            Close
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DashBoard;
