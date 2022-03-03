import FavoriteToken from './FavoriteToken/index';
// import Sponsors from './Sponsors/index';

import s from './Favorites.module.scss';
// import sponsorImg from '../../../assets/img/sections/partners-logos/sponsor.png';

const Favorites: React.FC = () => {
  return (
    <section className={s.favorites}>
      <div className={s.title}>Favorites</div>
      <div className={s.tokens}>
        <FavoriteToken />
        <FavoriteToken />
        <FavoriteToken />
      </div>
      {/* <div className={s.sponsors}>
        <Sponsors />
      </div> */}
      {/* <div className={s.sponsored}>
        <div className={s.title}>Sponsored</div>
        <div className={s.sponsored_img}>
          <img src={sponsorImg} alt="sponsorImg" />
        </div>
      </div> */}
    </section>
  );
};

export default Favorites;
