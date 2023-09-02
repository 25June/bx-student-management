import SvgIcon from '@mui/material/SvgIcon'
import { ReactComponent as Bell } from 'static/images/cards/bell.svg'

const BellIcon = ({ color }: { color: any }) => {
    return (
        <SvgIcon color={color} component={Bell} inheritViewBox={true} />
    )
}

export default BellIcon