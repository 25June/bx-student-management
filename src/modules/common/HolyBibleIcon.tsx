import SvgIcon from '@mui/material/SvgIcon'
import { ReactComponent as HolyBible } from 'static/images/cards/sach-thanh.svg'

const HolyBibleIcon = ({ color }: { color: any }) => {
    return (
        <SvgIcon color={color} component={HolyBible} inheritViewBox={true} />
    )
}

export default HolyBibleIcon