import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    Barbell,
    FlagBanner,
    Heart,
    Password,
    PencilSimpleLine,
    Ruler,
    Signature,
    UserCircle,
} from '@phosphor-icons/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    updateUserStart,
    updateUserSuccess,
    updateUserFailure
} from '../../redux/user/userSlice';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '../components/Navbar';

const Profile = () => {
    const dispatch = useDispatch();
    const { currentUser } = useSelector((state) => state.user);

    const [showPassword, setShowPassword] = useState(false);
    const [editField, setEditField] = useState(null);

    const [formData, setFormData] = useState({
        email: currentUser?.email || "",
        password: "",
        weight: currentUser?.weight || "",
        height: currentUser?.height || "",
        goal: currentUser?.goal || "",
        goalWeight: currentUser?.goalWeight || "",
        gender: currentUser?.gender || "",
        age: currentUser?.age || "",
    });

    const [passwordValidation, setPasswordValidation] = useState({
        length: false,
        uppercase: false,
        number: false,
        specialChar: false,
    });

    // validuj heslo realtime
    const validatePassword = (password) => {
        const validation = {
            length: password.length > 8,
            uppercase: /[A-Z]/.test(password),
            number: /[0-9]/.test(password),
            specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
        };
        setPasswordValidation(validation);
        return validation;
    };

    // posli data do db
    const sendDataToDB = async (field, value) => {
        try {
            dispatch(updateUserStart());
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/update/${currentUser._id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "credentials": "include",
                },
                body: JSON.stringify({ [field]: value }),
            });

            const data = await res.json();

            if (!res.ok) {
                dispatch(updateUserFailure(data));
                toast.error(data.message || "update failed. please try again.");
                return;
            }

            dispatch(updateUserSuccess(data));
            toast.success("profil aktualizovan uspesne!", { toastId: 'profileSuccessUpdate' });

        } catch (error) {
            dispatch(updateUserFailure(error));
            toast.error("something went wrong! please try again.");
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));

        if (name === "password") {
            validatePassword(value);
        }
    };

    const makeInput = (fieldName) => {
        if (editField === fieldName) {
            if (fieldName === "password") {
                setFormData((prevData) => ({
                    ...prevData,
                    password: "",
                }));
                setPasswordValidation({
                    length: false,
                    uppercase: false,
                    number: false,
                    specialChar: false,
                });
            }
            setEditField(null);
        } else {
            setEditField(fieldName);
        }
    };

    const handleSave = async (fieldName) => {
        if (fieldName === "password") {
            const validation = validatePassword(formData.password);
            const isValid = Object.values(validation).every(Boolean);
            if (!isValid) {
                toast.error("password nesplnuje podminky.");
                return;
            }
        }
        await sendDataToDB(fieldName, formData[fieldName]);
        setEditField(null);
    };

    const handleButtonSelection = async (fieldName, selectedValue) => {
        setFormData((prevData) => ({
            ...prevData,
            [fieldName]: selectedValue,
        }));
        await sendDataToDB(fieldName, selectedValue);
        setEditField(null);
    };

    const renderInput = (
        fieldKey,
        label,
        Icon,
        value,
        type = "text",
        goalUnit,
        isPassword = false
    ) => {
        const isEditing = editField === fieldKey;
        const isGenderField = fieldKey === "gender";
        const isGoalField = fieldKey === "goal";

        if (isGenderField && isEditing) {
            return (
                <div className="flex-col flex lg:flex-row gap-2 w-full rounded-[inherit]" key={fieldKey}>
                    <div className="p-4 bg-white border-2 border-gray-300 rounded-[inherit] w-full">
                        <div className="flex justify-between">
                            <p className="flex gap-2 items-center">
                                <Icon size={24} color="#FF49C2" />
                                {label}
                            </p>
                            <button
                                type="button"
                                onClick={() => makeInput(fieldKey)}
                                className="focus:outline-none"
                                aria-label={`Edit ${label}`}
                            >
                                <PencilSimpleLine size={22} color="black" />
                            </button>
                        </div>
                        <div className="h-full flex flex-col pt-2 font-bold">
                            <div className="flex gap-4 mt-2">
                                <button
                                    type="button"
                                    className="px-4 py-2 bg-pink-200 rounded-xl hover:bg-pink-300"
                                    onClick={() => handleButtonSelection('gender', 'male')}
                                >
                                    Male
                                </button>
                                <button
                                    type="button"
                                    className="px-4 py-2 bg-pink-200 rounded-xl hover:bg-pink-300"
                                    onClick={() => handleButtonSelection('gender', 'female')}
                                >
                                    Female
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        if (isGoalField && isEditing) {
            return (
                <div className="flex-col flex lg:flex-row gap-2 w-full rounded-[inherit]" key={fieldKey}>
                    <div className="p-4 bg-white border-2 border-gray-300 rounded-[inherit] w-full">
                        <div className="flex justify-between">
                            <p className="flex gap-2 items-center">
                                <Icon size={24} color="#FF49C2" />
                                {label}
                            </p>
                            <button
                                type="button"
                                onClick={() => makeInput(fieldKey)}
                                className="focus:outline-none"
                                aria-label={`Edit ${label}`}
                            >
                                <PencilSimpleLine size={22} color="black" />
                            </button>
                        </div>
                        <div className="h-full flex flex-col pt-2 font-bold">
                            <div className="flex gap-4 mt-2">
                                <button
                                    type="button"
                                    className="px-4 py-2 bg-pink-200 rounded-xl hover:bg-pink-300"
                                    onClick={() => handleButtonSelection('goal', 'cut')}
                                >
                                    Cut
                                </button>
                                <button
                                    type="button"
                                    className="px-4 py-2 bg-pink-200 rounded-xl hover:bg-pink-300"
                                    onClick={() => handleButtonSelection('goal', 'maintain')}
                                >
                                    Maintain
                                </button>
                                <button
                                    type="button"
                                    className="px-4 py-2 bg-pink-200 rounded-xl hover:bg-pink-300"
                                    onClick={() => handleButtonSelection('goal', 'bulk')}
                                >
                                    Bulk
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div className="flex-col flex lg:flex-row gap-2 w-full rounded-[inherit]" key={fieldKey}>
                <div className="p-4 bg-white border-2 border-gray-300 rounded-[inherit] w-full">
                    <div className="flex justify-between">
                        <p className="flex gap-2 items-center">
                            <Icon size={24} color="#FF49C2" />
                            {label}
                        </p>
                        <button
                            type="button"
                            onClick={() => makeInput(fieldKey)}
                            className="focus:outline-none"
                            aria-label={`Edit ${label}`}
                        >
                            <PencilSimpleLine size={22} color="black" />
                        </button>
                    </div>
                    <div className="h-full flex flex-col pt-2 font-bold">
                        {isEditing ? (
                            <AnimatePresence>
                                <motion.div
                                    className="relative w-full"
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <input
                                        type={isPassword && !showPassword ? "password" : "text"}
                                        className={`w-full focus:outline-none h-fit pl-2 text-lg ${isEditing
                                            ? 'border-2 border-blue-500 rounded'
                                            : 'border-2 border-transparent'
                                            }`}
                                        value={formData[fieldKey]}
                                        onChange={handleChange}
                                        name={fieldKey}
                                        autoFocus
                                        onBlur={() => handleSave(fieldKey)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                handleSave(fieldKey);
                                            }
                                        }}
                                    />
                                    {isPassword && (
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
                                            aria-label="toggle password visibility"
                                        >
                                            {showPassword ? 'Hide' : 'Show'}
                                        </button>
                                    )}
                                    {isPassword && (
                                        <div className="mt-2 space-y-1">
                                            <ValidationMessage
                                                isValid={passwordValidation.length}
                                                message="be longer than 8 characters"
                                            />
                                            <ValidationMessage
                                                isValid={passwordValidation.uppercase}
                                                message="contain at least one capital letter"
                                            />
                                            <ValidationMessage
                                                isValid={passwordValidation.number}
                                                message="contain at least one number"
                                            />
                                            <ValidationMessage
                                                isValid={passwordValidation.specialChar}
                                                message="contain at least one special character"
                                            />
                                        </div>
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        ) : (
                            <span>
                                {isPassword
                                    ? '••••••••'
                                    : (value || "N/A")
                                }
                                {goalUnit ? ` ${goalUnit}` : ""}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    // komponenta pro zobrazeni validacnich zpravy
    const ValidationMessage = ({ isValid, message }) => (
        <p className={`text-sm flex items-center ${isValid ? 'text-green-500' : 'text-red-500'}`}>
            {isValid ? '✔️' : '❌'} {message}
        </p>
    );

    return (
        <div className="text-white min-h-screen w-full overflow-x-hidden bg-gradient-to-t from-pink-400 to-pink-200 flex flex-col items-center justify-center">
            <form
                className="w-[90%] flex justify-center flex-col items-center"
                onSubmit={(e) => {
                    e.preventDefault();
                }}
            >
                <div className="w-full flex items-center flex-col">
                    <h2 className="text-4xl font-bold flex gap-2 items-center mt-24">
                        <UserCircle size={64} color="#FF49C2" weight="bold" /> Tvuj profil
                    </h2>
                    <p className="text-2xl font-thin italic text-gray-500 mb-2">
                        Tady můžeš měnit svoje údaje
                    </p>
                    <div className="bg-opacity-60 bg-black p-4 flex flex-col gap-3 w-full md:w-1/2 rounded-xl text-black">
                        {renderInput("email", "Emailová adresa", Signature, formData.email, "email")}
                        {renderInput("password", "Heslo", Password, formData.password, "password", null, true)}
                        <div className="flex-col flex lg:flex-row gap-2 w-full rounded-[inherit]">
                            {renderInput("weight", "Váha", Barbell, formData.weight, "number", "kg")}
                            {renderInput("height", "Výška", Ruler, formData.height, "number", "cm")}
                        </div>
                        <div className="flex-col flex lg:flex-row gap-2 w-full rounded-[inherit]">
                            {renderInput("goal", "Cíl", FlagBanner, formData.goal, "text")}
                            {renderInput("goalWeight", "Cílova váha", Heart, formData.goalWeight, "number", "kg")}
                        </div>
                        <div className="flex-col flex lg:flex-row gap-2 w-full rounded-[inherit]">
                            {renderInput("gender", "Pohlaví", UserCircle, formData.gender, "text")}
                            {renderInput("age", "Věk", UserCircle, formData.age, "number", "let")}
                        </div>
                    </div>
                </div>
            </form>
            <Navbar />
        </div>
    );
};

export default Profile;
