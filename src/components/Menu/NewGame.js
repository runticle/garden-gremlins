import { GameBox, InnerGameBox } from "../styles";


export default function NewGame({ startGame, openSettings }) {
    return (
        <GameBox>
            <InnerGameBox>
                <div>
                    <h1>
                        NEW GAME
                    </h1>
                    <h3>
                        Controls
                    </h3>
                    <p>
                        move: w/a/s/d
                    </p>
                    <p>
                        shoot: space
                    </p>
                    <p>
                        <button onClick={startGame}>
                            Start Game
                        </button>
                    </p>
                    <p>
                        <button onClick={openSettings}>
                            Settings
                        </button>
                    </p>
                </div>
            </InnerGameBox>
        </GameBox>
    )
}