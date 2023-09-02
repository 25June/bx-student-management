import SvgIcon from '@mui/material/SvgIcon'
import { ReactComponent as CatholicStudentIcon } from 'static/images/cards/thieu-nhi.svg'

const StudentIcon = ({ color }: { color: any }) => {
    return (
        <SvgIcon color={color} component={CatholicStudentIcon} inheritViewBox={true} />
    )
}

export default StudentIcon