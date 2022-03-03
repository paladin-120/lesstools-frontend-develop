import { Link } from 'react-router-dom';

import s from './Footer.module.scss';

import twitter from '../../assets/img/icons/twitter.svg';
import telegram from '../../assets/img/icons/telegram.svg';
import github from '../../assets/img/icons/github.svg';
import medium from '../../assets/img/icons/medium.svg';
import logo from '../../assets/img/icons/logo.svg';

const Footer: React.FC = () => {
  return (
    <footer className={s.footer}>
      <div className={s.container}>
        <div className={s.inner}>
          <div className={s.info}>
            <div className={s.info_text}>2021 © LessTools a product of Less Network — less.xyz</div>
            {/* <div className={s.links}>
              <div className={s.link}>Pools</div>
              <div className={s.link}>Voting</div>
              <div className={s.link}>Liquidity Mining</div>
              <div className={s.link}>Stats</div>
              <div className={s.link}>Staking</div>
            </div> */}
            <div className={s.social_links}>
              <a
                href="https://twitter.com/LessToken"
                rel="noreferrer"
                target="_blank"
                className={s.social_link}
              >
                <img src={twitter} alt="twitter" />
              </a>
              <a
                href="https://less-token.medium.com/"
                rel="noreferrer"
                target="_blank"
                className={s.social_link}
              >
                <img src={medium} alt="medium" />
              </a>
              <a
                href="https://t.me/lesstokenann"
                rel="noreferrer"
                target="_blank"
                className={s.social_link}
              >
                <img src={telegram} alt="telegram" />
              </a>
              <a
                href="https://github.com/LESS-xyz"
                rel="noreferrer"
                target="_blank"
                className={s.social_link}
              >
                <img src={github} alt="github" />
              </a>
            </div>
            <div className={s.line} />
            <Link to="/" className={s.logo}>
              <img src={logo} alt="logo" />
              <div>less</div>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
