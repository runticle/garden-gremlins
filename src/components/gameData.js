const GAME_DATA = {
    // USER DATA
    INITIAL_USER_DATA: {
        BULLET_SPEED: 7, // px / tick
        GUN_SPEED: 3,
        RELOAD_TIME: 200,
        INITIAL_HEALTH: 10, // hits
        GUN_WIDTH: 40,
        GUN_HEIGHT: 75
    },

    // Changable in Menu
    // Sets difficulty

    // which direction is easier / harder? 
    // can i normalise this and use 1-10 with a transform function?
    DEFAULT_SETTINGS: {
        GAME_PULSE: { // smaller is harder
            default: 8,
            max: 15,
            min: 2,
        },
        BULLET_SIZE: { // smaller is harder
            default: 4,
            max: 10,
            min: 2,
        },
        SHIT_SPEED: {
            default: 4, // smaller is harder
            max: 10,
            min: 2,
        },
        SHIT_SIZE: {
            default: 12, // smaller is easier
            max: 20,
            min: 5,
        },
        SHIT_ODDS: { // smaller is easier 
            default: 0.005,
            max: 0.008,
            min: 0.001,
        },
        BIRD_SPEED_MULTIPLIER: {
            default: 1,
            max: 10,
            min: 0,
        },
        BIRD_SIZE_MULTIPLIER: {
            default: 1,
            max: 10,
            min: 0,
        },
    },


    // GAME DATA
    BIRD_HEIGHT: 40,
    BIRD_WIDTH: 40, // px. Only green bird. Tricky in future.
    // SHIT_ODDS: 0.005,
    MAX_GUN_POSITION: 300,

    INITIAL_GUN_POSITION: {
        x: 480,
        y: 0,
        last: null
    }
}

export default GAME_DATA