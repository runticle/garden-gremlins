import Bird from "@/components/Bird"
import Bullet from "@/components/Bullet"
import Gun from "@/components/Gun"
import generateLevel0 from "@/components/levelBuilder"
import useEventListener from "@/utils/useEventListener"
import { useState, useEffect, useCallback, useMemo } from "react"
import { BirdCage, GameContainer, InfoBar } from "./styles"

import debounce from 'lodash.debounce'

import GAME_DATA from "./gameData"
import Shit from "./Shit"
import HealthBar from "./HealthBar"
import Paused from "./Paused"
import Settings from "./Menu/Settings"
import Menu from "./Menu"
import useLocalStorage from "@/utils/useLocalStorage"

const GAME_STATUS = {
    INITIALISING: 'INITIALISING', // only on startup.
    MENU: 'MENU', // new game menu / between levels / end game
    LIVE: 'LIVE',
    PAUSED: 'PAUSED',
}

export default function TheBirds() {
    // editable by upgrades
    const [userData, updateUserData] = useState({})
    // editable in settings
    // default difficulty
    const [difficulty, updateDifficulty] = useLocalStorage('difficulty', GAME_DATA.DIFFICULTY_PRESETS.HARD)
    const [settings, updateSettings] = useState({})
    // editable by gameplay (stores health/kills etc) (waveIndex, paths etc eventually)
    const [gameData, updateGameData] = useState({})

    // to be moved into gameData
    const [kills, addKill] = useState(0)
    const [playerHealth, editHealth] = useState(userData.INITIAL_HEALTH)


    // paths, maybe to be moved in
    const [gunPosition, moveGun] = useState(GAME_DATA.INITIAL_GUN_POSITION)
    const [waveIndex, setWaveIndex] = useState(0)
    const [wave, setNewWave] = useState([])
    const [birdPaths, setBirdPaths] = useState(null)
    const [bulletPositions, progressBullets] = useState([])
    const [shitPositions, progressBirdShit] = useState([])

    // keep as exclusive
    const [showSettings, setShowSettings] = useState(false)
    const [gameStatus, updateGameStatus] = useState(GAME_STATUS.INITIALISING)
    const [timerPaused, toggleTimer] = useState(true)
    const [gameStep, progressGameStep] = useState(0)
    const [buttonsDown, changeButtonStatus] = useState({
        up: false,
        down: false,
        right: false,
        left: false,
    })

    const birdShit = (position) => {
        progressBirdShit(prevShitPositions => ([...prevShitPositions, position]))
    }

    const updateBirdShit = useCallback(() => {
        const newShitPositions = []

        shitPositions.forEach(bullet => {
            if (bullet.y > 1100 - gunPosition.y) return
            const newPosition = {
                x: bullet.x,
                y: bullet.y + settings.SHIT_SPEED,
            }

            newShitPositions.push(newPosition)
        })

        progressBirdShit(newShitPositions)
    }, [shitPositions, progressBirdShit, gunPosition, settings])

    const updateBulletPositions = useCallback(() => {
        const newBulletPositions = []

        bulletPositions.forEach(bullet => {
            if (bullet.y > 950) return
            const newPosition = {
                x: bullet.x,
                y: bullet.y + userData.BULLET_SPEED,
            }

            newBulletPositions.push(newPosition)
        })

        progressBullets(newBulletPositions)
    }, [progressBullets, userData, bulletPositions])

    const killbird = useCallback((birdIndex, bulletIndex) => {
        const leftoverBullets = bulletPositions.filter((_, index) => index !== bulletIndex)
        progressBullets(leftoverBullets)

        // this might be very inefficent 
        // could just set the bird to null?
        const leftoverBirds = wave.filter((_, index) => index !== birdIndex)
        setNewWave(leftoverBirds)

        addKill(prevKills => prevKills + 1)
    }, [bulletPositions, wave])

    const playerHit = useCallback((shitIndex) => {
        // damage player
        editHealth(prevHealth => prevHealth - 1)

        const leftoverShit = shitPositions.filter((_, index) => index !== shitIndex)
        progressBirdShit(leftoverShit)
    }, [shitPositions])

    const checkForCollisions = useCallback(() => {
        for (const [birdIndex, bird] of wave.entries()) {

            // this is undefined when the game ends. why?
            const bird_x = bird[gameStep].x;
            const bird_y = bird[gameStep].y;

            // checking bullets hitting birds...
            for (const [bulletIndex, bullet] of bulletPositions.entries()) {
                if (bird_y > 1000 - bullet.y) continue // bullet not reached yet
                if (bird_y < 1000 - bullet.y - settings.BULLET_SIZE - GAME_DATA.BIRD_HEIGHT) continue // bullet gone past
                if (bullet.x + settings.BULLET_SIZE < bird_x) continue
                if (bullet.x > bird_x + GAME_DATA.BIRD_WIDTH) continue

                killbird(birdIndex, bulletIndex)
            }
        }

        // checking shit hitting player
        for (const [shitIndex, shit] of shitPositions.entries()) {
            const shit_x = shit.x;
            const shit_y = shit.y;

            if (
                gunPosition.x + userData.GUN_WIDTH > shit_x // gunPosition width
                && gunPosition.x < shit_x + settings.SHIT_SIZE // bird width
                && shit_y > 1000 - gunPosition.y - settings.SHIT_SIZE - userData.GUN_HEIGHT
                && shit_y < 1000 - gunPosition.y
            ) {
                playerHit(shitIndex)
            }

        }


    }, [bulletPositions, wave, killbird, settings, gameStep, shitPositions, gunPosition, playerHit, userData])

    const updateGunPosition = useCallback(() => {
        moveGun(prevGunPosition => {
            const { left, right, up, down, last } = buttonsDown;

            let newX = prevGunPosition.x
            let newY = prevGunPosition.y

            if (left && (!last || last === 'LEFT')) newX = Math.max(0, prevGunPosition.x - userData.GUN_SPEED);
            if (right && (!last || last === 'RIGHT')) newX = Math.min(1000, prevGunPosition.x + userData.GUN_SPEED);
            if (up) newY = Math.min(GAME_DATA.MAX_GUN_POSITION, prevGunPosition.y + userData.GUN_SPEED)
            if (down) newY = Math.max(0, prevGunPosition.y - userData.GUN_SPEED)

            return {
                x: newX,
                y: newY
            }
        })
    }, [buttonsDown, userData])

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const updateGameStep = useCallback(() => {
        // progress game step
        progressGameStep(prevGameStep => prevGameStep + 1)

        // move bullets
        updateBulletPositions(bulletPositions)

        // check for any shit
        updateBirdShit(shitPositions)

        // check for any collisions
        checkForCollisions()

        // move the gun if necessary
        updateGunPosition()
    }, [bulletPositions, progressGameStep, checkForCollisions, updateBulletPositions, updateGunPosition, shitPositions, updateBirdShit])

    // const fireBullet = useCallback(debounce(console.log, 1000), []);

    const fireBullet = useCallback((position) => progressBullets(prevBulletPositions => ([...prevBulletPositions, position])), [progressBullets])
    const pullTrigger = useMemo(() => debounce(fireBullet, userData.RELOAD_TIME, { leading: true }), [fireBullet, userData])

    const handleKeypress = useCallback((event) => {
        switch (event.charCode) {
            // spacebar is a bulleta
            case 32:
                // and we need to throw a bullet into the mixer
                const position = { x: gunPosition.x + (userData.GUN_WIDTH / 2) - (settings.BULLET_SIZE / 2), y: gunPosition.y + userData.GUN_HEIGHT / 2 }
                pullTrigger(position)
                // progressBullets(prevBulletPositions => ([...prevBulletPositions, position]))
                break;
            case 97: // left (a)
                changeButtonStatus(prevStatus => ({
                    ...prevStatus,
                    left: true,
                    last: 'LEFT'
                }))
                break
            case 100: // right (d)
                changeButtonStatus(prevStatus => ({
                    ...prevStatus,
                    right: true,
                    last: 'RIGHT'
                }))
                break
            case 119: // up (w)
                changeButtonStatus(prevStatus => ({
                    ...prevStatus,
                    up: true
                }))
                break
            case 115: // down (s)
                changeButtonStatus(prevStatus => ({
                    ...prevStatus,
                    down: true,
                }))
                break
        }
    }, [gunPosition, changeButtonStatus, settings, userData, pullTrigger])

    const handleKeyUp = useCallback((event) => {
        // TODO store codes in variables 
        switch (event.code) {
            case 'KeyA': // left (a)
                changeButtonStatus(prevStatus => ({
                    ...prevStatus,
                    left: false,
                    last: prevStatus.last === 'LEFT' ? null : prevStatus.last
                }))
                break
            case 'KeyD': // right (d)
                changeButtonStatus(prevStatus => ({
                    ...prevStatus,
                    right: false,
                    last: prevStatus.last === 'RIGHT' ? null : prevStatus.last
                }))
                break
            case 'KeyW': // up (w)
                changeButtonStatus(prevStatus => ({
                    ...prevStatus,
                    up: false,
                }))
                break
            case 'KeyS': // down (s)
                changeButtonStatus(prevStatus => ({
                    ...prevStatus,
                    down: false
                }))
                break
        }
    }, [changeButtonStatus])

    useEventListener('keypress', handleKeypress)
    useEventListener('keyup', handleKeyUp)


    const generateLevel = () => {
        console.time('Generating Level 0')
        const data = generateLevel0()
        console.timeEnd('Generating Level 0')

        // set predetermined bird paths
        setBirdPaths(data)
    }

    const togglePause = useCallback(() => {
        toggleTimer(prevTimer => !prevTimer)
        updateGameStatus(prevGameStatus => prevGameStatus === GAME_STATUS.LIVE ? GAME_STATUS.PAUSED : GAME_STATUS.LIVE)

    }, [])

    const initialiseLevel = useCallback((level = 0) => {
        // clear path finders (bullets, shit, birds)
        setBirdPaths([])
        setNewWave([])
        progressBullets([])

        // reset gun position
        moveGun(GAME_DATA.INITIAL_GUN_POSITION)

        // reset counters (level, health, kills)
        addKill(0)
        progressGameStep(0)
        setWaveIndex(0)
        editHealth(userData.INITIAL_HEALTH)

        // generate level (0 default)
        generateLevel()

        // set game status ready
        updateGameStatus(GAME_STATUS.MENU)
    }, [userData])

    const newSettingValue = (key, val) => {
        const setting = GAME_DATA.DEFAULT_SETTINGS[key]
        if (!setting) {
            console.error(`Could not find setting object "${key}. Abort.`)
            return
        }
        const { max, min } = setting;
        return (val * ((max - min) / 10)) + min
    }

    const setupSettings = useCallback(() => {
        const newSettings = {}

        // transforms difficulty object into settings
        for (const [option, value] of Object.entries(difficulty)) {
            newSettings[option] = newSettingValue(option, value)
        }

        updateSettings(newSettings)

    }, [difficulty])

    const closeSettings = () => {
        setupSettings()
        setShowSettings(false)
    }

    const startLevel = useCallback(async () => {
        await toggleTimer(false)
        await updateGameStatus(GAME_STATUS.LIVE)
    }, [])

    const initialiseGame = useCallback(() => {
        // setup userData
        updateUserData(GAME_DATA.INITIAL_USER_DATA)
        // setup settings
        setupSettings()

        // initilise level 0
        initialiseLevel(0)
    }, [initialiseLevel, setupSettings])

    useEffect(() => {
        if (gameStatus === GAME_STATUS.NEW_GAME) return;

        // I think we will have a switch statement here with the GAME_STATUS.
        // we need to initialise when first starting
        // if we menu => new game, don't reinitialise (or we lose saved settings)
        //  so we need like 'Uninitialised' 

        let interval

        switch (gameStatus) {
            case GAME_STATUS.INITIALISING:
                initialiseGame();
                // setup game
                break;
            case GAME_STATUS.LIVE:
                interval = setInterval(() => {
                    if (timerPaused) return () => clearInterval(interval);
                    updateGameStep()
                }, settings.GAME_PULSE);

                if (playerHealth < 0) {
                    // move this to update health function.
                    updateGameStatus(GAME_STATUS.MENU)
                    clearInterval(interval)
                }

                // if wave is finished, need a new wave until no waves
                if (wave.length === 0) {
                    const newWave = birdPaths[waveIndex]

                    if (newWave) {
                        setNewWave(birdPaths[waveIndex])

                        progressGameStep(0)
                        setWaveIndex(prevWaveIndex => prevWaveIndex + 1)
                    } else {
                        updateGameStatus(GAME_STATUS.MENU)
                        clearInterval(interval)
                    }
                }

                break;
            case GAME_STATUS.PAUSED:
            case GAME_STATUS.MENU:
                return clearInterval(interval)

        }

        // cleanup interval to stop a billion of them running concurrently
        return () => {
            clearInterval(interval)
        }
    }, [updateGameStep, timerPaused, gameStep, wave, birdPaths, waveIndex, playerHealth, gameStatus, settings, initialiseGame]);


    if ([GAME_STATUS.INITIALISING].includes(gameStatus)) return <div>
        Loading...
    </div>

    return (
        <GameContainer>
            <Settings show={showSettings} difficulty={difficulty} onSave={closeSettings} updateDifficulty={updateDifficulty} />
            {
                gameStatus === GAME_STATUS.MENU && <Menu newGame={initialiseGame} health={playerHealth} kills={kills} level={0} startGame={startLevel} openSettings={() => setShowSettings(prev => !prev)} />
            }
            {
                [GAME_STATUS.LIVE, GAME_STATUS.PAUSED].includes(gameStatus) && <BirdCage>
                    {
                        wave.map((bird, index) => (
                            <Bird birdShit={birdShit} key={index} positionMap={bird} gameStep={gameStep} index={index} />
                        ))
                    }
                    {
                        bulletPositions.map((bullet, index) => (
                            <Bullet key={index} position={bullet} settings={settings} />
                        ))
                    }
                    {
                        shitPositions.map((shit, index) => (
                            <Shit key={index} position={shit} settings={settings} />
                        ))
                    }
                    <Gun position={gunPosition} userData={userData} />
                    {gameStatus === GAME_STATUS.PAUSED && <Paused newGame={initialiseGame} resume={togglePause} />}
                </BirdCage>
            }
            {
                ![GAME_STATUS.NEW_GAME, GAME_STATUS.LEVEL_COMPLETE].includes(gameStatus) &&
                <InfoBar>
                    <div>
                        <button onClick={togglePause}>
                            Menu
                        </button>
                    </div>
                    <p>
                        Kills: {kills}
                    </p>
                    <HealthBar playerHealth={playerHealth} />
                </InfoBar>
            }
        </GameContainer >
    )
}