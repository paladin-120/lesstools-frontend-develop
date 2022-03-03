import s from './RoadMap.module.scss';

interface ICardProps {
  title: string;
  features: Array<string>;
  index: number;
}

const Card: React.FC<ICardProps> = ({ title, features, index }) => {
  return (
    <div className={`${s.card} ${(index + 1) % 2 === 0 ? s.rightCard : ''}`}>
      <div className={s.card_header}>
        <span>{title}</span>
      </div>
      <div className={s.card_body}>
        {features.map((feature) => (
          <div key={JSON.stringify(feature)} className={s.card_row}>
            {feature}
          </div>
        ))}
      </div>
    </div>
  );
};

const cardsData = [
  {
    title: '2021 Q1',
    features: [
      'Techincal Improvements',
      'Websockets',
      'SushiSwap Integration',
      'Multiexchange Suport',
      'Velox Bots and Limit Orders Integration',
      'UX/UI Redesign',
    ],
  },
  {
    title: '2021 Q2',
    features: [
      'NFT marketing promotion tool',
      'Presale promotion tools',
      'More tools (mempool, analytics...)',
      'Improvements based on community feedback',
    ],
  },
  {
    title: '2021 Q3',
    features: ['CEX tools', 'Advanced public API release', 'More dex integration'],
  },
  {
    title: '2021 Q4',
    features: ['More dex integration', 'Improvements based on community feedback'],
  },
];

const RoadMap: React.FC = () => {
  return (
    <section className={s.block}>
      <div className={s.container}>
        <div className={s.title}>RoadMap</div>
        <div className={s.cards}>
          <div
            className={s.cards_line}
            style={{ height: cardsData.length > 2 ? 172 * cardsData.length : 172 }}
          >
            <div className={s.cards_line__dot} />
          </div>
          {cardsData.map((data, i) => (
            <Card key={JSON.stringify({ data, i })} {...data} index={i} />
          ))}
        </div>
        <div className={s.info_bottom}>
          This is a floating Roadmap, so timelines are flexible. This is because we must be agile
          and responsive to industry, technological and community needs. In fact, many of our
          existing and future features are community requests. So please do understand that this
          roadmap, especially for items outside of imminent release, is subject to change
        </div>
      </div>
    </section>
  );
};

export default RoadMap;
