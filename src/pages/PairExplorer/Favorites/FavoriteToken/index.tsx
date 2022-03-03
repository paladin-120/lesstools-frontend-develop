import s from './FavoriteToken.module.scss';

import close from '../../../../assets/img/icons/close.svg';

const FavoriteToken: React.FC = () => {
  return (
    <section className={s.token}>
      <div className={s.token_inner}>
        <div className={s.name}>LESS</div>
        <div className={s.right}>
          <div className={s.cost}>$5,540</div>
          <div className={s.close}>
            <img src={close} alt="X" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default FavoriteToken;
