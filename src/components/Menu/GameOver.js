import { GameBox, InnerGameBox } from "../styles"

export default function GameOver({ kills, newGame }) {

    return (
        <GameBox>
            <InnerGameBox>
                <div>
                    <h1>
                        GAME OVER
                    </h1>
                    <div>
                        You were killed by bird poop.
                    </div>
                    <p>
                        Level: 1
                    </p>
                    <p>
                        Kills: {kills}
                    </p>
                    <button onClick={newGame}>
                        Try Again
                    </button>
                </div>
            </InnerGameBox>
        </GameBox>
    )
}