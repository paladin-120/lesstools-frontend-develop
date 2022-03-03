import loaderSvg from '../../assets/loader.svg';

const Loader: React.FC = () => {
  return (
    <div>
      <img src={loaderSvg} alt="loader" />
    </div>
  );
};

export default Loader;
