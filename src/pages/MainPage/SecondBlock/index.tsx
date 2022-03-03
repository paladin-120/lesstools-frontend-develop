import s from './SecondBlock.module.scss';
import coinsImg from '../../../assets/img/sections/main/second-block-coins.png';
import bgImg from '../../../assets/img/sections/main/second-block-bg.png';

const SecondBlock: React.FC = () => {
  return (
    <section className={s.block}>
      <div className={s.inner}>
        <div className={s.left}>
          <div className={s.bg}>
            <img src={bgImg} className={s.filter} alt="bg" />
            <img src={coinsImg} className={s.coins} alt="coins" />
          </div>
        </div>
        <div className={s.right}>
          <div className={s.text}>
            If you are a UNISWAP/SUSHISWAP user, and you want to be able to anticipate market
            movements and develop better trading strategies, LESSTools will help you in a very
            simple way.
          </div>
        </div>
      </div>
    </section>
  );
};

export default SecondBlock;
