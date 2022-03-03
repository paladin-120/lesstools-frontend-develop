import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';

import slideBg1 from '../../../assets/img/sections/slider-img/slide-bg-1.png';
import poolExporerIcon from '../../../assets/img/icons/pool-explorer.svg';
import pairExporerIcon from '../../../assets/img/icons/pair-explorer.svg';
import bigSwapExporerIcon from '../../../assets/img/icons/big-swap-explorer.svg';
import { ReactComponent as ArrowBlue } from '../../../assets/img/icons/arrow-blue.svg';

import 'swiper/swiper.scss';
import s from './FeaturesSlider.module.scss';

interface ISlideProps {
  bgImage: string;
  icon: string;
  title: string;
  subtitle: string;
}

const Slide: React.FC<ISlideProps> = ({ bgImage, icon, title, subtitle }) => (
  <div className={s.slide}>
    <div className={s.slide_header}>
      <div className={s.slide_header__img}>
        <img src={icon} alt="icon" />
      </div>
      <div className={s.slide_header__title}>{title}</div>
    </div>
    <div className={s.slide_body}>
      <img src={bgImage} alt="bgImage" />
    </div>
    <div className={s.slide_footer}>{subtitle}</div>
  </div>
);

const slidesData: Array<ISlideProps> = [
  {
    bgImage: slideBg1,
    icon: poolExporerIcon,
    title: 'pool explorer',
    subtitle:
      'Search for new pools, add or remove liquidity in a pair, find the best gems and avoid the scams.',
  },
  {
    bgImage: slideBg1,
    icon: pairExporerIcon,
    title: 'pair explorer',
    subtitle:
      'Follow the best pairs through this tool with real-time graphics and transactions, add your pairs to favorites and much more.',
  },
  {
    bgImage: slideBg1,
    icon: bigSwapExporerIcon,
    title: 'big swap explorer',
    subtitle: 'Follow the most relevant swaps.',
  },
];

const FeaturesSlider: React.FC = () => {
  const [isSliderMove, setIsSliderMove] = useState(false);
  const [sliderInstance, setSliderInstance] = useState<any>(null);
  const [isSliderBegging, setIsSliderBegging] = useState(true);
  const [isSliderEnd, setIsSliderEnd] = useState(false);

  return (
    <section className={s.block}>
      <div className={s.title}>Features Uniswap</div>
      <div className={s.buttons}>
        <button
          type="button"
          tabIndex={0}
          disabled={isSliderBegging}
          onKeyDown={() => {}}
          className={s.button}
          onClick={() => sliderInstance.slidePrev()}
        >
          <ArrowBlue />
        </button>
        <button
          type="button"
          tabIndex={0}
          disabled={isSliderEnd}
          onKeyDown={() => {}}
          className={s.button}
          onClick={() => sliderInstance.slideNext()}
        >
          <ArrowBlue />
        </button>
      </div>
      <div className={`${s.slider} ${isSliderMove && s.fade}`}>
        <Swiper
          spaceBetween={20}
          slidesPerView={1}
          freeMode
          onSwiper={(slider) => setSliderInstance(slider)}
          onSliderFirstMove={() => setIsSliderMove(true)}
          onTouchEnd={() => setIsSliderMove(false)}
          onReachBeginning={() => setIsSliderBegging(true)}
          onReachEnd={() => setIsSliderEnd(true)}
          onTransitionEnd={() => setIsSliderMove(false)}
          onSlideChange={(slider) => {
            setIsSliderBegging(slider.isBeginning);
            setIsSliderEnd(slider.isEnd);
            setIsSliderMove(true);
          }}
          breakpoints={{
            // when window width is >= 320px
            900: {
              slidesPerView: 2.2,
            },

            1800: {
              slidesPerView: 3,
            },
          }}
        >
          {slidesData.map((slide, index) => (
            <SwiperSlide key={`${JSON.stringify(slide)}${index * index}`}>
              <Slide {...slide} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default FeaturesSlider;
