import React from 'react';
import { observer } from 'mobx-react-lite';
import { Link, useLocation } from 'react-router-dom';

import { getNetworkImage } from '../../../helpers/getNetworkImage';
import { ExchangesIcons } from '../../../config/exchanges';
import { explorersLinks } from '../../../config/networks';

import s from './Actions.module.scss';

import unicrypt from '../../../assets/img/icons/table/actions-unicrypt.svg';
import compass from '../../../assets/img/icons/table/actions-compass.svg';

const Actions: React.FC<any> = observer(({ actions, exchange }) => {
  // const { currentExchange } = useMst();
  const location = useLocation();
  const network = location.pathname.split('/')[1].toLowerCase();

  const getExchangeLink = (actionExchange: string, uniswapLink: string) => {
    let link;
    switch (actionExchange) {
      case 'Uniswap':
        link = `https://app.uniswap.org/#/swap?outputCurrency=${uniswapLink}`;
        break;
      case 'Pancake':
        link = `https://pancakeswap.finance/swap?outputCurrency=${uniswapLink}`;
        break;
      case 'Mdexbsc':
        link = `https://ht.mdex.com/#/swap?outputCurrency=${uniswapLink}`;
        break;
      case 'Babyswap':
        link = `https://exchange.babyswap.finance/#/swap?outputCurrency=${uniswapLink}`;
        break;
      case 'Apeswap':
        link = `https://app.apeswap.finance/swap?outputCurrency=${uniswapLink}`;
        break;
      case 'Quickswap':
        link = `https://quickswap.exchange/#/swap?outputCurrency=${uniswapLink}`;
        break;
      case 'Spookyswap':
        link = `https://spookyswap.finance/swap?outputCurrency=${uniswapLink}`;
        break;
      case 'Spiritswap':
        link = `https://swap.spiritswap.finance/#/exchange/swap?outputCurrency=${uniswapLink}`;
        break;
      case 'Joetrader':
        link = `https://traderjoexyz.com/#/trade?outputCurrency=${uniswapLink}`;
        break;
      case 'Honeyswap':
        link = `https://app.honeyswap.org/#/swap?outputCurrency=${uniswapLink}`;
        break;
      case 'Pangolin':
        link = `https://app.pangolin.exchange/#/swap?outputCurrency=${uniswapLink}`;
        break;
      case 'Biswap':
        link = `https://exchange.biswap.org/#/swap?outputCurrency=${uniswapLink}`;
        break;

      default:
        link = `https://app.sushi.com/swap?outputCurrency=${uniswapLink}`;
        break;
    }
    return link;
  };

  return (
    <div className={s.block}>
      {actions.uniswap && exchange && (
        <a
          data-tip={`Buy at uniswap: ${actions.uniswap}`}
          data-place="left"
          data-effect="solid"
          href={getExchangeLink(exchange, actions.uniswap)}
          target="_blank"
          rel="noreferrer"
        >
          <img src={ExchangesIcons[exchange]} alt={`${exchange}`} />
        </a>
      )}
      {actions[network] && (
        <a
          data-tip={`Tx: ${actions[network]}`}
          data-place="left"
          data-effect="solid"
          href={`${explorersLinks[network]}tx/${actions[network]}`}
          target="_blank"
          rel="noreferrer"
        >
          {getNetworkImage(network)}
        </a>
      )}
      {actions.unicrypt && (
        <a
          data-tip="See at unicrypt"
          data-place="left"
          data-effect="solid"
          href={`https://app.unicrypt.network/amm/uni-v2/pair/${actions.unicrypt}`}
          target="_blank"
          rel="noreferrer"
        >
          <img src={unicrypt} alt="unicrypt" />
        </a>
      )}
      {actions.liveData && (
        <Link
          to={`/${network}/pair-explorer/${actions.liveData}`}
          data-tip={`Pair Explorer: ${actions.liveData}`}
          data-place="left"
          data-effect="solid"
        >
          <img src={compass} alt="compass" />
        </Link>
      )}
    </div>
  );
});

export default Actions;
