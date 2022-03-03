interface ITokenPriceHeader {
  isUsd: boolean;
  el: { title: string; key: string };
  handleToogleIsUsd: () => void;
}

const TokenPriceHeader: React.FC<ITokenPriceHeader> = ({ isUsd, el, handleToogleIsUsd }) => {
  return (
    <span>
      {`${el.title} ${isUsd ? 'USD' : 'ETH'}`}
      <span
        style={{ color: '#fff', cursor: 'pointer' }}
        role="button"
        tabIndex={0}
        onKeyDown={() => {}}
        onClick={handleToogleIsUsd}
      >
        {' '}
        ({isUsd ? 'ETH' : 'USD'})
      </span>
    </span>
  );
};

export default TokenPriceHeader;
