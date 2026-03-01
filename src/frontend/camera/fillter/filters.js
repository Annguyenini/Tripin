export const FILTERS = {
    none: null,

    // Clear blue skies and ocean
    ocean: [
        0.8, 0.1, 0.2, 0,  0.0,
        0.1, 1.0, 0.2, 0,  0.05,
        0.1, 0.2, 1.4, 0,  0.1,
        0,   0,   0,   1,  0,
    ],

    // Golden hour desert/beach
    golden_hour: [
        1.4, 0.2, 0.0, 0,  0.1,
        0.1, 1.0, 0.0, 0,  0.0,
        0.0, 0.0, 0.7, 0, -0.1,
        0,   0,   0,   1,  0,
    ],

    // Lush tropical jungle
    tropical: [
        0.8, 0.1, 0.0, 0,  0.0,
        0.0, 1.4, 0.1, 0,  0.1,
        0.0, 0.1, 0.9, 0,  0.0,
        0,   0,   0,   1,  0,
    ],

    // Dusty desert sand tones
    sahara: [
        1.3, 0.2, 0.0, 0,  0.1,
        0.1, 1.1, 0.0, 0,  0.05,
        0.0, 0.1, 0.7, 0, -0.1,
        0,   0,   0,   1,  0,
    ],

    // Moody rainy city streets
    city_rain: [
        0.9, 0.0, 0.1, 0, -0.05,
        0.0, 0.9, 0.1, 0, -0.05,
        0.1, 0.1, 1.2, 0,  0.05,
        0,   0,   0,   1,  0,
    ],

    // Snowy mountain cold
    alpine: [
        0.9, 0.1, 0.2, 0,  0.1,
        0.1, 1.0, 0.2, 0,  0.1,
        0.2, 0.2, 1.3, 0,  0.15,
        0,   0,   0,   1,  0,
    ],

    // Cherry blossom japan spring
    sakura: [
        1.2, 0.1, 0.1, 0,  0.1,
        0.0, 1.0, 0.1, 0,  0.05,
        0.1, 0.0, 1.0, 0,  0.05,
        0,   0,   0,   1,  0,
    ],

    // Old european town film
    euro_film: [
        1.1, 0.1, 0.0, 0,  0.05,
        0.1, 1.0, 0.1, 0,  0.0,
        0.0, 0.1, 0.8, 0, -0.05,
        0,   0,   0,   1,  0,
    ],

    // Night city neon lights
    neon_night: [
        1.1, 0.0, 0.2, 0, -0.1,
        0.0, 0.9, 0.2, 0, -0.1,
        0.2, 0.0, 1.3, 0, -0.05,
        0,   0,   0,   1,  0,
    ],

    // Bright airy tropical beach
    paradise: [
        1.1, 0.1, 0.1, 0,  0.1,
        0.1, 1.2, 0.1, 0,  0.1,
        0.1, 0.2, 1.2, 0,  0.15,
        0,   0,   0,   1,  0,
    ],
}

export const applyIntensity = (filterMatrix, intensity = 1) => {
    if (!filterMatrix) return null
    const identity = [1,0,0,0,0, 0,1,0,0,0, 0,0,1,0,0, 0,0,0,1,0]
    return filterMatrix.map((value, index) => {
        return identity[index] + (value - identity[index]) * intensity
    })
}