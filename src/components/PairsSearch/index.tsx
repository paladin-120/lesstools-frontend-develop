import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useLocation } from 'react-router-dom';

import Suggestion from './Suggestion/index';
import OutsideAlerter from '../../utils/outsideClickWrapper';
import Search from '../Search/index';
import {
  SEARCH_BY_ID,
  SEARCH_BY_NAME,
  SEARCH_BY_ID_SUSHISWAP,
  SEARCH_BY_NAME_SUSHISWAP,
} from '../../queries/index';
import { IPairsBySymbol } from '../../types/search';
import { useMst } from '../../store/store';
import { useElementWidth } from '../../hooks/useElementWidth';
import s from './PairsSearch.module.scss';
import { uppercaseFirstLetter } from '../../utils/prettifiers';
import { uniqueArrayOfObjectsByKey } from '../../utils/comparers';
import { ExchangesByNetworks, isExchangeLikeSushiswap } from '../../config/exchanges';
import TheGraph from '../../services/TheGraph';
import { SubgraphsByExchangeShort } from '../../config/subgraphs';
import { Networks, NetworksForSidebar } from '../../config/networks';
import Popup from '../Popup';

// при вводе в поиск символы токенов форматирует их
const formatTokens = (name: string) => {
  // from (weth/less || weth less) to ["weth", "less"]
  let tokens = name
    .replace(/\s/g, '/')
    .split('/')
    .filter((token) => !!token);
  if (tokens.length < 1) tokens = [' ', ' '];
  return tokens.map((token) => token.toUpperCase());
};

interface IPairSearchProps {
  placeholder: string;
  big?: boolean;
  defaultNetwork?: string;
}

function debounce(fn: (...args: any) => void, ms: number) {
  let timer: NodeJS.Timeout;
  return function (args: any) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn(args);
    }, ms);
  };
}

