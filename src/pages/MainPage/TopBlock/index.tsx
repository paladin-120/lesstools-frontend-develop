import Button from '../../../components/Button/index';

import { ReactComponent as Logo } from '../../../assets/img/icons/logo.svg';

import s from './TopBlock.module.scss';

const TopBlock: React.FC = () => {
  return (
    <section className={s.block}>
      <div className={s.bg_wrap}>
        <div className={s.header}>
          <Logo />
          <div className={s.header__title}>
            less<span>tools</span>
          </div>
        </div>
        <div className={s.container}>
          <div className={s.inner}>
            <div className={s.title}>
              BOOST YOUR EXCHANGE <br /> EXPERIENCE
            </div>
            <div className={s.subtitle}>
              Real-time data analysis at the tips of your fingers: Create unique trading strategies,
              anticipate market movements, search for big spreads, track and copy the most
              profitable wallets and much more. Based on <span>UNISWAP</span> &{' '}
              <span>SUSHISWAP</span>.
            </div>
            <div className={s.buttons}>
              <Button big>Watch video</Button>
              <Button big to="/app">
                <span>Launch App</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TopBlock;
