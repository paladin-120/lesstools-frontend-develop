import React from 'react';
import { Link } from 'react-router-dom';

import { useMst } from '../../store/store';

import s from './MobileHeader.module.scss';

import { ReactComponent as Logo } from '../../assets/img/icons/logo.svg';

const MobileHeader: React.FC = () => {
  const { mobileMenu } = useMst();

  return (
    <div className={s.header}>
      <button
        onClick={() => mobileMenu.toogleMobileMenu()}
        type="button"
        className={`${s.burger} ${mobileMenu.isActive && s.active}`}
      >
        <div className={s.burger_line} />
        <div className={s.burger_line} />
        <div className={s.burger_line} />
      </button>
      <Link to="/" className={s.logo} onClick={() => mobileMenu.setMobileMenu(false)}>
        <div className={s.logo_icon}>
          <Logo width="20px" height="23px" />
        </div>
        <div className={s.logo_text}>
          less<span>tools</span>
        </div>
      </Link>
      <div />
    </div>
  );
};

export default MobileHeader;