const PairSearch: React.FC<IPairSearchProps> = observer((props) => {
  const { big = false, placeholder } = props;

  const [value, setValue] = useState('');
  const [searchByIdDataPlain, setSearchByIdDataPlain] = useState<any[]>([]);
  const [searchByNameDataPlain, setSearchByNameDataPlain] = useState<any[]>([]);
  const [searchByIdData, setSearchByIdData] = useState<any>();
  const [searchByNameData, setSearchByNameData] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);

  const { currentExchange } = useMst();

  const location = useLocation();
  const defaultNetwork = uppercaseFirstLetter(location.pathname.split('/')[1].toLowerCase());

  const [network, setNetwork] = useState<string>(defaultNetwork || Networks.Ethereum);

  const exchanges = useMemo(
    () => ExchangesByNetworks[uppercaseFirstLetter(network.toLowerCase())] || [],
    [network],
  );

  // const getDataFromAllExchangesOfAllNetworks = useCallback(
  //   async (variables: any) => {
  //     try {
  //       const results: Promise<any>[] = [];
  //       const networks = Object.keys(Networks);
  //       networks.map((net: string) => {
  //         const exchangesObject = ExchangesByNetworks[net] || [];
  //         const exchangesOfNetwork = Object.values(exchangesObject);
  //         exchangesOfNetwork.map((exchangeOfNetwork: any) => {
  //           const resultFromExchange = TheGraph.query({
  //             subgraph: SubgraphsByExchangeShort[exchangeOfNetwork],
  //             query: isExchangeLikeSushiswap(exchangeOfNetwork)
  //               ? SEARCH_BY_NAME_SUSHISWAP
  //               : SEARCH_BY_NAME,
  //             variables,
  //           });
  //           results.push(resultFromExchange);
  //           return null;
  //         });
  //         return null;
  //       })
  //       const result = await Promise.all(results);
  //       console.log('PairsSearch getDataFromAllExchangesOfAllNetworks:', {
  //         result,
  //       });
  //       return result;
  //     } catch (e) {
  //       console.error('PairsSearch getDataFromAllExchangesOfAllNetworks:', e);
  //       return null;
  //     }
  //   },
  //   [],
  // );

  // запросы на граф
  const searchById = useCallback(
    async (variables: any) => {
      try {
        const exchangesOfNetwork = Object.values(exchanges);
        if (!exchangesOfNetwork.length) return;
        const results = exchangesOfNetwork.map((exchangeOfNetwork: any) => {
          return TheGraph.query({
            subgraph: SubgraphsByExchangeShort[exchangeOfNetwork],
            query: isExchangeLikeSushiswap(exchangeOfNetwork)
              ? SEARCH_BY_ID_SUSHISWAP
              : SEARCH_BY_ID,
            variables,
          });
        });
        const result = await Promise.all(results);
        console.log('PairSearch searchById:', { result });
        setSearchByIdDataPlain(result || []);
      } catch (e) {
        console.error(e);
      }
    },
    [exchanges],
  );

  const searchByName = useCallback(
    async (variables: any) => {
      try {
        const exchangesOfNetwork = Object.values(exchanges);
        if (!exchangesOfNetwork.length) return;
        const results = exchangesOfNetwork.map((exchangeOfNetwork: any) => {
          return TheGraph.query({
            subgraph: SubgraphsByExchangeShort[exchangeOfNetwork],
            query: isExchangeLikeSushiswap(exchangeOfNetwork)
              ? SEARCH_BY_NAME_SUSHISWAP
              : SEARCH_BY_NAME,
            variables,
          });
        });
        const result = await Promise.all(results);
        console.log('PairSearch searchByName:', { result });
        setSearchByNameDataPlain(result || []);
      } catch (e) {
        console.error(e);
      }
    },
    [exchanges],
  );

  // формирование пар по символу (форматирование данных с графа в нужный формат)
  const [pairsByNameData, setPairsByNameData] = useState<IPairsBySymbol>([]);

  useEffect(() => {
    const tokens = formatTokens(value);
    if (tokens.length > 1) {
      const data = searchByNameData?.match_by_symbol.map((token: any) => {
        return {
          id: token.id,
          symbol: token.symbol,
          pairBase: token.pairBase.filter((pairBase: any) =>
            pairBase.token1.symbol.includes(tokens[1]),
          ),
          pairQuote: token.pairQuote.filter((pairQuote: any) =>
            pairQuote.token0.symbol.includes(tokens[1]),
          ),
        };
      });
      setPairsByNameData(data || []);
    } else {
      setPairsByNameData(searchByNameData?.match_by_symbol || []);
    }
  }, [searchByNameData, value]);

  // поиск пар по (id пары, id токена) или (симоволу токена)
  const debouncedSearch = React.useMemo(
    () =>
      debounce((searchValue: string) => {
        if (searchValue.length < 3) return;
        if (searchValue.startsWith('0x')) {
          searchById({ id: searchValue });
        } else {
          // todo: loop through all networks and concat all results
          // getDataFromAllExchangesOfAllNetworks({
          //   name: formatTokens(searchValue)[0] || '',
          //   name2: formatTokens(searchValue)[1] || '',
          // });
          searchByName({
            name: formatTokens(searchValue)[0] || '',
            name2: formatTokens(searchValue)[1] || '',
          });
        }
      }, 500),
    [searchById, searchByName],
  );

  const concatenateSearchByIdData = useCallback(async () => {
    try {
      let matchBySymbolNew: any[] = [];
      let matchBySymbol1New: any[] = [];
      searchByIdDataPlain.map((item: any) => {
        if (!item) return null;
        const { match_by_symbol, match_by_symbol1 } = item;
        matchBySymbolNew = matchBySymbolNew.concat(match_by_symbol || []);
        matchBySymbol1New = matchBySymbol1New.concat(match_by_symbol1 || []);
        return null;
      });
      const dataNew = {
        match_by_symbol: uniqueArrayOfObjectsByKey(matchBySymbolNew, 'id'),
        match_by_symbol1: uniqueArrayOfObjectsByKey(matchBySymbol1New, 'id'),
      };
      console.log('PairSearch concatenateSearchByIdData:', dataNew);
      setSearchByIdData(dataNew);
    } catch (e) {
      console.error(e);
    }
  }, [searchByIdDataPlain]);

  useEffect(() => {
    if (!searchByIdDataPlain || !searchByIdDataPlain.length) return;
    concatenateSearchByIdData();
  }, [searchByIdDataPlain, concatenateSearchByIdData]);

  const concatenateSearchByNameData = useCallback(async () => {
    try {
      let matchBySymbolNew: any[] = [];
      let matchBySymbol1New: any[] = [];
      searchByNameDataPlain.map((item: any) => {
        if (!item) return null;
        const { match_by_symbol, match_by_symbol1 } = item;
        matchBySymbolNew = matchBySymbolNew.concat(match_by_symbol || []);
        matchBySymbol1New = matchBySymbol1New.concat(match_by_symbol1 || []);
        return null;
      });
      const dataNew = {
        match_by_symbol: uniqueArrayOfObjectsByKey(matchBySymbolNew, 'id'),
        match_by_symbol1: uniqueArrayOfObjectsByKey(matchBySymbol1New, 'id'),
      };
      console.log('PairSearch concatenateSearchByIdData:', dataNew);
      setSearchByNameData(dataNew);
      setLoading(false);
    } catch (e) {
      console.error(e);
    }
  }, [searchByNameDataPlain]);

  useEffect(() => {
    if (!searchByNameDataPlain || !searchByNameDataPlain.length) return;
    concatenateSearchByNameData();
  }, [searchByNameDataPlain, concatenateSearchByNameData]);

  const searchPairs = useCallback(
    (str: string) => {
      if (str.length >= 3) setLoading(true);
      debouncedSearch(str);
    },
    [debouncedSearch],
  );

  // при нажатии за пределами поиска закрывать предложения
  const [isClickedOutside, setIsClickedOutside] = useState(false);
  const isActive = value.length && !isClickedOutside && (searchByIdData || searchByNameData);

  const onInputFocus = () => {
    setIsClickedOutside(false);
  };

  const searchBlock = useRef<HTMLDivElement>(null);

  const width = useElementWidth(searchBlock);

  useEffect(() => {
    if (value.length >= 3) searchPairs(value);
  }, [network, searchPairs, value]);

  return (
    <OutsideAlerter
      fn={() => {
        setLoading(false);
        setIsClickedOutside(true);
      }}
    >
      <div className={s.search} ref={searchBlock}>
        <Search
          big={big}
          value={value}
          setValue={setValue}
          onChange={searchPairs}
          placeholder={placeholder}
          onFocus={onInputFocus}
          loading={loading}
        >
          {!defaultNetwork && (
            <Popup
              defaultValue={Networks.Ethereum}
              items={Object.values(NetworksForSidebar)}
              onChange={setNetwork}
            />
          )}
        </Search>
        {!!isActive && (
          <div className={s.suggestions}>
            <div className={s.suggestions_title}>
              Search results in <span>{network}</span>
            </div>
            <div className={s.suggestions_body}>
              <div className={s.suggestions_body__inner}>
                {searchByIdData?.match_by_pair[0] && (
                  <>
                    {/* FIRST PAIR BY PAIR ID */}
                    <Suggestion
                      networkProps={network.toLowerCase()}
                      otherSymbol={searchByIdData?.match_by_pair[0].token1.symbol}
                      tbrSymbol={searchByIdData?.match_by_pair[0].token0.symbol}
                      tbrName={searchByIdData?.match_by_pair[0].token0.name}
                      tokenId={searchByIdData?.match_by_pair[0].token0.id}
                      pairId={searchByIdData?.match_by_pair[0].id}
                      holders="soon"
                      txCount={searchByIdData?.match_by_pair[0].txCount}
                      onClick={() => setIsClickedOutside(true)}
                      exchange={currentExchange.exchange}
                      small={width < 500}
                    />
                    {/* TODO: ADD TYPES FOR TOKENS */}
                    {/* PAIRS SEARCHED BY TOKEN ID */}
                    {searchByIdData.match_by_token[0].pairBase?.map((pair: any) => {
                      return (
                        <Suggestion
                          networkProps={network.toLowerCase()}
                          key={pair.id}
                          otherSymbol={pair.token1.symbol}
                          tbrSymbol={pair.token0.symbol}
                          tbrName={pair.token0.name}
                          tokenId={pair.token0.id}
                          pairId={pair.id}
                          holders="soon"
                          txCount={pair.txCount}
                          onClick={() => setIsClickedOutside(true)}
                          exchange={currentExchange.exchange}
                          small={width < 500}
                        />
                      );
                    })}
                  </>
                )}
                {/* PAIRS SEARCHED BY TOKEN SYMBOL */}
                {/* pairBase */}
                {pairsByNameData.length > 0 && (
                  <>
                    {pairsByNameData.map((symbol) =>
                      symbol.pairBase.map((symbolData) => (
                        <Suggestion
                          networkProps={network.toLowerCase()}
                          key={symbolData.id}
                          otherSymbol={symbolData.token1.symbol}
                          tbrSymbol={symbolData.token0.symbol}
                          tbrName={symbolData.token0.name}
                          tokenId={symbolData.token0.id}
                          pairId={symbolData.id}
                          holders="soon"
                          txCount={symbolData.txCount}
                          onClick={() => setIsClickedOutside(true)}
                          exchange={currentExchange.exchange}
                          small={width < 500}
                        />
                      )),
                    )}
                    {pairsByNameData.map((symbol) =>
                      symbol.pairQuote.map((symbolData) => (
                        <Suggestion
                          networkProps={network.toLowerCase()}
                          key={symbolData.id}
                          otherSymbol={symbolData.token0.symbol}
                          tbrSymbol={symbolData.token1.symbol}
                          tbrName={symbolData.token1.name}
                          tokenId={symbolData.token1.id}
                          pairId={symbolData.id}
                          holders="soon"
                          txCount={symbolData.txCount}
                          onClick={() => setIsClickedOutside(true)}
                          exchange={currentExchange.exchange}
                          small={width < 500}
                        />
                      )),
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </OutsideAlerter>
  );
});

export default PairSearch;
