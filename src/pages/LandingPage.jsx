import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { signOut } from "../../redux/user/userSlice";
import Navbar from "../components/Navbar";

const LandingPage = () => {
    const [hiddenMenuBar, setHiddenMenuBar] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const currentUser = useSelector((state) => state.user.currentUser);


    const navigate = useNavigate()

    const dispatch = useDispatch()




    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 600) {
                setHiddenMenuBar(true);
            } else {
                setHiddenMenuBar(false);
            }
        };

        handleResize();

        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);

    }, []);

    const linkClass = "text-sm font-semibold text-gray-900 transition-all duration-200 hover:shadow-lg rounded-xl p-3";

    return (
        <div className="bg-gradient-to-t from-pink-400 to-pink-100 h-screen w-screen flex  items-center flex-col">

            <Navbar/>
            <div className="relative isolate lg:px-8 h-screen">
                <div
                    className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
                    aria-hidden="true"
                >
                </div>

                <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
                    <div className="text-center">
                        <h1 className="text-5xl font-semibold tracking-tight text-gray-900 sm:text-7xl">
                            Calorics
                        </h1>
                        <p className="mt-8 text-lg font-medium text-gray-500 sm:text-xl">
                            Projekt na předmět Webové stránky pro pana učitele Ing. Přemysla Vaculíka od Beneše Adama a Jalovce Tadeáše
                        </p>
                        <div className="mt-10 flex items-center justify-center gap-x-6">
                            <button
                                onClick={() => {
                                    const whereToNavigate = currentUser ? "/dashboard" : "/register"
                                    navigate(whereToNavigate)
                                }}
                                className={`rounded-md text-sm font-semibold text-white shadow-sm mesh-gradient focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${!currentUser ? "px-3.5 py-2.5" : "px-6 py-4 text-xl"}`}
                            >
                                {!currentUser ? "Registruj se" : "Dashboard"}
                            </button>
                            {!currentUser && (

                                <a href="#" className={linkClass}>
                                    Learn more <span aria-hidden="true">→</span>
                                </a>
                            )}
                        </div>
                    </div>
                </div>

                <div
                    className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
                    aria-hidden="true"
                >
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
