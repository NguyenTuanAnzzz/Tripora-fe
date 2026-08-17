import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const HomeLayout = ({ children }) => {
    return (
        <div className="min-h-screen font-sans flex flex-col bg-canvas-white text-slate-dark">
            <Header />

            <main className="flex-grow flex flex-col bg-canvas-white">
                {children}
            </main>

            <Footer />
        </div>
    );
};

export default HomeLayout;
