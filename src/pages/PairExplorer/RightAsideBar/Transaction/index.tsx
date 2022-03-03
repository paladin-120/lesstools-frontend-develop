import BigNumber from 'bignumber.js/bignumber';

import { getSecondsFromDate } from '../../../../utils/getSecondsFromDate';
import { getNetworkImage } from '../../../../helpers/getNetworkImage';
import { explorersLinks } from '../../../../config/networks';

import s from './Transaction.module.scss';

// TODO: move to utils and rename
function formatTime(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds - hours * 3600) / 60);
  const second = Math.floor(seconds - hours * 3600 - minutes * 60);

  if (hours > 0) return `${hours} h`;
  if (minutes > 0) return `${minutes} m`;
  return `${second} s`;
}

interface ITransactionProps {
  ethPrice: number;
  amountEth: number;
  priceUsd: number;
  type: 'sell' | 'buy';
  etherscan: string;
  timestamp: number;
  tbrSymbol: string;
  otherSymbol: string;
  network: string;
}

const Transaction: React.FC<ITransactionProps> = ({
  ethPrice,
  priceUsd,
  amountEth,
  type,
  etherscan,
  timestamp,
  tbrSymbol,
  otherSymbol,
  network,
}) => {
  return (
    <div className={s.transaction}>
      <div className={`${s.transaction_type} ${type === 'sell' && s.sell}`} />
      <div className={s.transaction_prices}>
        <div className={s.transaction_price}>
          <div className={s.transaction_price__value}>{new BigNumber(ethPrice).toFormat(2)}</div>
          <div className={s.transaction_price__value}> {new BigNumber(amountEth).toFormat(2)}</div>
        </div>
        <div className={s.transaction_symbols}>
          <div className={s.transaction_symbols__item}>{otherSymbol}</div>
          <div className={s.transaction_symbols__item}>{tbrSymbol}</div>
        </div>
      </div>
      <div className={s.transaction_usd} data-tip={priceUsd}>
        $
        {priceUsd
          .toString()
          .slice(0, 6)
          .split('')
          .filter((el) => el !== '.')
          .every((el) => el === '0')
          ? `${priceUsd.toString().slice(0, 3)}..${priceUsd.toString().slice(-1)}`
          : new BigNumber(priceUsd).toFormat(2)}
      </div>
      <a
        target="_blank"
        rel="noreferrer"
        href={`${explorersLinks[network]}tx/${etherscan}`}
        className={s.transaction_etherscan}
      >
        {getNetworkImage(network)}
      </a>
      <div className={s.transaction_time}>
        {formatTime(getSecondsFromDate(new Date(timestamp)))}
      </div>
    </div>
  );
};

export default Transaction;
