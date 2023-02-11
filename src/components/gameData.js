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
        GAME_PULSE: {
            default: 8,
            max: 10,
            min: 0,
            step: 1,

        },
        BULLET_SIZE: {
            default: 4,
            max: 10,
            min: 0,
        },
        SHIT_SPEED: {
            default: 4,
            max: 10,
            min: 0,
        },
        SHIT_SIZE: {
            default: 12,
            max: 10,
            min: 0,
        },
        SHIT_ODDS: {
            default: 0.005,
            max: 10,
            min: 0,
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