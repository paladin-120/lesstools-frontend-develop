import { useCallback, useMemo, useState } from 'react';
import TheGraph from '../services/TheGraph';
import { SubgraphsByExchangeShort } from '../config/subgraphs';
import { ExchangesByNetworks } from '../config/exchanges';
import { uppercaseFirstLetter } from '../utils/prettifiers';

// use when query is the same for all subgraphs
export const useGetDataForAllExchanges = (props: any) => {
  const { network, defaultData, query, variables } = props;

  const [data, setData] = useState<any>(defaultData);

  const exchanges = useMemo(
    () => ExchangesByNetworks[uppercaseFirstLetter(network.toLowerCase())] || [],
    [network],
  );

  const getData = useCallback(async () => {
    try {
      const exchangesOfNetwork = Object.values(exchanges);
      console.log('useGetDataForAllExchanges:', { exchanges, exchangesOfNetwork });
      if (!exchangesOfNetwork.length) return;
      const results = exchangesOfNetwork.map((exchangeOfNetwork: any) => {
        return TheGraph.query({
          subgraph: SubgraphsByExchangeShort[exchangeOfNetwork],
          query,
          variables,
        });
      });
      const result = await Promise.all(results);
      setData(result);
    } catch (e) {
      console.error(e);
    }
  }, [exchanges, query, variables]);

  return [data, getData];
};
