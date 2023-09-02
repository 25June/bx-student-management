import SvgIcon from '@mui/material/SvgIcon'
import { ReactComponent as Apostles } from 'static/images/cards/apostles.svg'

const ApostlesIcon = ({ color }: { color: any }) => {
    return (
        <SvgIcon color={color} component={Apostles} inheritViewBox={true} />
    )
}

export default ApostlesIcon