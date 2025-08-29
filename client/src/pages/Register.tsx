import { useEffect, useState } from 'react'
import background from '../static/img/register-background.png'
import MobileHeader from '../components/MobileHeader';


const Register = () => {
    const [dropdownRoleVisible, setDropdownRoleVisible] = useState(false);
    const [role, setRole] = useState(0);

    useEffect(() => {
        setDropdownRoleVisible(false);
    }, [role]);

    const dropdownRole = () => {
        setDropdownRoleVisible(!dropdownRoleVisible);
    }

  return (
    <div className='container container--register center' onClick={() => { setDropdownRoleVisible(false); }}>
        <img src={background} alt="register" className='registerImg' />
        <MobileHeader back="/" />
    </div>
  )
}

export default Register