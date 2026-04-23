import React from 'react';

const Logo = ({ className, style }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 800 450"
            className={className}
            style={{ ...style, maxWidth: '100%', height: 'auto' }}
            aria-label="DES Logo"
        >
            <defs>
                <linearGradient id="yellowSwooshGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#fdb913" />
                    <stop offset="100%" stopColor="#f39200" />
                </linearGradient>
                <linearGradient id="greenSwooshGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#9ccc3c" />
                    <stop offset="100%" stopColor="#358129" />
                </linearGradient>
            </defs>

            {/* Background Swooshes */}
            {/* Top Right Yellow Swoosh */}
            <path d="M 240,160 C 320,-10 700,30 740,240 C 660,110 400,60 280,170 Z" fill="url(#yellowSwooshGrad)" />
            
            {/* Left Blue Swoosh */}
            <path d="M 250,170 C 80,130 90,300 180,380 C 80,260 180,170 270,180 Z" fill="#04297a" />

            {/* Bottom Green Swoosh */}
            <path d="M 120,310 C 300,430 600,400 720,270 C 550,420 300,420 100,290 Z" fill="url(#greenSwooshGrad)" />
            
            {/* Bottom Blue Swoosh */}
            <path d="M 150,330 C 300,460 580,430 680,290 C 550,440 300,440 130,310 Z" fill="#04619d" />


            {/* Book Icon - Rendered behind the text to avoid overlapping DES */}
            <g transform="translate(180, 320) rotate(-10) scale(1)">
                {/* Book cover back */}
                <path d="M -95,8 L 0,25 L 95,8 L 95,45 L 0,65 L -95,45 Z" fill="#04297a" />
                
                {/* Left pages block */}
                <path d="M -90,5 Q -45,15 0,20 V 60 Q -45,55 -90,45 Z" fill="#e0e0e0" />
                {/* Left Top page */}
                <path d="M -90,0 Q -45,10 0,15 V 55 Q -45,50 -90,40 Z" fill="#ffffff" stroke="#ccc" strokeWidth="1" />
                {/* Left page lines */}
                <path d="M -80,10 Q -40,18 -10,22" stroke="#d0d0d0" strokeWidth="2" fill="none" />
                <path d="M -80,20 Q -40,28 -10,32" stroke="#d0d0d0" strokeWidth="2" fill="none" />
                <path d="M -80,30 Q -40,38 -10,42" stroke="#d0d0d0" strokeWidth="2" fill="none" />
                
                {/* Right pages block */}
                <path d="M 90,5 Q 45,15 0,20 V 60 Q 45,55 90,45 Z" fill="#e0e0e0" />
                {/* Right Top page */}
                <path d="M 90,0 Q 45,10 0,15 V 55 Q 45,50 90,40 Z" fill="#ffffff" stroke="#ccc" strokeWidth="1" />
                {/* Right page lines */}
                <path d="M 80,10 Q 40,18 10,22" stroke="#d0d0d0" strokeWidth="2" fill="none" />
                <path d="M 80,20 Q 40,28 10,32" stroke="#d0d0d0" strokeWidth="2" fill="none" />
                <path d="M 80,30 Q 40,38 10,42" stroke="#d0d0d0" strokeWidth="2" fill="none" />
                
                {/* Book spine curve */}
                <path d="M -5,15 C -5,25 5,25 5,15 Z" fill="#04297a" />
                <path d="M -5,55 C -5,65 5,65 5,55 Z" fill="#04297a" />
                
                {/* Checkmark bounding out of the book */}
                <path d="M -30,20 L -10,50 L 50,-20 L 35,-30 L -10,30 L -20,10 Z" fill="#4ba02b" />
            </g>

            {/* Clipboard Icon - Rendered behind the text */}
            <g transform="translate(680, 260) rotate(10) scale(0.9)">
                {/* Board */}
                <rect x="-50" y="-70" width="100" height="130" rx="10" fill="#04297a" />
                {/* Paper */}
                <rect x="-43" y="-55" width="86" height="110" fill="#ffffff" />
                
                {/* Lines and checkboxes */}
                <g transform="translate(-30, -30)">
                    <rect x="0" y="0" width="10" height="10" rx="2" fill="none" stroke="#04297a" strokeWidth="1.5" />
                    <line x1="18" y1="5" x2="60" y2="5" stroke="#ccc" strokeWidth="2" strokeLinecap="round" />
                    <path d="M 2,5 L 5,9 L 14,-2" fill="none" stroke="#4ba02b" strokeWidth="2" strokeLinecap="round" />
                </g>
                <g transform="translate(-30, -10)">
                    <rect x="0" y="0" width="10" height="10" rx="2" fill="none" stroke="#04297a" strokeWidth="1.5" />
                    <line x1="18" y1="5" x2="60" y2="5" stroke="#ccc" strokeWidth="2" strokeLinecap="round" />
                    <path d="M 2,5 L 5,9 L 14,-2" fill="none" stroke="#4ba02b" strokeWidth="2" strokeLinecap="round" />
                </g>
                <g transform="translate(-30, 10)">
                    <rect x="0" y="0" width="10" height="10" rx="2" fill="none" stroke="#04297a" strokeWidth="1.5" />
                    <line x1="18" y1="5" x2="60" y2="5" stroke="#ccc" strokeWidth="2" strokeLinecap="round" />
                    <path d="M 2,5 L 5,9 L 14,-2" fill="none" stroke="#4ba02b" strokeWidth="2" strokeLinecap="round" />
                </g>
                <g transform="translate(-30, 30)">
                    <rect x="0" y="0" width="10" height="10" rx="2" fill="none" stroke="#04297a" strokeWidth="1.5" />
                    <line x1="18" y1="5" x2="60" y2="5" stroke="#ccc" strokeWidth="2" strokeLinecap="round" />
                </g>

                {/* Clip */}
                <rect x="-15" y="-75" width="30" height="15" rx="3" fill="#eeeeee" stroke="#aaa" strokeWidth="1"/>
                <circle cx="0" cy="-68" r="3" fill="#aaa" />

                {/* Pencil */}
                <g transform="translate(-20, 20) rotate(-40)">
                    <path d="M 0,0 L -25,-8 L -25,8 Z" fill="#f4c894" />
                    <path d="M 0,0 L -8,-3 L -8,3 Z" fill="#333" />
                    <rect x="-95" y="-8" width="70" height="16" fill="#f39200" />
                    <rect x="-95" y="-5" width="70" height="4" fill="#fecca5" opacity="0.4" />
                    <rect x="-107" y="-8" width="12" height="16" fill="#ccc" />
                    <path d="M -107,-8 V 8 C -112,8 -115,5 -115,0 C -115,-5 -112,-8 -107,-8 Z" fill="#f4a3ad" />
                </g>
            </g>

            {/* Main Text: DES - Rendered after background elements to be completely fully visible */}
            <text x="400" y="300" textAnchor="middle" fontFamily="'Arial Black', 'Helvetica Black', 'Impact', sans-serif" fontWeight="900" fontSize="210" letterSpacing="15">
                <tspan fill="#04297a">D</tspan>
                <tspan fill="#04619d">E</tspan>
                <tspan fill="#4ba02b">S</tspan>
            </text>

            {/* Graduation Cap - Rendered last so the tassel overlaps the text beautifully */}
            <g transform="translate(400, 130)">
                <path d="M -50,15 V 45 C -50,65 50,65 50,45 V 15 Z" fill="#04297a" />
                <path d="M 0,-45 L 140,-5 L 0,35 L -140,-5 Z" fill="#0d469b" />
                <path d="M -140,-5 L 0,35 L 140,-5 L 140,5 L 0,45 L -140,5 Z" fill="#04297a" />
                
                {/* Tassel */}
                <path d="M 0,-5 C -40,-5 -60,0 -80,45" fill="none" stroke="#fdb913" strokeWidth="4" />
                <circle cx="-80" cy="45" r="5" fill="#fdb913" />
                <path d="M -85,45 L -100,90 L -60,90 L -75,45 Z" fill="#fdb913" />
            </g>

        </svg>
    );
};

export default Logo;
