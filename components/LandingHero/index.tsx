import React from 'react';
import Readme from './Readme';
import './style.css';

function LandingHero() {
    return (
        <>
            <div id="landingHero" className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4">
                <img src="https://thegeekdesigner.com/img/timesheet/hawkeyelogo_px.png" alt="Hawkeye Logo" className="logo" />
                <h1 className="logo rainbow">WELCOME!</h1>
                <button id="playButton" className="pixel-art-button">Play</button>
                <p className="credits"> ⓒ Doge Sound Club. <a href="#readme" className="readme-trigger">Please Read</a></p>
                <Readme />
            </div>
        </>
    )
}
export default LandingHero;