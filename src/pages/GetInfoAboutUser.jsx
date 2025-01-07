import React, { useState } from 'react';
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from 'react-redux';
import {
    updateUserFailure,
    updateUserStart,
    updateUserSuccess
} from '../../redux/user/userSlice';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';

const GetInfoAboutUser = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const { currentUser } = useSelector((state) => state.user);

    const [age, setAge] = useState(currentUser?.age || "");
    const [gender, setGender] = useState(currentUser?.gender || "");
    const [height, setHeight] = useState(currentUser?.height || "");
    const [weight, setWeight] = useState(currentUser?.weight || "");
    const [goal, setGoal] = useState(currentUser?.goal || "");
    const [goalWeight, setGoalWeight] = useState(currentUser?.goalWeight || "");

    const toastMessages = {
        age: (value) => `Věk je nyní ${value}!`,
        weight: (value) => `Váha je nyní ${value} kg!`,
        height: (value) => `Výška je nyní ${value} cm!`,
        goal: (value) => `Cíl je nyní ${value}!`,
        goalWeight: (value) => `Cílová váha je nyní ${value} kg!`,
        gender: (value) => `Pohlaví je nyní ${value === 'Male' ? 'Muž' : 'Žena'}!`,
    };

    const fieldNamesCzech = {
        age: 'věk',
        weight: 'váha',
        height: 'výška',
        goal: 'cíl',
        goalWeight: 'cílová váha',
        gender: 'pohlaví',
    };

    const sendFieldToDB = async (field, value) => {
        try {
            dispatch(updateUserStart());

            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/update/${currentUser._id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ [field]: value }),
            });

            const data = await res.json();

            if (!res.ok) {
                dispatch(updateUserFailure(data));
                toast.error(data.message || `Nepodařilo se aktualizovat ${fieldNamesCzech[field]}. Prosím, zkuste to znovu.`);
                return;
            }

            dispatch(updateUserSuccess(data));

            if (toastMessages[field]) {
                toast.success(toastMessages[field](value), {
                    toastId: `${field}SuccessUpdate`
                });
            } else {
                toast.success(`${capitalizeFirstLetter(field)} byla úspěšně aktualizována!`, {
                    toastId: `${field}SuccessUpdate`
                });
            }
        } catch (error) {
            dispatch(updateUserFailure(error));
            toast.error(`Něco se nepovedlo při aktualizaci ${fieldNamesCzech[field]}. Prosím, zkuste to znovu.`);
        }
    };

    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        switch (name) {
            case "age":
                setAge(value);
                break;
            case "weight":
                setWeight(value);
                break;
            case "height":
                setHeight(value);
                break;
            case "goal":
                setGoal(value);
                if (validateField(name, value)) {
                    sendFieldToDB(name, capitalizeFirstLetter(value));
                }
                break;
            case "goalWeight":
                setGoalWeight(value);
                break;
            default:
                break;
        }
    };

    const handleGenderSelect = (selectedGender) => {
        if (selectedGender !== gender) {
            setGender(selectedGender);
            sendFieldToDB("gender", selectedGender);
        }
    };

    const validateField = (field, value) => {
        switch (field) {
            case "age":
                const ageInt = parseInt(value, 10);
                if (isNaN(ageInt) || ageInt <= 0) {
                    toast.error("Prosím, zadejte platné kladné celé číslo pro věk.");
                    return false;
                }
                return true;
            case "weight":
                const weightNum = parseFloat(value);
                if (isNaN(weightNum) || weightNum <= 0) {
                    toast.error("Prosím, zadejte platné kladné číslo pro váhu.");
                    return false;
                }
                return true;
            case "height":
                const heightNum = parseFloat(value);
                if (isNaN(heightNum) || heightNum <= 0) {
                    toast.error("Prosím, zadejte platné kladné číslo pro výšku.");
                    return false;
                }
                return true;
            case "goal":
                const validGoals = ["Cut", "Maintain", "Bulk"];
                if (!validGoals.includes(capitalizeFirstLetter(value))) {
                    toast.error("Prosím, vyberte platný cíl.");
                    return false;
                }
                return true;
            case "goalWeight":
                const goalWeightNum = parseFloat(value);
                if (isNaN(goalWeightNum) || goalWeightNum <= 0) {
                    toast.error("Prosím, zadejte platné kladné číslo pro cílovou váhu.");
                    return false;
                }
                return true;
            default:
                return false;
        }
    };

    const handleFieldSubmit = async (e, field) => {
        if (e.type === 'keydown') {
            if (e.key !== 'Enter') {
                return;
            }
            e.preventDefault();
        }

        let value;
        switch (field) {
            case "age":
                value = age;
                break;
            case "weight":
                value = weight;
                break;
            case "height":
                value = height;
                break;
            case "goalWeight":
                value = goalWeight;
                break;
            default:
                return;
        }

        if (validateField(field, value)) {
            const parsedValue = (field === "age" || field === "goalWeight") ? parseFloat(value) : value;
            await sendFieldToDB(field, parsedValue);
        }

        e.target.blur();
    };

    const validateAllInputs = () => {
        let isValid = true;

        if (!validateField("age", age)) isValid = false;
        if (!validateField("weight", weight)) isValid = false;
        if (!validateField("height", height)) isValid = false;
        if (!validateField("goal", goal)) isValid = false;
        if (!validateField("goalWeight", goalWeight)) isValid = false;

        const validGenders = ["Male", "Female"];
        if (!validGenders.includes(gender)) {
            toast.error("Prosím, vyberte platné pohlaví.");
            isValid = false;
        }

        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateAllInputs()) {
            return;
        }

        const userData = {
            age: parseInt(age, 10),
            weight: parseFloat(weight),
            height: parseFloat(height),
            goal: capitalizeFirstLetter(goal),
            goalWeight: parseFloat(goalWeight),
            gender,
        };

        try {
            dispatch(updateUserStart());

            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/update/${currentUser._id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userData),
            });

            const data = await res.json();

            if (!res.ok) {
                dispatch(updateUserFailure(data));
                toast.error(data.message || "Zápis se nepovedl. Prosíme, zkuste to znovu.");
                return;
            }

            dispatch(updateUserSuccess(data));
            toast.success("Profil byl úspěšně aktualizován!", { toastId: 'profileSuccessUpdate' });

        } catch (error) {
            dispatch(updateUserFailure(error));
            toast.error("Něco se nepovedlo! Prosíme, zkuste to znovu.");
        }
    };

    const inputClass = 'rounded-lg text-center placeholder:text-black placeholder:opacity-60 p-2 focus:outline-none transition-colors focus:bg-white bg-white bg-opacity-80 duration-500';
    const buttonClass = "rounded-xl p-2 hover:bg-pink-700 transition-colors duration-300 w-[70px]";
    const selectedButtonClass = "rounded-xl p-2 mesh-gradient w-[70px]";

    return (
        <div className='w-screen min-h-screen flex flex-col justify-center items-center bg-gradient-to-r from-pink-400 to-pink-200 overflow-x-hidden'>
            <Navbar />
            <form className="max-w-xl bg-black bg-opacity-60 p-4 rounded-xl mt-[12vh]" onSubmit={handleSubmit}>
                <h2 className='text-xl font-bold text-white mb-6'>Prosíme vyplňte Váš věk, váhu, výšku, cíl a pohlaví.</h2>
                <div className="flex flex-col w-full gap-4">
                    <div className="flex flex-col">
                        <label htmlFor="age" className="text-white mb-1 font-semibold">Věk:</label>
                        <input
                            type="number"
                            id="age"
                            name='age'
                            placeholder='Věk (např. 16, 31, 19)'
                            onChange={handleChange}
                            onBlur={(e) => handleFieldSubmit(e, 'age')}
                            onKeyDown={(e) => handleFieldSubmit(e, 'age')}
                            onFocus={(e) => {
                                if (typeof e.target.select === 'function') {
                                    e.target.select();
                                }
                            }}
                            className={inputClass}
                            min="1"
                            step="1"
                            value={age}
                        />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="weight" className="text-white mb-1 font-semibold">Váha:</label>
                        <input
                            type="number"
                            id="weight"
                            name='weight'
                            placeholder='Váha (např. 74, 60, 44)'
                            onChange={handleChange}
                            onBlur={(e) => handleFieldSubmit(e, 'weight')}
                            onKeyDown={(e) => handleFieldSubmit(e, 'weight')}
                            onFocus={(e) => {
                                if (typeof e.target.select === 'function') {
                                    e.target.select();
                                }
                            }}
                            className={inputClass}
                            min="1"
                            step="0.1"
                            value={weight}
                        />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="height" className="text-white mb-1 font-semibold">Výška:</label>
                        <input
                            type="number"
                            id="height"
                            name='height'
                            placeholder='Výška (např. 150, 180, 164)'
                            onChange={handleChange}
                            onBlur={(e) => handleFieldSubmit(e, 'height')}
                            onKeyDown={(e) => handleFieldSubmit(e, 'height')}
                            onFocus={(e) => {
                                if (typeof e.target.select === 'function') {
                                    e.target.select();
                                }
                            }}
                            className={inputClass}
                            min="1"
                            step="0.1"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="goal" className="text-white mb-1 font-semibold">Cíl:</label>
                        <select
                            id="goal"
                            name="goal"
                            value={goal}
                            onChange={handleChange}
                            className={inputClass}
                        >
                            <option value="" disabled>Vyberte si cíl</option>
                            <option value="Cut">Cut</option>
                            <option value="Maintain">Maintain</option>
                            <option value="Bulk">Bulk</option>
                        </select>
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="goalWeight" className="text-white mb-1 font-semibold">Cílová váha:</label>
                        <input
                            type="number"
                            id="goalWeight"
                            name='goalWeight'
                            placeholder='Cílová váha (např. 70, 65, 80) kg'
                            onChange={handleChange}
                            onBlur={(e) => handleFieldSubmit(e, 'goalWeight')}
                            onKeyDown={(e) => handleFieldSubmit(e, 'goalWeight')}
                            onFocus={(e) => {
                                if (typeof e.target.select === 'function') {
                                    e.target.select();
                                }
                            }}
                            className={inputClass}
                            min="1"
                            step="0.1"
                        />
                    </div>
                    <div className="flex flex-col items-center justify-center text-white font-semibold mt-4">
                        <h2 className="text-xl font-semibold p-2">Pohlaví</h2>
                        <div className="flex gap-2 bg-black bg-opacity-60 rounded-xl p-2">
                            <button
                                type="button"
                                className={gender === "Male" ? selectedButtonClass : buttonClass}
                                onClick={() => handleGenderSelect("Male")}
                            >
                                Muž
                            </button>
                            <button
                                type="button"
                                className={gender === "Female" ? selectedButtonClass : buttonClass}
                                onClick={() => handleGenderSelect("Female")}
                            >
                                Žena
                            </button>
                        </div>
                    </div>
                    <button className={`w-full bg-black text-white font-bold p-4 hover:bg-pink-600 transition-colors duration-300  `}
                        onClick={() => navigate("/dashboard")}
                    >
                        Pokračovat na Dashboard
                    </button>
                </div>
            </form>
        </div>
    );

};

export default GetInfoAboutUser;
