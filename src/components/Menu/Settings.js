import styled from "styled-components"
import GAME_DATA from "../gameData"
import { GameBox, InnerGameBox } from "../styles"

const Editor = styled.div`
    width: 100%;
    /* height: 20px; */
    position: relative;

    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    
    
    .toggles {
        display: flex;
        flex-direction: row;   
        align-items: center;
    }

`

const Bar = styled.div`
    /* ${props => props.flip ? 'scaleX(-1)' : 'null'}; */

    width: 300px;
    opacity: 0.9;
    background:#fce8a4;
    height: 50px;
    border-radius: 5px;
    margin-right: 10px;

    position: relative;

    &:before{
        content: '';
        right: ${props => (100 - props.value * 10) + '%'};
        /* right: 50px; */
        position: absolute;
        height: 100%;
        left: 0;
        background: linear-gradient(to right, #eab70e, brown);
        transition: all 1s ease;
    }
`



export default function Settings({ difficulty = {}, updateDifficulty, onSave, show }) {

    if (!show) return null

    return (
        <GameBox style={{ zIndex: 9999 }}>
            <InnerGameBox>
                <h2>
                    Settings
                </h2>
                <div className="editors">
                    {Object.keys(GAME_DATA.DEFAULT_SETTINGS).map((key, index) => {
                        return <Editor key={index}>
                            <span>{key.replace('_', ' ')}</span>
                            <div className="toggles">
                                <Bar value={difficulty[key]} />
                                <button onClick={() => updateDifficulty(prev => ({
                                    ...prev,
                                    [key]: Math.max(1, difficulty[key] - 1)
                                }))}>
                                    -
                                </button>
                                <button onClick={() => updateDifficulty(prev => ({
                                    ...prev,
                                    [key]: Math.min(difficulty[key] + 1, 10)
                                }))}>
                                    +
                                </button>
                            </div>
                        </Editor>
                    })}
                </div>
                <p className="presets">
                    <button onClick={() => updateDifficulty(GAME_DATA.DIFFICULTY_PRESETS.EASY)}>
                        Easy
                    </button>
                    <button onClick={() => updateDifficulty(GAME_DATA.DIFFICULTY_PRESETS.HARD)}>
                        Hard
                    </button>
                    <button onClick={() => updateDifficulty(GAME_DATA.DIFFICULTY_PRESETS.HMM)}>
                        hmmm
                    </button>
                </p>
                <p>
                    <button onClick={onSave}>
                        Save & Close
                    </button>
                </p>
            </InnerGameBox>
        </GameBox >
    )
}