import React, { useState } from 'react'
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import { signOut } from "../../redux/user/userSlice";
import { User } from '@phosphor-icons/react';


const Navbar = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const currentUser = useSelector((state) => state.user.currentUser);
    const [hiddenMenuBar, setHiddenMenuBar] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const linkClass = "text-sm font-semibold text-gray-900 transition-all duration-200 hover:shadow-lg rounded-xl p-3 cursor-pointer"

    const handleSignOut = async () => {
        try {
            await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/signout`);
            dispatch(signOut())
            toast.success("Odhlášení proběhlo úspěšně!")
            navigate("/")
        } catch (error) {
            toast.error(error);
        }
    };




    return (
        <header className="w-full fixed z-50 h-[10vh] top-0">
            <nav className="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
                <div className="flex">
                    <button className="-m-1.5 -ml-2 h-16 w-auto"
                        onClick={(e) => navigate("/")}
                    >
                        <span className="sr-only">Stravnicek</span>
                        <img
                            className="h-16 w-auto"
                            src="/img/str.png"
                            alt="Logo Stravnicek"
                        />
                    </button>
                </div>


                <div className="flex gap-2">

                    {currentUser && ( // kdyz je user ukaze mu to link na profil

                        <div className="lg:hidden cursor-pointer"
                            onClick={() => navigate("/profile")}
                        >
                            <User size={48} className='p-2.5' color='black' />
                        </div>
                    )
                    }
                    <div className="flex lg:hidden">
                        <button
                            type="button"
                            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
                            onClick={() => setIsMobileMenuOpen(true)}
                        >
                            <span className="sr-only">Open main menu</span>
                            <svg
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                aria-hidden="true"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                                />
                            </svg>
                        </button>
                    </div>
                </div>

                <div className="hidden lg:flex lg:gap-x-9 flex-grow justify-center">
                    <a className={linkClass} onClick={() => { navigate("/") }}>
                        Domů
                    </a>
                    <a className={linkClass} onClick={() => { navigate('/about') }}>
                        O nás
                    </a>
                    <a className={`${linkClass} ${!currentUser && "mr-16"}`} onClick={() => { navigate('/contact') }} >
                        Kontakt
                    </a>
                    {currentUser && (
                        <a className={linkClass} onClick={() => { navigate('/dashboard') }} >
                            Dashboard
                        </a>

                    )}
                </div>
                {currentUser ? (
                    <div className="hidden lg:flex w-[168px] justify-end gap-1"

                    >
                        <User className={`rounded-xl h-12 lg:h-[55px] cursor-pointer p-2 hover:shadow-lg transition-all duration-300`}
                            size={48}
                            color='black'
                            onClick={() => navigate("/profile")}
                        />
                        <div className="hidden lg:flex lg:justify-end">
                            <button className={linkClass}
                                onClick={() => handleSignOut()}
                            >
                                Log out <span aria-hidden="true">&rarr;</span>
                            </button>
                        </div>
                    </div>
                ) :
                    <div className="hidden lg:flex lg:justify-end">
                        <button className={linkClass}
                            onClick={() => navigate("/login")}
                        >
                            Log in <span aria-hidden="true">&rarr;</span>
                        </button>
                    </div>

                }

            </nav>

            {isMobileMenuOpen && (
                <div className="lg:hidden" role="dialog" aria-modal="true">
                    <div className="fixed inset-0 z-50 "></div>
                    <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-gradient-to-t to-pink-400 from-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
                        <div className="flex items-center justify-between">
                            <a href="#" className="-m-1.5 p-1.5 flex-grow" >
                                <span className="sr-only">Your Company</span>
                                <img
                                    className="h-auto w-1/2"
                                    src="/img/str.png" 
                                    alt="Your Company Logo"
                                />
                            </a>
                            <button
                                type="button"
                                className="-m-2.5 rounded-md p-2.5 text-gray-700"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                <span className="sr-only">Close menu</span>
                                <svg
                                    className="h-6 w-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    aria-hidden="true"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                        <div className="mt-6 flex flex-col">
                            <div className="-my-6 divide-y divide-gray-500/10">
                                <div className="flex flex-col gap-y-2 justify-center items-center py-6">
                                    <a
                                        className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold text-gray-900 hover:bg-gray-50"
                                        onClick={() => { navigate("/") }}
                                    >
                                        Domů
                                    </a>
                                    <a
                                        href="#"
                                        className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold text-gray-900 hover:bg-gray-50"
                                        onClick={() => { navigate("/about") }}
                                    >
                                        O nás
                                    </a>
                                    <a
                                        href="#"
                                        className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold text-gray-900 hover:bg-gray-50"
                                        onClick={() => { navigate("/contact") }}
                                    >
                                        Kontakt
                                    </a>
                                    {currentUser && (
                                        <a className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold text-gray-900 hover:bg-gray-50"
                                            onClick={() => { navigate('/dashboard') }} >
                                            Dashboard
                                        </a>

                                    )}
                                </div>
                                {!currentUser ? (
                                    <div className="py-6 fixed bottom-0 right-2">
                                        <button className={linkClass}
                                            onClick={() => navigate("/login")}
                                        >
                                            Log in <span aria-hidden="true">&rarr;</span>
                                        </button>
                                    </div>

                                ) :
                                    <div className="py-6 fixed bottom-0 right-2">
                                        <button className={linkClass}
                                            onClick={() => navigate("/login")}
                                        >
                                            Log out <span aria-hidden="true">&rarr;</span>
                                        </button>
                                    </div>


                                }
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </header>
    )
}

export default Navbar
