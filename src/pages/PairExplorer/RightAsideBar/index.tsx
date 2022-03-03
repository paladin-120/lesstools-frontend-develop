import { useState } from 'react';
import Favorites from './Favorites/index';
import Transaction from './Transaction/index';
import { IRowPairExplorer } from '../../../types/table';
import { useMst } from '../../../store/store';

import s from './RightAsideBar.module.scss';

import tradesWhite from '../../../assets/img/icons/trades-white.svg';
import arrowWhite from '../../../assets/img/sections/pair-explorer/arrow-white.svg';
import { useLocation } from 'react-router-dom';

enum TokenModes {
  TokenValue = 'Token value',
  TradePrice = 'Trade price',
}

interface isRightSideBarProps {
  trades: IRowPairExplorer[];
}

interface IPopupProps {
  items: string[];
  onChange: (value: string) => void;
}

const Popup: React.FC<IPopupProps> = (props) => {
  const { items = [], onChange = () => {} } = props;

  const [openPopup, setOpenPopup] = useState<boolean>(false);
  const [modeToken, setModeToken] = useState<string>(TokenModes.TokenValue);

  return (
    <div>
      <div
        className={s.label}
        role="button"
        tabIndex={0}
        onKeyDown={() => {}}
        onClick={() => setOpenPopup(true)}
      >
        <div>{modeToken}</div>
        <img src={arrowWhite} alt="" />
      </div>

      {openPopup && (
        <div className={s.popup}>
          {items.map((item: string) => {
            return (
              <div
                key={item}
                role="button"
                tabIndex={0}
                onKeyDown={() => {}}
                onClick={() => {
                  onChange(item);
                  setModeToken(item);
                  setOpenPopup(false);
                }}
              >
                {item}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const RightAsideBar: React.FC<isRightSideBarProps> = ({ trades }) => {
  const { user } = useMst();

  const location = useLocation();
  const network = location.pathname.split('/')[1].toLowerCase();

  const [modeToken, setModeToken] = useState<string>(TokenModes.TokenValue);
  const isModeTokenTokenValue = modeToken === TokenModes.TokenValue;

  const [modeTokenOfMyTrades, setModeTokenOfMyTrades] = useState<string>(TokenModes.TokenValue);
  const isModeTokenOfMyTradesTokenValue = modeTokenOfMyTrades === TokenModes.TokenValue;

  return (
    <>
      <div className={s.favs}>
        <Favorites />
      </div>
      <div className={s.table_header}>
        <div className={`${s.table_header__title} ${s.amount}`}>Token amount</div>
        <div className={`${s.table_header__title} ${s.usd}`}>
          <Popup items={[TokenModes.TokenValue, TokenModes.TradePrice]} onChange={setModeToken} />
        </div>
        <div className={`${s.table_header__title} ${s.time}`}>Age</div>
      </div>
      <div className={`${s.transactions} grey-scroll`}>
        {trades.map((trade) => (
          <Transaction
            key={`${trade.maker}-${trade.data}-${trade.totalEth}-${trade.amountEth}`}
            ethPrice={trade.totalEth}
            priceUsd={isModeTokenTokenValue ? trade.priceUsd * trade.amountEth : trade.priceUsd}
            amountEth={trade.amountEth}
            type={trade.type}
            etherscan={trade.others.etherscan}
            timestamp={trade.data}
            tbrSymbol={trade.tbr.symbol}
            otherSymbol={trade.otherToken.symbol}
            network={network}
          />
        ))}
      </div>
      <div className={s.options}>
        <div className={`${s.option} ${s.active}`}>
          <div className={s.option_inner}>
            <div className={s.option_icon}>
              <img src={tradesWhite} alt="trades" />
            </div>
            <div className={s.option_text}>My Trades</div>
          </div>
        </div>
        <div className={`${s.option} ${s.disabled}`}>
          <div className={s.option_inner}>
            <div className={s.option_text}>Price Alert</div>
            <div className={s.option_soon}>
              <div className={s.option_soon__inner}>
                <span>Coming Soon</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={s.table_header}>
        <div className={`${s.table_header__title} ${s.amount}`}>Token amount</div>
        <div className={`${s.table_header__title} ${s.usd}`}>
          <Popup
            items={[TokenModes.TokenValue, TokenModes.TradePrice]}
            onChange={setModeTokenOfMyTrades}
          />
        </div>
        <div className={`${s.table_header__title} ${s.time}`}>Age</div>
      </div>
      <div className={`${s.trades} grey-scroll`}>
        {trades
          .filter((trade) => trade.maker === user.walletId)
          .map((trade) => (
            <Transaction
              key={`${trade.maker}-${trade.data}-${trade.totalEth}-${trade.amountEth}`}
              ethPrice={trade.totalEth}
              priceUsd={isModeTokenOfMyTradesTokenValue ? trade.priceUsd * 2 : trade.priceUsd}
              amountEth={trade.amountEth}
              type={trade.type}
              etherscan={trade.others.etherscan}
              timestamp={trade.data}
              tbrSymbol={trade.tbr.symbol}
              otherSymbol={trade.otherToken.symbol}
              network={network}
            />
          ))}
        {trades.filter((trade) => trade.maker === user.walletId).length < 1 && (
          <div className={s.zero_trades}>You have 0 trades for this pair</div>
        )}
      </div>
    </>
  );
};

export default RightAsideBar;
