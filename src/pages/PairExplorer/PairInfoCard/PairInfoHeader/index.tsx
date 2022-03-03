import { WHITELIST } from '../../../../data/whitelist';

import s from './PairInfoHeader.module.scss';

// import loader from '../../../../assets/loader.svg';
import tokenIcon from '../../../../assets/img/icons/token-placeholder.svg';
import { useEffect, useState } from 'react';

export interface ITokenData {
  derivedETH: string;
  derivedUSD: string;
  symbol: string;
  id: string;
  totalSupply: string;
  name: string;
}

interface IPairInfoHeaderProps {
  token0: ITokenData | null | undefined;
  token1: ITokenData | null | undefined;
  cmcTokenId: number | null;
}

const PairInfoHeader: React.FC<IPairInfoHeaderProps> = ({ token0, token1, cmcTokenId }) => {
  const [tbr, setTbr] = useState(token1);
  const [otherToken, setOtherToken] = useState(token0);

  useEffect(() => {
    if (token1 && WHITELIST.includes(token1.id)) {
      setTbr(token0);
      setOtherToken(token1);
    } else {
      setTbr(token1);
      setOtherToken(token0);
    }
  }, [token1, token0]);

  if (!token0?.id || !token1?.id) {
    return <div>No data</div>;
  }

  return (
    <section className={s.pairInfoHeader}>
      <div className={s.logo}>
        <img
          src={
            cmcTokenId
              ? `https://s2.coinmarketcap.com/static/img/coins/64x64/${cmcTokenId}.png`
              : tokenIcon
          }
          alt="logoExample"
        />
      </div>
      <div className={s.right}>
        <div className={s.right_top}>
          <div className={s.right_top__pair}>
            <span>{otherToken?.symbol} /</span>
            <span>{tbr?.symbol}</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PairInfoHeader;
