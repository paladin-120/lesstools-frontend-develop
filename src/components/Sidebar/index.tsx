import { NavLink } from 'react-router-dom';
import { useState, useCallback } from 'react';
import { observer } from 'mobx-react-lite';
import { v4 as uuid } from 'uuid';

import {
  DefaultPairsByNetwork,
  Networks,
  NetworksForSidebar,
  NetworksIcons,
} from '../../config/networks';
import LinkSidebar from './LinkSidebar/index';
import { useMst } from '../../store/store';
import s from './Sidebar.module.scss';
import arrowWhite from '../../assets/img/sections/sidebar/arrow-white.svg';
import logo from '../../assets/img/sections/sidebar/logo.svg';
import board from '../../assets/img/sections/sidebar/board.svg';
// import bot from '../../assets/img/sections/sidebar/bot.svg';
// import botWhite from '../../assets/img/sections/sidebar/bot-white.svg';
import account from '../../assets/img/sections/sidebar/account.svg';
import accountWhite from '../../assets/img/sections/sidebar/account-white.svg';
import live from '../../assets/img/sections/sidebar/live.svg';
import liveWhite from '../../assets/img/sections/sidebar/live-white.svg';
import pair from '../../assets/img/sections/sidebar/pair.svg';
import pairWhite from '../../assets/img/sections/sidebar/pair-white.svg';
import bigSwap from '../../assets/img/sections/sidebar/big-swap.svg';
import bigSwapWhite from '../../assets/img/sections/sidebar/big-swap-white.svg';
// import uniswap from '../../assets/img/sections/sidebar/uniswap.svg';
// import sushiswap from '../../assets/img/sections/sidebar/suchiswap.svg';

const Sidebar: React.FC = observer(() => {
  const { mobileMenu } = useMst();

  const [activeNetworks, setActiveNetworks] = useState<Networks[]>([Networks.Ethereum]);

  const handleChangeActiveNetwork = (network: Networks) => {
    let newNetworks: Networks[] = [...activeNetworks];
    if (activeNetworks.includes(network)) {
      newNetworks = newNetworks.filter((item: Networks) => item !== network);
    } else {
      newNetworks.push(network);
    }
    setActiveNetworks(newNetworks);
  };

  const isActiveNetwork = useCallback(
    (item: Networks) => activeNetworks.includes(item),
    [activeNetworks],
  );

  return (
    <aside className={`${s.sidebar} ${mobileMenu.isActive && s.active} grey-scroll`}>
      <NavLink to="/" className={s.logo}>
        <div className={s.logo_icon}>
          <img src={logo} alt="logo" />
        </div>
        <div className={s.logo_text}>
          less<span>tools</span>
        </div>
      </NavLink>

      <div className={s.subtitle}>LESSBOARD</div>
      <LinkSidebar imgDark={board} imgWhite={board} to="/" text="LessBoard" />

      <div className={s.scroll}>
        {Object.entries(NetworksForSidebar).map((item: any) => {
          const [network, networkName] = item;
          const src = NetworksIcons[network];
          const defaultPair = DefaultPairsByNetwork[network];
          return (
            <div className={s.group} key={uuid()}>
              <div
                className={s.group_title}
                role="button"
                tabIndex={0}
                onClick={() => handleChangeActiveNetwork(network)}
                onKeyDown={() => {}}
              >
                {!mobileMenu.isActive && (
                  <div
                    className={`${s.group_title_arrow} ${
                      isActiveNetwork(network) && s.group_title_arrow_rotated
                    }`}
                  >
                    <img src={arrowWhite} alt="img" />
                  </div>
                )}
                <div className={s.group_title__text}>{networkName}</div>
                {!mobileMenu.isActive && (
                  <div className={s.group_title__icon_wrapped}>
                    {!!src && <img src={src} alt="img" />}
                  </div>
                )}
                <div className={s.group_title__icon}>{!!src && <img src={src} alt="img" />}</div>
              </div>
              {isActiveNetwork(network) && (
                <>
                  <LinkSidebar
                    imgDark={live}
                    imgWhite={liveWhite}
                    to={`/${network.toLowerCase()}/live-new-pairs`}
                    text="Live New Pairs"
                  />
                  <LinkSidebar
                    imgDark={pair}
                    imgWhite={pairWhite}
                    to={`/${network.toLowerCase()}/pair-explorer/${defaultPair}`}
                    text="Pair Explorer"
                  />
                  <LinkSidebar
                    imgDark={bigSwap}
                    imgWhite={bigSwapWhite}
                    to={`/${network.toLowerCase()}/big-swap-explorer`}
                    text="Big Swap Explorer"
                  />
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* <div className={s.group}>
        <div className={s.subtitle}>common</div>
        <LinkSidebar imgDark={bot} imgWhite={botWhite} text="New Pairs Bot" />
      </div> */}
      <div className={s.subtitle}>others</div>
      <LinkSidebar
        to="/user-account"
        imgDark={account}
        imgWhite={accountWhite}
        text="User Account"
      />
    </aside>
  );
});

export default Sidebar;
