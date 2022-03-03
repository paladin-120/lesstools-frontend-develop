import s from './Partner.module.scss';

import logo from '../../../assets/img/sections/board-page/partner-logo-example.png';
import homeLink from '../../../assets/img/sections/board-page/partner-link-home.svg';
import twitterLink from '../../../assets/img/sections/board-page/partner-link-twitter.svg';
import telegramLink from '../../../assets/img/sections/board-page/partner-link-telegram.svg';
import compass from '../../../assets/img/sections/board-page/compass.svg';

const Partner: React.FC = () => {
  return (
    <section className={s.partner}>
      <div className={s.partner_logo}>
        <img src={logo} alt="logo" />
      </div>
      <div>
        <div className={s.partner_token}>
          <div className={s.partner_token__name}>BMW</div>
          <div className={s.partner_token__links}>
            <div className={s.partner_token__link}>
              <img src={compass} alt="compass" />
            </div>
          </div>
        </div>
        <div className={s.partner_info}>
          <div className={s.partner_info__name}>KwikSwap</div>
          <div className={s.partner_info__links}>
            <div className={s.partner_info__link}>
              <img src={homeLink} alt="homeLink" />
            </div>
            <div className={s.partner_info__link}>
              <img src={twitterLink} alt="twitterLink" />
            </div>
            <div className={s.partner_info__link}>
              <img src={telegramLink} alt="telegramLink" />
            </div>
          </div>
        </div>
        <div className={s.partner_description}>Multi-Chain Decentralised Swap Exchange Protocol</div>
      </div>
    </section>
  );
};

export default Partner;
