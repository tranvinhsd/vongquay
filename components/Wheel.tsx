
import React, { useEffect, useRef, useState } from 'react';
import { Student } from '../types';
import { soundFX } from '../utils/sound';

interface WheelProps {
    students: Student[];
    mustSpin: boolean;
    prizeNumber: number;
    onStopSpinning: () => void;
}

const COLORS = [
    '#EF476F', // Red-ish
    '#FFD166', // Yellow
    '#06D6A0', // Green
    '#118AB2', // Blue
    '#073B4C', // Dark Blue
    '#9D4EDD', // Purple
    '#FF9F1C', // Orange
    '#264653', // Dark Cyan
    '#2A9D8F', // Teal
    '#E9C46A', // Sand
    '#F4A261', // Sandy Brown
    '#E76F51', // Burnt Sienna
];

const Wheel: React.FC<WheelProps> = ({ students, mustSpin, prizeNumber, onStopSpinning }) => {
    const [rotation, setRotation] = useState(0);
    const spinTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
    
    // Calculate segment size
    const totalSegments = students.length;
    const segAngle = 360 / totalSegments;

    // Dynamic font size based on number of segments to prevent overlapping
    const getFontSize = () => {
        if (totalSegments > 30) return 0.035;
        if (totalSegments > 20) return 0.05;
        if (totalSegments > 12) return 0.06;
        return 0.08;
    };
    
    const fontSize = getFontSize();

    useEffect(() => {
        if (mustSpin) {
            // Calculate landing position
            // We want the prizeNumber index to end up at the pointer (top: 270deg or -90deg)
            // Current setup: 0 degrees is at 3 o'clock (standard SVG unit circle)
            // We rotate counter-clockwise usually or clockwise.
            // Let's assume the pointer is at the TOP (270 degrees in unit circle logic, or just rotate the whole SVG -90deg).
            
            const newRotation = rotation + 1800 + (360 - (prizeNumber * segAngle)); 
            // Add slight randomness within the segment to make it realistic
            const randomOffset = Math.floor(Math.random() * (segAngle - 2)) - (segAngle / 2);
            
            setRotation(newRotation + randomOffset);

            // Play ticking sounds
            let step = 0;
            const totalTime = 4000; // 4 seconds spin
            const interval = setInterval(() => {
                step += 100;
                if (step < totalTime) {
                   if (step % 200 === 0) soundFX.playSpinSound();
                } else {
                    clearInterval(interval);
                }
            }, 100);

            spinTimeout.current = setTimeout(() => {
                onStopSpinning();
                soundFX.playWinSound();
            }, totalTime);
        }
        return () => {
            if (spinTimeout.current) clearTimeout(spinTimeout.current);
        };
    }, [mustSpin, prizeNumber, students.length]);

    // Generate SVG Paths for segments
    const getCoordinatesForPercent = (percent: number) => {
        const x = Math.cos(2 * Math.PI * percent);
        const y = Math.sin(2 * Math.PI * percent);
        return [x, y];
    };

    const segments = students.map((student, index) => {
        const startAngle = index * segAngle;
        const endAngle = (index + 1) * segAngle;
        
        // Convert to 0-1 range for math
        const startPercent = startAngle / 360;
        const endPercent = endAngle / 360;
        
        const [startX, startY] = getCoordinatesForPercent(startPercent);
        const [endX, endY] = getCoordinatesForPercent(endPercent);

        const largeArcFlag = endPercent - startPercent > 0.5 ? 1 : 0;

        const pathData = [
            `M 0 0`,
            `L ${startX} ${startY}`,
            `A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY}`,
            `L 0 0`,
        ].join(' ');

        // Calculate text position
        const textAngle = startAngle + segAngle / 2;
        const textRad = (2 * Math.PI * textAngle) / 360;
        const textX = Math.cos(textRad) * 0.75; // 0.75 radius
        const textY = Math.sin(textRad) * 0.75;

        return (
            <g key={student.id}>
                <path 
                    d={pathData} 
                    fill={COLORS[index % COLORS.length]} 
                    stroke="white" 
                    strokeWidth="0.01"
                />
                <text
                    x={textX}
                    y={textY}
                    fill="white"
                    fontSize={fontSize}
                    fontWeight="bold"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    transform={`rotate(${textAngle}, ${textX}, ${textY})`}
                    style={{ pointerEvents: 'none' }}
                >
                    {student.name.length > 8 ? student.name.substring(0, 6) + '..' : student.name}
                </text>
            </g>
        );
    });

    return (
        <div className="relative w-full max-w-[90vw] md:max-w-[1200px] lg:max-w-[1200px] aspect-square perspective-container">
            {/* The Pointer (Triangle) */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 z-20 w-0 h-0 
                            border-l-[20px] border-l-transparent
                            border-r-[20px] border-r-transparent
                            border-t-[40px] border-t-red-600
                            drop-shadow-lg">
            </div>

            {/* The Wheel */}
            <div 
                className="w-full h-full transition-transform duration-[4000ms] ease-[cubic-bezier(0.25,0.1,0.25,1)] wheel-shadow rounded-full border-4 border-white"
                style={{ transform: `rotate(${rotation}deg)` }}
            >
                <svg viewBox="-1 -1 2 2" className="w-full h-full transform -rotate-90">
                    {segments}
                    {/* Center Hub */}
                    <circle cx="0" cy="0" r="0.1" fill="white" stroke="#E2E8F0" strokeWidth="0.02" />
                </svg>
            </div>
            
            {/* Base Stand (Visual only to look like a desk toy) */}
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-40 h-8 bg-gray-300 rounded-full blur-sm -z-10"></div>
        </div>
    );
};

export default Wheel;
