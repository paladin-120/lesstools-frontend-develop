import React, { useState } from 'react';

import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { EffectCoverflow } from 'swiper';

import 'swiper/swiper.scss';
import s from './TeamBlock.module.scss';

import man from '../../../assets/img/sections/team-photos/man.png';
import twitterIcon from '../../../assets/img/icons/twitter-team-link.svg';
import telegramIcon from '../../../assets/img/icons/telegram-team-link.svg';
import { ReactComponent as ArrowBlue } from '../../../assets/img/icons/arrow-blue.svg';

SwiperCore.use([EffectCoverflow]);

const data = [
  {
    img: man,
    name: 'Jhon Smith',
    country: 'Belgium',
    lang: 'English',
    description: 'Co-founder of Less Network, Lead Software Engineer & Architect',
    twitter: '/',
    telegram: '/',
  },
  {
    img: man,
    name: 'Jhon Smit',
    country: 'Belgium',
    lang: 'English',
    description: 'Co-founder of Less Network, Lead Software Engineer & Architect',
    twitter: '/',
    telegram: '/',
  },
  {
    img: man,
    name: 'Jhon Sith',
    country: 'Belgium',
    lang: 'English',
    description: 'Co-founder of Less Network, Lead Software Engineer & Architect',
    twitter: '/',
    telegram: '/',
  },
  {
    img: man,
    name: 'Jhon Smth',
    country: 'Belgium',
    lang: 'English',
    description: 'Co-founder of Less Network, Lead Software Engineer & Architect',
    twitter: '/',
    telegram: '/',
  },
  {
    img: man,
    name: 'Jhon ith',
    country: 'Belgium',
    lang: 'English',
    description: 'Co-founder of Less Network, Lead Software Engineer & Architect',
    twitter: '/',
    telegram: '/',
  },
  {
    img: man,
    name: 'Jhon Smi',
    country: 'Belgium',
    lang: 'English',
    description: 'Co-founder of Less Network, Lead Software Engineer & Architect',
    twitter: '/',
    telegram: '/',
  },
];

interface ICardProps {
  img: string;
  name: string;
  country: string;
  lang: string;
  description: string;
  twitter: string;
  telegram: string;
}

const Card: React.FC<ICardProps> = ({
  img,
  name,
  country,
  lang,
  description,
  twitter,
  telegram,
}) => {
  return (
    <div className={s.card}>
      <div className={s.card_inner}>
        <div className={s.card_mainInfo}>
          <div className={s.card_mainInfo__img}>
            <img src={img} alt="img" />
          </div>
          <div className={s.card_mainInfo__right}>
            <div className={s.card_mainInfo__name}>{name}</div>
            <div className={s.card_mainInfo__country}>{country}</div>
            <div className={s.card_mainInfo__lang}>{lang}</div>
          </div>
        </div>
        <div className={s.card_description}>{description}</div>
        <div className={s.card_links}>
          <a href={twitter} className={s.card_link}>
            <img src={twitterIcon} alt="twitterIcon" />
          </a>
          <a href={telegram} className={s.card_link}>
            <img src={telegramIcon} alt="telegramIcon" />
          </a>
        </div>
      </div>
    </div>
  );
};

const TeamBlock: React.FC = () => {
  const [sliderInstance, setSliderInstance] = useState<any>({});
  return (
    <section className={s.block}>
      <div className={s.container}>
        <div className={s.inner}>
          <div className={s.title}>TEAM MEMBERS</div>
          <div className={s.slider}>
            <div className={s.custom_nav}>
              <button
                type="button"
                onClick={() => sliderInstance.slidePrev()}
                className={s.custom_nav__button}
              >
                <ArrowBlue />
              </button>
              <button
                type="button"
                onClick={() => sliderInstance.slideNext()}
                className={s.custom_nav__button}
              >
                <ArrowBlue />
              </button>
            </div>
            <Swiper
              spaceBetween={20}
              slidesPerView={1}
              onSwiper={(slider) => setSliderInstance(slider)}
              loop
              effect="coverflow"
              coverflowEffect={{
                rotate: 50,
                stretch: 0,
                depth: 250,
                modifier: 1,
                slideShadows: true,
              }}
            >
              {data.map((team) => (
                <SwiperSlide key={`${team.name}-${team.description}`}>
                  <Card {...team} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
          <div className={s.cards}>
            {data.map((team) => (
              <Card key={`${team.name}-${team.description}`} {...team} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TeamBlock;
