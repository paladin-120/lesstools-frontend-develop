import { Helmet } from 'react-helmet';

import TopBlock from './TopBlock/index';
import SecondBlock from './SecondBlock/index';
import CardsBlock from './CardsBlock/index';
import Partners from './Partners/index';
import TeamBlock from './TeamBlock/index';
import UsersPlans from './UsersPlans/index';
import RoadMap from './RoadMap/index';
import FeaturesSlider from './FeaturesSlider/index';

import s from './MainPage.module.scss';

import partnerLogo1 from '../../assets/img/sections/partners-logos/logo-1.svg';

const partnersLogos = [
  partnerLogo1,
  partnerLogo1,
  partnerLogo1,
  partnerLogo1,
  partnerLogo1,
  partnerLogo1,
  partnerLogo1,
  partnerLogo1,
];

const MainPage: React.FC = () => {
  return (
    <section className={s.page}>
      <Helmet>
        <meta charSet="utf-8" />
        <title>LessTools</title>
        <meta
          name="description"
          content="Multi-Chain Decentralized
Fundraising Capital"
        />
      </Helmet>
      <div className={s.inner}>
        <TopBlock />
        <SecondBlock />
        <CardsBlock />
        <FeaturesSlider />
        <UsersPlans />
        <RoadMap />
        <TeamBlock />
        <Partners title="PARTNERED PROJECTS" logos={partnersLogos} />
        <div className={s.info}>
          All content available on our website, on hyperlinked websites, and on applications,
          forums, blogs, social media accounts and other platforms associated with LESSTools is
          intended solely to provide you with general information. We make no warranties of any kind
          with respect to our content, including, but not limited to, the accuracy and currency of
          the information. None of the content we provide should be construed as financial, legal or
          any other type of advice on which you may specifically rely for any purpose. Any use or
          reliance you place on our content is solely at your own risk. What you should do is
          conduct your own research, review and analysis, and verify our content before relying on
          it. Trading is a high-risk activity that can result in significant losses, so you should
          consult with your financial advisor before making any decisions. Nothing on our Site
          should be considered an invitation or offer to take any action.
        </div>
      </div>
    </section>
  );
};

export default MainPage;
