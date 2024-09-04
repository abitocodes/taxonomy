import React from 'react';

function Readme() {
    return (
        <div id="readme" className="readme">
            <div className="readme-overlay" aria-label="Close"></div>
            <div className="readme-content">
                <a href="#" className="readme-close" aria-label="Close">&times;</a>
                <h2>Timesheet Invaders!</h2>
                <p>In 2055, Hawkeye's creative team faces an interstellar nightmare: the dreaded timesheets. Welcome to "Timesheet Invaders," a journey through the cosmic void of agency bureaucracy.</p>
                <p>Battle endless waves of timesheet foes, while pondering the futility of existence. Will you annihilate the clerical swarm and file your report, or succumb to the black hole of administrative drudgery?</p>
                <p>Join the fight in an existential parody that proves timesheets are inescapable, even in the cosmos.</p>
                <p>Also, just do your timesheets dude.</p>
                <p className="music-credit"> Music: Level 3 by <a href="https://freemusicarchive.org/music/holiznacc0/chiptunes/level-3/" target="_blank" rel="noopener noreferrer">HoliznaCC0</a></p>
                <p className="music-credit"> DISCLAIMER: This is a goof side project I made in a weekend using Chat GPT-4, Midjourney, and my noggin. All thoughts are my own and are independent from Hawkeye.</p>
            </div>
        </div>
    );
}

export default Readme;