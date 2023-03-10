import toPixel from "@/utils/toPixel";
import styled from "styled-components"
import GAME_DATA from "./gameData";


const GunSprite = styled.div`
    position: absolute;
    bottom: 0;

    background-image: url('/images/thebirds/apollo13.png');
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;

    border-radius: 50%;

    z-index: 500;
`

export default function Gun({ position, userData }) {
    const { x, y } = position

    const { GUN_WIDTH, GUN_HEIGHT } = userData;

    const width = toPixel(GUN_WIDTH)
    const height = toPixel(GUN_HEIGHT)

    const left = toPixel(x)
    const bottom = toPixel(y)

    return <GunSprite style={{ left, bottom, width, height }} />
}