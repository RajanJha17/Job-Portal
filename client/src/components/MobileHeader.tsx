import { useRef } from 'react'
import logo from '../static/img/logo-czarne.png'
import MobileMenu from './MobileMenu';


interface MobileHeaderProps {
  back?: string;
  backFunction?: () => void;
  loggedUser?: boolean;
  loggedAgency?: boolean;
  loggedAdmin?: boolean;
  newMessages?: number;
  newNotifications?: number

}


const MobileHeader = ({ back, backFunction, loggedUser, loggedAgency, loggedAdmin, newMessages, newNotifications }: MobileHeaderProps) => {
  const mobileMenu = useRef<HTMLDivElement>(null);
  const handleBack = () => {
    if (backFunction) {
      backFunction();
    }
    else {
      window.location.href = back ? back : '/';
    }
  }

  const openMenu = () => {
    if (mobileMenu?.current?.style) {
      mobileMenu.current.style.left = '0';
    }
  }

  const closeMenu = () => {
    if (mobileMenu?.current?.style) {
      mobileMenu.current.style.left = '100%';
    }
  }

  return (
    <div className='mobileHeader'>
      <a href="." className='mobileHeader__logo'>
        <img src={logo} alt="" />
      </a>
      <div className="mobileMenuWrapper" ref={mobileMenu}>
        <MobileMenu />

      </div>

    </div>
  )
}

export default MobileHeader