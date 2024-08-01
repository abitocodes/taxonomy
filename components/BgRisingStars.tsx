"use client"

import React, { useEffect } from 'react';
import { generateStarStyles } from '@/utils/starStyles';

const BgRisingStars = () => {
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = generateStarStyles();
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="z-[-1]">
      <div id="stars2"></div>
    </div>
  );
}

export default BgRisingStars;