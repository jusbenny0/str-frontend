import React from "react";
import Navbar from "../components/Navbar";

const Contact = () => {
    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-t from-pink-400 to-pink-100">
            <Navbar />

            <main className="flex-grow container mx-auto px-4 py-12 flex justify-center flex-col">
                <h1 className="text-4xl font-bold mb-8 text-center">Kontaktujte nás</h1>

                <div className="flex flex-col  items-center">
                    <div className="w-full lg:w-1/2 mt-8 lg:mt-0">
                        <h2 className="text-2xl font-semibold mb-4 text-center">Naše Kontaktní Informace</h2>
                        <p className="text-gray-700 mb-2 text-center">
                            <strong>Adresa:</strong> Ulice 123, 110 00 Praha 1
                        </p>
                        <p className="text-gray-700 mb-2 text-center">
                            <strong>Telefon:</strong> +420 123 456 789
                        </p>
                        <p className="text-gray-700 mb-2 text-center">
                            <strong>Email:</strong> kontakt@reactJeNejlepsi.cz
                        </p>
                        <p className="text-gray-700 mb-2 text-center">
                            <strong>Otevírací doba:</strong> Po-Pá: 9:00 - 17:00
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Contact;
