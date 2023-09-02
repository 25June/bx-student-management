import SvgIcon from '@mui/material/SvgIcon'
import { ReactComponent as Pray } from 'static/images/cards/pray.svg'

const PrayIcon = ({ color }: { color: any }) => {
    return (
        <SvgIcon color={color} component={Pray} inheritViewBox={true} />
    )
}

export default PrayIcon