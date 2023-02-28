import GameOver from "./GameOver";
import LevelComplete from "./LevelComplete";
import GameEnd from "./LevelComplete";
import NewGame from "./NewGame";

export default function Menu({ newGame, health, kills, level = 0, startGame, openSettings }) {

    if (health <= 0) return <GameOver kills={kills} newGame={newGame} />

    if (level === 0) return <NewGame startGame={startGame} openSettings={openSettings} />

    return <LevelComplete level={level} kills={kills} newGame={newGame} />
}