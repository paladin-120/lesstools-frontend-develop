import { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import BigNumber from 'bignumber.js/bignumber';
import ReactTooltip from 'react-tooltip';

import { ITokenData } from '../PairInfoHeader';
import CommunityTrust from '../CommunityTrust/index';
import Loader from '../../../../components/Loader/index';
import { WHITELIST } from '../../../../data/whitelist';
// import { copyText } from '../../../../utils/copyText';
import { useMst } from '../../../../store/store';
import MoreInfoModal from '../../../../components/Modals/MoreInfoModal/index';
import ShareModal from '../../../../components/Modals/ShareModal/index';
import TradeModal from '../../../../components/Modals/TradeModal/index';
import InfoModal from '../../../../components/Modals/InfoModal/index';
import backend, { IAdditionalInfoFromBackend, PLATFORM } from '../../../../services/backend/index';
import TokenInfoItem from './TokenInfoItem/index';
import Links from './Links/index';
import LessScore from './LessScore/index';
import { formatSmallNumbers } from '../../../../utils/formatSmallNumbers';

import s from './PairInfoBody.module.scss';

import { ReactComponent as FavImg } from '../../../../assets/img/icons/favorite.svg';
import { ReactComponent as ShareImg } from '../../../../assets/img/icons/share.svg';

export interface IToken {
  address: string;
  chainId: number;
  decimals: number;
  logoURI: string;
  name: string;
  symbol: string;
}

export interface IPairInfo {
  base_info: {
    liquidityProviderCount: string;
    reserve0: string;
    reserve1: string;
    reserveUSD: string;
    token0: ITokenData;
    token1: ITokenData;
    txCount: string;
    volumeUSD: string;
    createdAtTimestamp: string;
  };
  h24_ago_by_sum: Array<{ hourlyVolumeUSD: string }>;
  tokens_prices_24h_ago: {
    token0: { derivedETH: string; derivedUSD: string };
    token1: { derivedETH: string; derivedUSD: string };
  };
}

interface IPairInfoBodyProps {
  pairId: string;
  loading: boolean;
  pairInfo: IPairInfo;
  tokenInfoFromBackend: IAdditionalInfoFromBackend | null;
  exchange?: string;
}

const PairInfoBody: React.FC<IPairInfoBodyProps> = observer(
  ({ pairInfo, pairId, tokenInfoFromBackend, exchange }) => {
    // tbr = token being reviewed
    const [tbr, setTbr] = useState(pairInfo?.base_info?.token1 || {});
    const [tbrIndex, setTbrIndex] = useState<'0' | '1'>('1');
    const [otherToken, setOtherToken] = useState(pairInfo?.base_info?.token0);

    useEffect(() => {
      if (pairInfo.base_info) {
        if (WHITELIST.includes(pairInfo?.base_info?.token1?.id)) {
          setTbr(pairInfo.base_info.token0);
          setTbrIndex('0');
          setOtherToken(pairInfo.base_info.token1);
        } else {
          setTbr(pairInfo.base_info.token1);
          setTbrIndex('1');
          setOtherToken(pairInfo.base_info.token0);
        }
      }
    }, [pairInfo]);

    // MODALS
    const { modals, user } = useMst();
    const handleOpenMoreInfoModal = () => {
      modals.open('MoreInfo');
    };
    const handleOpenShareModal = () => {
      modals.open('Share');
    };
    const handleOpenTradeModal = () => {
      modals.open('Trade');
    };
    const handleOpenInfoModal = (text: string) => {
      modals.open('Info', text);
    };

    // изменение цены токена за 24 часа в процентах
    const tokenPrice24hAgo =
      tbrIndex === '1'
        ? +pairInfo.tokens_prices_24h_ago?.token1.derivedETH
        : +pairInfo.tokens_prices_24h_ago?.token0.derivedETH;
    const tokenPrice24HoursChange = new BigNumber(
      (+tbr?.derivedETH / tokenPrice24hAgo) * 100 - 100,
    ).toFormat(2);

    const addOrRemovePairToFavs = async (pair_address: string, platform: PLATFORM) => {
      const res = await backend.addOrRemovePairToFavorite({
        pair_address,
        platform,
      });

      if (!res.data) {
        const newPairs = user.favoritePairs.filter((pair) => pair.id !== pair_address);
        user.setFavoritesPairs(newPairs);
      } else if (typeof res.data === 'string') {
        handleOpenInfoModal('You have a limit on 10 favorite pairs because of the free plan');
      } else {
        const newPairs = [{ id: pairId, token0: otherToken, token1: tbr }, ...user.favoritePairs];
        user.setFavoritesPairs(newPairs);
      }
    };

    if (!pairInfo.base_info) return <div>No data</div>;

    return (
      <section className={s.card}>
        <MoreInfoModal
          TBRprice={tbr?.derivedUSD}
          TBRsymbol={tbr?.symbol}
          otherTokenPrice={otherToken?.derivedUSD}
          otherTokenSymbol={otherToken?.symbol}
          poolCreated={pairInfo?.base_info.createdAtTimestamp}
          totalSupply={tokenInfoFromBackend?.pair.token_being_reviewed?.total_supply || '0'}
          pooledTbr={pairInfo.base_info[`reserve${tbrIndex}` as const]}
        />
        <ShareModal
          url={window.location.href}
          text={`Check ${tbr?.symbol} at LESSTools! Price: $${(+tbr?.derivedUSD).toFixed(
            2,
          )} - Shared from tools.less.xyz`}
        />
        <TradeModal tokenId={tbr.id} />
        <ReactTooltip />
        <InfoModal />
        {!pairInfo.base_info ? (
          <div className={s.card_no_data}>
            <Loader />
          </div>
        ) : (
          <div className={s.card_inner}>
            <div className={s.first_block}>
              <div className={s.header}>
                <div className={s.card_buttons}>
                  <div
                    onClick={handleOpenShareModal}
                    tabIndex={0}
                    onKeyDown={handleOpenShareModal}
                    role="button"
                    className={s.card_button}
                  >
                    <ShareImg />
                  </div>
                  <button
                    onClick={() => addOrRemovePairToFavs(pairId, 'ETH')}
                    onKeyDown={() => {}}
                    type="button"
                    disabled={!user.isVerified}
                    className={`${s.card_button} ${
                      user.favoritePairs.some((pair) => pair.id === pairId) && s.active
                    }`}
                  >
                    <FavImg />
                  </button>
                </div>
                <div
                  tabIndex={0}
                  role="button"
                  onKeyDown={() => {}}
                  onClick={() => handleOpenTradeModal()}
                  className={s.card_trade}
                >
                  Trade
                </div>
              </div>
              <div className={s.price}>
                <div
                  className={s.card_body__price}
                  data-tip={`$${new BigNumber(tbr.derivedUSD).toFormat(18)}`}
                >
                  ${formatSmallNumbers(new BigNumber(tbr.derivedUSD))}
                </div>
                <div
                  data-tip={`${new BigNumber(tbr.derivedETH).toFormat(18)} ${otherToken?.symbol}`}
                  className={`${s.card_body__info} ${
                    tokenPrice24HoursChange < 0
                      ? s.red
                      : (tokenPrice24HoursChange > 0 && s.green) || ''
                  }`}
                >
                  <span>
                    (24h:{' '}
                    {tokenPrice24HoursChange === 'NaN' ? 'No data' : `${tokenPrice24HoursChange}%`})
                  </span>{' '}
                  {formatSmallNumbers(new BigNumber(tbr.derivedETH))} {otherToken?.symbol}
                </div>
              </div>
              <button
                tabIndex={0}
                type="button"
                onKeyDown={handleOpenMoreInfoModal}
                onClick={handleOpenMoreInfoModal}
                className={s.market_cap_button}
              >
                View more info
              </button>
            </div>

            <Links
              tokenInfoFromBackend={tokenInfoFromBackend}
              tokenId={tbr.id}
              exchange={exchange}
            />
            <div className={s.token_info}>
              <TokenInfoItem
                title="Token contract:"
                value={`${tbr?.id?.slice(0, 5)}...${tbr?.id?.slice(-4)}`}
                copy
                copyValue={tbr.id}
              />
              <TokenInfoItem
                title="Pair contract:"
                value={`${pairId.slice(0, 5)}...${pairId.slice(-4)}`}
                copy
                copyValue={pairId}
              />
              <TokenInfoItem
                title="Total liquidity:"
                value={`$${new BigNumber(pairInfo.base_info.reserveUSD).toFormat(2)}`}
              />
              <TokenInfoItem
                title="Daily volume:"
                value={`$${new BigNumber(
                  pairInfo.h24_ago_by_sum.reduce((acc, cur) => {
                    return acc + Number(cur.hourlyVolumeUSD);
                  }, 0),
                ).toFormat(2)}`}
              />
              <TokenInfoItem
                title={`Pooled ${pairInfo?.base_info?.token0?.symbol}`}
                value={`${new BigNumber(pairInfo?.base_info?.reserve0).toFormat(2)}`}
              />
              <TokenInfoItem
                title={`Pooled ${pairInfo?.base_info?.token1?.symbol}`}
                value={`${new BigNumber(pairInfo?.base_info?.reserve1).toFormat(2)}`}
              />
              <TokenInfoItem
                title="Total tx"
                value={`${new BigNumber(pairInfo?.base_info?.txCount).toFormat(0)}`}
              />
              <TokenInfoItem
                title="Holders"
                value={`${
                  tokenInfoFromBackend?.pair?.token_being_reviewed?.holders_count
                    ? new BigNumber(
                        tokenInfoFromBackend?.pair?.token_being_reviewed?.holders_count,
                      ).toFormat(0)
                    : 'No data'
                }`}
              />
              <TokenInfoItem
                title="Market cap"
                value={
                  tokenInfoFromBackend?.pair?.token_being_reviewed?.circulating_supply
                    ? `$${new BigNumber(
                        +tokenInfoFromBackend?.pair?.token_being_reviewed?.circulating_supply *
                          +tbr.derivedUSD,
                      ).toFormat(2)}`
                    : 'No data'
                }
              />
              <TokenInfoItem
                title="Diluted Market cap"
                value={
                  tokenInfoFromBackend?.pair?.token_being_reviewed?.total_supply
                    ? `$${new BigNumber(
                        +tokenInfoFromBackend?.pair?.token_being_reviewed?.total_supply,
                      )
                        .multipliedBy(+tbr.derivedUSD)
                        .toFormat(2)}`
                    : 'No data'
                }
              />
            </div>
            <div className={s.card_section}>
              <LessScore
                txCount={pairInfo?.base_info?.txCount}
                holdersCount={tokenInfoFromBackend?.pair?.token_being_reviewed?.holders_count || 0}
                cost24H={tokenPrice24HoursChange}
                links={tokenInfoFromBackend?.pair?.token_being_reviewed?.chat_urls || ['']}
                totalLiquidity={pairInfo?.base_info?.reserveUSD}
              />
            </div>
            <div className={`${s.card_section} ${s.card_section__last}`}>
              <CommunityTrust
                likes={tokenInfoFromBackend?.pair?.likes || 0}
                dislikes={tokenInfoFromBackend?.pair?.dislikes || 0}
                currentVote={tokenInfoFromBackend?.vote || 0}
                pairId={pairId}
              />
            </div>
          </div>
        )}
      </section>
    );
  },
);

export default PairInfoBody;
