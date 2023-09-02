import SvgIcon from '@mui/material/SvgIcon'
import { ReactComponent as HolyGrail } from 'static/images/cards/chen-thanh.svg'

const HolyGrailIcon = ({ color }: { color: any }) => {
    return (
        <SvgIcon color={color} component={HolyGrail} inheritViewBox={true} />
    )
}

export default HolyGrailIcon