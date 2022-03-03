import s from './AdBlock.module.scss';

interface IAdBlockProps {
  adImg: string;
}

const AdBlock: React.FC<IAdBlockProps> = ({ adImg }) => {
  return (
    <section className={s.advertiesment}>
      <img src={adImg} alt="adImg" />
    </section>
  );
};

export default AdBlock;
