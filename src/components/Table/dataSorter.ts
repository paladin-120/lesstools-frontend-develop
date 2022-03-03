import { sorter } from '../../utils/sorter';
import { IRowBigSwap, IRowLiveNewPairs, IRowPairExplorer } from '../../types/table';

// сортирует массив
export const dataSorter = (
  tableData: Array<IRowBigSwap | IRowLiveNewPairs | IRowPairExplorer>,
  defaultData: Array<IRowBigSwap | IRowLiveNewPairs | IRowPairExplorer>,
  key: string,
  sortCount: number,
  sortType: 'string' | 'date' | 'number' | 'tokenPrice' = 'string',
  isUsd: boolean,
): Array<IRowBigSwap | IRowLiveNewPairs | IRowPairExplorer> => {
  if (sortCount === 3) return defaultData;
  const newData = tableData.sort((a, b) => sorter(a, b, key, sortCount, sortType, isUsd));
  return newData;
};
