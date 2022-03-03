import React, { useState, useEffect } from 'react';
import ReactTooltip from 'react-tooltip';

import { dataConverter } from './dataConverter';
import { IRowBigSwap, IRowLiveNewPairs, IRowPairExplorer } from '../../types/table';
import TokenPriceHeader from './TokenPriceHeader';
import { dataSorter } from './dataSorter';
import { ExchangesIcons } from '../../config/exchanges';

import s from './Table.module.scss';

import sorterDown from '../../assets/img/icons/table/sort-down.svg';
import sorterUp from '../../assets/img/icons/table/sort-up.svg';
// import InfiniteScroll from 'react-infinite-scroll-component';

export type ITableHeader = Array<{
  key: string;
  title: string;
  sortType?: 'string' | 'number' | 'date' | 'tokenPrice';
}>;

interface ITableProps {
  header: ITableHeader;
  data: Array<IRowBigSwap | IRowLiveNewPairs | IRowPairExplorer>;
  tableType: 'bigSwap' | 'liveNewPairs' | 'pairExplorer';
}

const sortTypes = {
  0: 'decreasing',
  1: 'ascending',
  2: 'default',
};

const Table: React.FC<ITableProps> = React.memo(({ header, data, tableType }) => {
  const [tableData, setTableData] = useState(data);

  // для переключения usd/eth в таблице live-new-pairs
  const [isUsd, setIsUsd] = useState(false);
  const handleToogleIsUsd = () => {
    setIsUsd(!isUsd);
  };

  // dynamic pagination
  const [scrollKoef, setScrollKoef] = useState(1);
  const handleScroll = (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
    const tableFullHeight = e.currentTarget.scrollHeight;
    const scrolledHeight = e.currentTarget.clientHeight + e.currentTarget.scrollTop;
    if (scrolledHeight >= tableFullHeight / 1.001) {
      if (scrollKoef <= tableData.length / 100) setScrollKoef((prev) => prev + 1);
    }
  };

  // params to sort table
  const [sortCount, setSortCount] = useState(0);
  const [currentEl, setCurrentEl] = useState<any>(null);

  function handleSortTableData(el: any) {
    const table = document.querySelector<HTMLElement>('.table_wrap');
    if (table) {
      table.scrollTo(0, 0);
    }
    setScrollKoef(1);
    setSortCount(sortCount >= 2 ? 0 : sortCount + 1);
    setCurrentEl(sortCount >= 2 ? null : el);
    setTableData(dataSorter(tableData, [...data], el.key, sortCount + 1, el.sortType, isUsd));
  }

  function handleSortTableDataDefault(el: any) {
    const table = document.querySelector<HTMLElement>('.table_wrap');
    if (table) {
      table.scrollTo(0, 0);
    }
    setScrollKoef(1);
    setSortCount(1);
    setCurrentEl(el);
    setTableData(dataSorter(tableData, [...data], el.key, 1, el.sortType, isUsd));
  }

  useEffect(() => {
    // при обновлении данных (каждые 15 сек) - сортируются данные
    if (currentEl) {
      setTableData(
        dataSorter([...data], [...data], currentEl.key, sortCount, currentEl.sortType, isUsd),
      );
    } else setTableData([...data]);

    // eslint-disable-next-line
  }, [data]);

  useEffect(() => {
    handleSortTableDataDefault({ key: 'listedSince', sortType: 'number', title: 'Listed Since' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={`${s.table_wrap} table_wrap`} onScroll={(e) => handleScroll(e)}>
      <ReactTooltip />
      <table className={s.table}>
        <thead className={s.table_head}>
          <tr>
            {header.map((el) => (
              <th key={el.key}>
                <div className={s.th_inner}>
                  {el.key === 'tokenPrice' ? (
                    <TokenPriceHeader el={el} isUsd={isUsd} handleToogleIsUsd={handleToogleIsUsd} />
                  ) : (
                    el.title
                  )}
                  {el.sortType && (
                    <>
                      <ReactTooltip id="sort" key={sortCount} />
                      <div
                        data-for="sort"
                        data-effect="solid"
                        data-tip={`Click to sort ${sortTypes[sortCount as 0 | 1 | 2]}`}
                        tabIndex={0}
                        role="button"
                        onKeyDown={() => {}}
                        className={s.th_sorter}
                        onClick={() => handleSortTableData(el)}
                      >
                        <div className={s.th_sorter__up}>
                          {(currentEl?.key === el.key && sortCount === 1) || (
                            <img src={sorterUp} alt="up" />
                          )}
                        </div>
                        <div className={s.th_sorter__down}>
                          {(currentEl?.key === el.key && sortCount === 2) || (
                            <img src={sorterDown} alt="up" />
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>

        <tbody className={s.table_body}>
          {/* eslint-disable-next-line */}
          {/* @ts-ignore */}
          {dataConverter[tableType](tableData, isUsd)
            .slice(0, scrollKoef * 100)
            .map((row: any, i: number) => {
              return (
                <tr
                  key={`${JSON.stringify(tableData[i])}${i * i}`}
                  className={i % 2 === 0 ? s.even : s.odd}
                >
                  {Object.values(row)
                    .slice(0, -1)
                    .map((cell: any, index) => {
                      if (index === 1) {
                        return (
                          <>
                            <th key={`${JSON.stringify(tableData[i])}${index * index}`}>
                              <img src={ExchangesIcons[cell]} alt="" />
                            </th>
                          </>
                        );
                      }
                      return (
                        <>
                          <th key={`${JSON.stringify(tableData[i])}${index * index}`}>
                            <span>{cell}</span>
                          </th>
                        </>
                      );
                    })}
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
});

export default Table;
