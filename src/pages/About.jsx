import React from 'react';
import Navbar from '../components/Navbar';

const About = () => {
    return (
        <>
            <Navbar />
            <div className="bg-gradient-to-t from-pink-400 to-pink-100 h-screen flex justify-center overflow-hidden">
                <div className="container mx-auto px-4 flex flex-col-reverse md:flex-row items-center justify-center">
                    <div className="md:w-1/2">
                        <h1 className="text-4xl font-bold mb-4">O nás</h1>
                        <p className="text-lg text-gray-700">
                            Vítejte u Calorics, vaší spolehlivé aplikace pro sledování kalorií a dosažení vašich fitness cílů. Naším cílem je pomoci vám lépe porozumět vašemu jídelníčku, sledovat příjem kalorií a podporovat zdravý životní styl.
                        </p>
                        <p className="text-lg text-gray-700 mt-4">
                            Calorics nabízí uživatelsky přívětivé rozhraní, detailní analýzy a personalizované doporučení, která vám umožní efektivněji plánovat své jídlo a tréninky. Přidejte se k naší komunitě a začněte svou cestu ke zdravějšímu já ještě dnes!
                        </p>
                    </div>


                    <div className="w-auto flex justify-center items-center">
                        <img
                            src="/img/calorics.png"
                            alt="Calorics App"
                            className=" lg:h-[600px] md:h-96 h-48"
                        />
                    </div>
                </div>
            </div>
        </>
    );
}

export default About;
