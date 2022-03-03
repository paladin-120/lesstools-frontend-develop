import BigNumber from 'bignumber.js/bignumber';

interface ITokenPrice {
  usd: number;
  eth: number;
  isUsd: boolean;
}

const TokenPrice: React.FC<ITokenPrice> = ({ usd, eth, isUsd }) => {
  return (
    <>
      {isUsd
        ? `$${new BigNumber(usd).toFormat(usd.toString().length > 5 ? 10 : 5)}`
        : `${new BigNumber(eth).toFormat(eth.toString().length > 5 ? 10 : 5)} ETH`}
    </>
  );
};

export default TokenPrice;
