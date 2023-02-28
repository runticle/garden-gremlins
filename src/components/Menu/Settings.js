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
                        return <Editor max={20} key={index} current={13}>
                            <span>{key.replace('_', ' ')}:{difficulty[key]}</span>
                            <div className="toggles">
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
                <div className="presets">
                    <button onClick={() => updateDifficulty(GAME_DATA.DIFFICULTY_PRESETS.EASY)}>
                        Easy
                    </button>
                    <button onClick={() => updateDifficulty(GAME_DATA.DIFFICULTY_PRESETS.HARD)}>
                        Hard
                    </button>
                    <button onClick={() => updateDifficulty(GAME_DATA.DIFFICULTY_PRESETS.HMM)}>
                        hmmm
                    </button>
                </div>
                <button onClick={onSave}>
                    Save & Close
                </button>
            </InnerGameBox>
        </GameBox >
    )
}