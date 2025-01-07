import {
    ArrowFatLeft,
    ArrowFatRight,
    ArrowLeft,
    ArrowRight,
} from "@phosphor-icons/react";
import React from "react";
import { useNavigate } from "react-router-dom";

const GoBackArrow = ({
    componentColor = "black",
    absolute,
    right,
    whereTo = "/",
}) => {
    const navigate = useNavigate();

    return (
        <button
            className={`cursor-pointer top-4 flex gap-2 items-center font-semibold text-xl rounded-xl bg-transparent p-2 transition-all duration-300 hover:shadow-lg ${right ? "right-4 absolute" : "left-4 fixed"
                } `}
            onClick={() => navigate(whereTo)}
        >
            {right ? (
                <div className="flex items-center gap-2">
                    <p className={`text-${componentColor}`}>Back</p>

                    <ArrowFatRight size={24} color={componentColor} weight="bold" />
                </div>
            ) : (
                <div className="flex items-center gap-2">
                    <ArrowFatLeft size={24} color={componentColor} />
                    <p className={`text-${componentColor}`}>Back</p>
                </div>
            )}
        </button>
    );
};

export default GoBackArrow;
