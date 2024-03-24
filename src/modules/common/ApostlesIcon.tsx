import SvgIcon from '@mui/material/SvgIcon'
import { SxProps, Theme } from '@mui/material'
import { ReactComponent as Apostles } from 'static/images/cards/apostles.svg'

const ApostlesIcon = ({ color, styles = {} }: { color: any; styles?: SxProps<Theme> }) => {
  return <SvgIcon sx={styles} color={color} component={Apostles} inheritViewBox={true} />
}

export default ApostlesIcon
