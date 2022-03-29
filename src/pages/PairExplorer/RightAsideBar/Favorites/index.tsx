import { useState, useEffect, useCallback } from 'react';
import { useLazyQuery } from '@apollo/client';
import BigNumber from 'bignumber.js/bignumber';
import { observer } from 'mobx-react-lite';
import { Link, useLocation } from 'react-router-dom';

import OutsideAlerter from '../../../../utils/outsideClickWrapper';
import backend, { PLATFORM } from '../../../../services/backend/index';
import { GET_FAVORITES_PAIRS } from '../../../../queries/index';
import { ApolloClientsForExchanges } from '../../../../index';
import { useMst } from '../../../../store/store';
import { WHITELIST } from '../../../../data/whitelist';

import s from './Favorites.module.scss';

import cross from '../../../../assets/img/icons/close.svg';
import arrowRight from '../../../../assets/img/icons/arrow-right.svg';
import { Exchange } from '../../../../config/exchanges';
import { uppercaseFirstLetter } from '../../../../utils/prettifiers';

interface IFavorite {
  symbol: string;
  price: string;
  pairId: string;
  deletePair: () => void;
  currentExchange?: Exchange;
  closeModal: () => void;
}

const Favorite: React.FC<IFavorite> = ({ symbol, price, deletePair, pairId, closeModal }) => {
  const location = useLocation();
  const network = location.pathname.split('/')[1].toLowerCase();

  return (
    <div className={s.favorites_item}>
      <div className={s.favorites_item__left}>
        <Link
          to={`/${network}/pair-explorer/${pairId}`}
          className={s.favorites_item__left__symbol}
          onClick={() => closeModal()}
        >
          {symbol}
        </Link>
      </div>
      <div className={s.favorites_item__right}>
        <div className={s.favorites_item__right_price}>${new BigNumber(price).toFormat(2)}</div>
        <button
          type="button"
          onClick={() => deletePair()}
          className={s.favorites_item__right_arrow}
        >
          <img src={cross} alt="X" />
        </button>
      </div>
    </div>
  );
};

const Favorites: React.FC = observer(() => {
  const [isModal, setIsModal] = useState(false);
  const { user, currentExchange } = useMst();
  const { exchange } = currentExchange;

  const client: any = ApolloClientsForExchanges[uppercaseFirstLetter(exchange.toLowerCase())];

  const [getPairsFromGraph, { loading, data: favs }] = useLazyQuery(GET_FAVORITES_PAIRS, {
    client,
  });

  useEffect(() => {
    if (!loading && favs) {
      user.setFavoritesPairs(favs.pairs);
    }
  }, [loading, favs, user]);

  // получение избранных пар с графа
  const getFavoritePairs = useCallback(async () => {
    const result = await backend.getFavoritesOfUser({ platform: 'ETH' });
    const ids = result?.data?.map((id: string) => id.toLowerCase());
    console.log('Favorites:', { ids });
    getPairsFromGraph({ variables: { ids: ids || [] } });
  }, [getPairsFromGraph]);

  useEffect(() => {
    getFavoritePairs();
  }, [getFavoritePairs]);

  const deletePair = async (pair_address: string, platform: PLATFORM) => {
    backend.addOrRemovePairToFavorite({ pair_address, platform });

    const newPairs = user.favoritePairs.filter(
      (pair) => pair.id.toLowerCase() !== pair_address.toLowerCase(),
    );
    user.setFavoritesPairs(newPairs);
  };

  return (
    <OutsideAlerter fn={() => setIsModal(false)}>
      <div className={s.favorites}>
        <div
          className={s.favorites_main}
          tabIndex={0}
          onKeyDown={() => {}}
          role="button"
          onClick={() => setIsModal(!isModal)}
        >
          <div className={s.favorites_main__left}>
            <div className={s.favorites_main__left__title}>Favourites</div>
            <div className={s.favorites_main__left__symbol}>
              {/* eslint-disable-next-line */}
              {user.favoritePairs.length > 0
                ? WHITELIST.includes(user.favoritePairs[0].token1.id)
                  ? user.favoritePairs[0].token0.symbol
                  : user.favoritePairs[0].token1.symbol
                : 'No pairs'}
            </div>
          </div>
          <div className={s.favorites_main__right}>
            <div className={s.favorites_main__right_price}>
              {/* eslint-disable-next-line */}
              {user.favoritePairs.length > 0
                ? WHITELIST.includes(user.favoritePairs[0].token1.id)
                  ? `$${new BigNumber(user.favoritePairs[0].token0.derivedUSD).toFormat(2)}`
                  : `$${new BigNumber(user.favoritePairs[0].token1.derivedUSD).toFormat(2)}`
                : ''}
            </div>
            {user.favoritePairs.length > 0 && (
              <div className={s.favorites_main__right_arrow}>
                <img src={arrowRight} alt=">" />
              </div>
            )}
          </div>
        </div>
        {isModal && !loading && user.favoritePairs.length > 0 && (
          <div className={s.favorites_modal}>
            <div className={s.favorites_modal__inner}>
              <div
                className={`${s.favorites_modal__scroll} grey-scroll ${
                  user.favoritePairs.length > 5 && s.scroll
                }`}
              >
                {user.favoritePairs.map((pair: any) => (
                  <Favorite
                    key={`${pair.id}-${pair.token1.id}-${pair.token0.id}`}
                    symbol={
                      WHITELIST.includes(pair.token1.id) ? pair.token0.symbol : pair.token1.symbol
                    }
                    price={
                      WHITELIST.includes(pair.token1.id)
                        ? pair.token0.derivedUSD
                        : pair.token1.derivedUSD
                    }
                    pairId={pair.id}
                    deletePair={() => deletePair(pair.id, 'ETH')}
                    closeModal={() => setIsModal(false)}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </OutsideAlerter>
  );
});

export default Favorites;
