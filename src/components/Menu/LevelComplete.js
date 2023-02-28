import { GameBox, InnerGameBox } from "../styles"

export default function LevelComplete({ kills, newGame, level }) {

    return (
        <GameBox>
            <InnerGameBox>
                <div>
                    <h1>
                        LEVEL {level + 1} COMPLETED
                    </h1>
                    <p>
                        Kills: {kills}
                    </p>
                    <p>
                        <button onClick={() => window.alert('Coming soon!')}>
                            Next Level
                        </button>
                    </p>
                    <button onClick={newGame}>
                        New Game
                    </button>
                </div>
            </InnerGameBox>
        </GameBox>
    )
}