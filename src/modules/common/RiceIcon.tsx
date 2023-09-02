import SvgIcon from '@mui/material/SvgIcon'
import { ReactComponent as Rice } from 'static/images/cards/lua.svg'

const RiceIcon = ({ color }: { color?: any }) => {
    return (
        <SvgIcon color={color} component={Rice} inheritViewBox={true} />
    )
}

export default RiceIcon