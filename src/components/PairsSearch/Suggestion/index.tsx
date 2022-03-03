import { Link, useLocation } from 'react-router-dom';
import BigNumber from 'bignumber.js/bignumber';

import s from '../PairsSearch.module.scss';

interface ISuggestionProps {
  tbrSymbol: string;
  tbrName: string;
  otherSymbol: string;
  tokenId: string;
  pairId: string;
  holders: string;
  txCount: string;
  onClick: () => void;
  exchange: string;
  small: boolean;
  networkProps?: string;
}

const Suggestion: React.FC<ISuggestionProps> = ({
  otherSymbol,
  tbrSymbol,
  tbrName,
  tokenId,
  pairId,
  txCount,
  onClick,
  // exchange,
  small,
  networkProps,
}) => {
  const location = useLocation();
  const network = networkProps || location.pathname.split('/')[1].toLowerCase();
  return (
    <Link
      to={`/${network}/pair-explorer/${pairId}`}
      className={s.suggestion}
      onClick={() => onClick()}
    >
      <div className={s.suggestion_title}>
        {otherSymbol}/{tbrSymbol} - {tbrName}
      </div>
      <div className={`${s.suggestion_body} ${small && s.small}`}>
        <div className={s.suggestion_body__item}>
          <div className={s.suggestion_body__item_title}>Token:</div>
          <div className={s.suggestion_body__item_value}>
            {tokenId.slice(0, 5)}...{tokenId.slice(-5)}
          </div>
        </div>
        <div className={s.suggestion_body__item}>
          <div className={s.suggestion_body__item_title}>Pair:</div>
          <div className={s.suggestion_body__item_value}>
            {pairId.slice(0, 5)}...{pairId.slice(-5)}
          </div>
        </div>
        {/* <div className={s.suggestion_body__item}>
          <div className={s.suggestion_body__item_title}>Holders:</div>
          <div className={s.suggestion_body__item_value}>{holders}</div>
        </div> */}
        <div className={s.suggestion_body__item}>
          <div className={s.suggestion_body__item_title}>Tx:</div>
          <div className={s.suggestion_body__item_value}>{new BigNumber(txCount).toFormat(2)}</div>
        </div>
      </div>
    </Link>
  );
};

export default Suggestion;
