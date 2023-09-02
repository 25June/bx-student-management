import SvgIcon from '@mui/material/SvgIcon'
import { ReactComponent as Candle } from 'static/images/cards/candle.svg'

const CandleIcon = ({ color }: { color: any }) => {
    return (
        <SvgIcon color={color} component={Candle} inheritViewBox={true} />
    )
}

export default CandleIcon