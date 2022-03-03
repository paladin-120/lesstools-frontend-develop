import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';

import Partner from '../../../BoardPage/Partner/index';

import 'swiper/swiper.scss';
import s from './Sponsors.module.scss';

import arrowRight from '../../../../assets/img/icons/arrow-right.svg';

const Sponsors: React.FC = () => {
  const [sliderInstance, setSlider] = useState<any>(null);

  return (
    <section className={s.sponsors}>
      <div className={s.header}>
        <div className={s.title}>Sponsored</div>
        <div className={s.buttons}>
          <div
            className={s.button}
            onClick={() => sliderInstance.slidePrev()}
            onKeyDown={() => {}}
            role="button"
            tabIndex={0}
          >
            <div className={s.button_img}>
              <img src={arrowRight} alt="<" />
            </div>
          </div>
          <div
            className={s.button}
            onClick={() => sliderInstance.slideNext()}
            onKeyDown={() => {}}
            role="button"
            tabIndex={0}
          >
            <div className={s.button_img}>
              <img src={arrowRight} alt=">" />
            </div>
          </div>
        </div>
      </div>

      <div className={s.slider}>
        <Swiper onSwiper={(slider) => setSlider(slider)} spaceBetween={50} slidesPerView={1} loop>
          <SwiperSlide>
            <Partner />
          </SwiperSlide>
          <SwiperSlide>
            <Partner />
          </SwiperSlide>
          <SwiperSlide>
            <Partner />
          </SwiperSlide>
        </Swiper>
      </div>
    </section>
  );
};

export default Sponsors;
