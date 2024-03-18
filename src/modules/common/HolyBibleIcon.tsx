import SvgIcon from '@mui/material/SvgIcon'
import { SxProps, Theme } from '@mui/material'
import { ReactComponent as HolyBible } from 'static/images/cards/sach-thanh.svg'

const HolyBibleIcon = ({ color, styles = {} }: { color: any; styles?: SxProps<Theme> }) => {
  return <SvgIcon sx={styles} color={color} component={HolyBible} inheritViewBox={true} />
}

export default HolyBibleIcon
