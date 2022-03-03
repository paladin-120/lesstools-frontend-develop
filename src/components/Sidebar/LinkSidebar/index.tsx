import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

import { useMst } from '../../../store/store';

import s from '../Sidebar.module.scss';

interface ILinkProps {
  imgDark: string;
  imgWhite: string;
  text: string;
  to?: string;
}

const LinkSidebar: React.FC<ILinkProps> = ({ imgDark, text, imgWhite, to }) => {
  const [isHover, setIsHover] = useState(false);
  const loc = useLocation();
  const { mobileMenu } = useMst();

  useEffect(() => {
    if (
      to &&
      loc.pathname.split('/').slice(0, 3).join('/') === to.split('/').slice(0, 3).join('/')
    ) {
      setIsHover(true);
    } else setIsHover(false);
  }, [loc, to]);

  if (to)
    return (
      <NavLink
        activeClassName={s.link_active}
        exact
        isActive={() =>
          loc.pathname.split('/').slice(0, 3).join('/') === to.split('/').slice(0, 3).join('/')
        }
        to={to}
        onClick={() => mobileMenu.setMobileMenu(false)}
      >
        <div
          className={s.link}
          onBlur={() =>
            setIsHover(
              loc.pathname.split('/').slice(0, 3).join('/') === to.split('/').slice(0, 3).join('/'),
            )
          }
          onMouseOut={() =>
            setIsHover(
              loc.pathname.split('/').slice(0, 3).join('/') === to.split('/').slice(0, 3).join('/'),
            )
          }
          onFocus={() => setIsHover(true)}
          onMouseOver={() => setIsHover(true)}
        >
          <div className={s.link_img}>
            <img src={isHover ? imgWhite : imgDark} alt="img" />
          </div>
          <div className={s.link_text}>{text}</div>
        </div>
      </NavLink>
    );

  return (
    <div
      className={s.link}
      onBlur={() => setIsHover(false)}
      onMouseOut={() => setIsHover(false)}
      onFocus={() => setIsHover(true)}
      onMouseOver={() => setIsHover(true)}
    >
      <div className={s.link_img}>
        <img src={isHover ? imgWhite : imgDark} alt="img" />
      </div>
      <div className={s.link_text}>{text}</div>
    </div>
  );
};

export default LinkSidebar;
