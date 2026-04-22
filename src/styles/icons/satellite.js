import React from 'react';
import Svg, {
    Rect,
    Line,
    Ellipse,
    Circle,
    G,
} from 'react-native-svg';

function SatelliteBase({ size = 24 }) {
    return (
        <G transform="translate(0, 0) rotate(-35)">
            {/* left panel arm */}
            <Rect x="-110" y="-5" width="72" height="10" rx="3" fill="#8a9aaa" />

            {/* left solar panel */}
            <Rect x="-115" y="-38" width="30" height="76" rx="4" fill="#5a7a9a" stroke="#4a6a8a" strokeWidth="1.5" />
            <Line x1="-115" y1="-14" x2="-85" y2="-14" stroke="#4a6a8a" strokeWidth="0.8" />
            <Line x1="-115" y1="10" x2="-85" y2="10" stroke="#4a6a8a" strokeWidth="0.8" />
            <Line x1="-115" y1="34" x2="-85" y2="34" stroke="#4a6a8a" strokeWidth="0.8" />
            <Line x1="-100" y1="-38" x2="-100" y2="38" stroke="#4a6a8a" strokeWidth="0.8" />

            {/* right panel arm */}
            <Rect x="38" y="-5" width="72" height="10" rx="3" fill="#8a9aaa" />

            {/* right solar panel */}
            <Rect x="85" y="-38" width="30" height="76" rx="4" fill="#5a7a9a" stroke="#4a6a8a" strokeWidth="1.5" />
            <Line x1="85" y1="-14" x2="115" y2="-14" stroke="#4a6a8a" strokeWidth="0.8" />
            <Line x1="85" y1="10" x2="115" y2="10" stroke="#4a6a8a" strokeWidth="0.8" />
            <Line x1="85" y1="34" x2="115" y2="34" stroke="#4a6a8a" strokeWidth="0.8" />
            <Line x1="100" y1="-38" x2="100" y2="38" stroke="#4a6a8a" strokeWidth="0.8" />

            {/* main body */}
            <Rect x="-38" y="-28" width="76" height="56" rx="8" fill="#c8bfb0" stroke="#a89f90" strokeWidth="1.5" />
            <Line x1="-38" y1="-8" x2="38" y2="-8" stroke="#a89f90" strokeWidth="0.8" />
            <Line x1="-38" y1="12" x2="38" y2="12" stroke="#a89f90" strokeWidth="0.8" />
            <Circle cx="-28" cy="-18" r="3" fill="#a89f90" />
            <Circle cx="28" cy="-18" r="3" fill="#a89f90" />
            <Circle cx="-28" cy="18" r="3" fill="#a89f90" />
            <Circle cx="28" cy="18" r="3" fill="#a89f90" />

            {/* dish arm */}
            <Rect x="-4" y="-58" width="8" height="32" rx="2" fill="#a89f90" />

            {/* dish */}
            <Ellipse cx="0" cy="-62" rx="26" ry="10" fill="#d8cfc0" stroke="#a89f90" strokeWidth="1.5" />
            <Ellipse cx="0" cy="-62" rx="26" ry="10" fill="none" stroke="#a89f90" strokeWidth="0.8" strokeDasharray="4 3" />
            <Circle cx="0" cy="-62" r="4" fill="#a89f90" />
            <Line x1="-26" y1="-62" x2="26" y2="-62" stroke="#a89f90" strokeWidth="0.8" />

            {/* thrusters */}
            <Rect x="-22" y="26" width="12" height="10" rx="2" fill="#9a9080" />
            <Rect x="10" y="26" width="12" height="10" rx="2" fill="#9a9080" />
        </G>
    );
}

export function SatelliteOnIcon({ size = 24 }) {
    return (
        <Svg
            width={size}
            height={size}
            viewBox="-140 -100 280 200"
        >
            <SatelliteBase size={size} />
        </Svg>
    );
}

export function SatelliteOffIcon({ size = 24, crossColor = '#e8504a' }) {
    return (
        <Svg
            width={size}
            height={size}
            viewBox="-140 -100 280 200"
        >
            <SatelliteBase size={size} />

            {/* cross */}
            <Line
                x1="-110" y1="-80"
                x2="110" y2="80"
                stroke={crossColor}
                strokeWidth="12"
                strokeLinecap="round"
                opacity="0.92"
            />
            <Line
                x1="110" y1="-80"
                x2="-110" y2="80"
                stroke={crossColor}
                strokeWidth="12"
                strokeLinecap="round"
                opacity="0.92"
            />
        </Svg>
    );
}