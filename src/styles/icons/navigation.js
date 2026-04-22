import React from 'react';
import Svg, { Path, Circle, Line } from 'react-native-svg';

function LocationBase({ muted = false }) {
    const fill = muted ? '#d8cfc0' : '#f2c4a0';
    const stroke = muted ? '#a89f90' : '#7a4a2a';
    const inner = muted ? '#a89f90' : '#7a4a2a';
    const dot = muted ? '#d8cfc0' : '#f2c4a0';

    return (
        <>
            <Path
                d="M0 -80 C-45 -80 -45 -30 -45 -20 C-45 20 0 70 0 70 C0 70 45 20 45 -20 C45 -30 45 -80 0 -80 Z"
                fill={fill}
                stroke={stroke}
                strokeWidth="3"
            />
            <Circle cx="0" cy="-20" r="22" fill={inner} />
            <Circle cx="0" cy="-20" r="8" fill={dot} />
        </>
    );
}

export function LocationOnIcon({ size = 24 }) {
    return (
        <Svg width={size} height={size} viewBox="-55 -90 110 175">
            <LocationBase muted={false} />
            <Circle cx="0" cy="-20" r="34" fill="none" stroke="#7a4a2a" strokeWidth="2" opacity="0.3" />
            <Circle cx="0" cy="-20" r="46" fill="none" stroke="#7a4a2a" strokeWidth="1.5" opacity="0.15" />
        </Svg>
    );
}

export function LocationOffIcon({ size = 24, crossColor = '#e8504a' }) {
    return (
        <Svg width={size} height={size} viewBox="-55 -90 110 175">
            <LocationBase muted={true} />
            <Line
                x1="-55" y1="-85"
                x2="55" y2="75"
                stroke={crossColor}
                strokeWidth="7"
                strokeLinecap="round"
                opacity="0.92"
            />
            <Line
                x1="55" y1="-85"
                x2="-55" y2="75"
                stroke={crossColor}
                strokeWidth="7"
                strokeLinecap="round"
                opacity="0.92"
            />
        </Svg>
    );
}