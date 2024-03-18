import SvgIcon from '@mui/material/SvgIcon'
import { SxProps, Theme } from '@mui/material'
import { ReactComponent as HolyGrail } from 'static/images/cards/chen-thanh.svg'

const HolyGrailIcon = ({ color, styles = {} }: { color: any; styles?: SxProps<Theme> }) => {
  return <SvgIcon sx={styles} color={color} component={HolyGrail} inheritViewBox={true} />
}

export default HolyGrailIcon
