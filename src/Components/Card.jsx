// import React from "react";

// function Card({ icon, title, subtitle }) {
//     return (
//         <div className="border max-w-[420px] bg-neutral-900 text-white rounded-2xl shadow-lg p-10 flex flex-col items-start gap-6">
//             {/* Logo */}
//             <div className="bg-neutral-800 p-4 rounded-full flex items-center justify-center">
//                 {icon}
//             </div>

//             {/* Title */}
//             <h2 className="text-2xl font-bold">{title}</h2>

//             {/* Subtitle */}
//             <p className="text-neutral-400">{subtitle}</p>
//         </div>
//     );
// }

// export default Card;


import React, { useRef } from "react";

function Card({ icon, title, subtitle, onMouseMove, onMouseLeave }) {
    const cardRef = useRef(null);

    // Handle mouse move if no external handler is provided
    const handleMouseMove = (e) => {
        if (!cardRef.current) return;

        if (onMouseMove) {
            onMouseMove(e);
            return;
        }

        const card = cardRef.current;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const glareX = (x / rect.width) * 100;
        const glareY = (y / rect.height) * 100;

        const glare = card.querySelector('.glare-effect');
        if (glare) {
            glare.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255, 255, 255, 0.15) 0%, transparent 60%)`;
            glare.style.opacity = '1';
        }
    };

    const handleMouseLeave = (e) => {
        if (!cardRef.current) return;

        if (onMouseLeave) {
            onMouseLeave(e);
            return;
        }

        const card = cardRef.current;
        const glare = card.querySelector('.glare-effect');
        if (glare) {
            glare.style.opacity = '0';
        }
    };

    return (
        <div
            ref={cardRef}
            className="border max-w-[420px] bg-neutral-900 text-white rounded-2xl shadow-lg p-10 flex flex-col items-start gap-6 relative overflow-hidden"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            {/* Glare effect */}
            <div className="glare-effect absolute inset-0 pointer-events-none opacity-0 transition-opacity duration-300"></div>

            {/* Logo */}
            <div className="bg-neutral-800 p-4 rounded-full flex items-center justify-center relative z-10">
                {icon}
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold relative z-10">{title}</h2>

            {/* Subtitle */}
            <p className="text-neutral-400 relative z-10">{subtitle}</p>
        </div>
    );
}

export default Card;