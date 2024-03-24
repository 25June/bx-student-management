import SvgIcon from '@mui/material/SvgIcon'
import { ReactComponent as ChienConIcon } from 'static/images/cards/chien-con-no-white-bg.svg'

const SheepIcon = ({ color }: { color: any }) => {
  return <SvgIcon color={color} component={ChienConIcon} inheritViewBox={true} />
}

export default SheepIcon
