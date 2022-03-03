import { Helmet } from 'react-helmet';
import { observer } from 'mobx-react-lite';
import { v4 as uuid } from 'uuid';

import PairsSearch from '../../components/PairsSearch/index';
import HotTable from './HotTable/index';
import Tool from './Tool/index';
// import Partner from './Partner/index';
import { useMst } from '../../store/store';
import s from './BoardPage.module.scss';
import React from 'react';
import { NetworksIcons, NetworksForTools, DefaultPairsByNetwork } from '../../config/networks';

const BoardPage: React.FC = observer(() => {
  const { hotPairs } = useMst();

  return (
    <main className={s.board}>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Board - LessTools</title>
        <meta
          name="description"
          content="Multi-Chain Decentralized
Fundraising Capital"
        />
      </Helmet>

      <div className={s.bg}>
        <div className={s.container}>
          {/* <AdBlock adImg={AdImg} /> */}
          <div className={s.containerForSearch}>
            <PairsSearch
              big
              placeholder="Search pairs by token symbol / token id / pair contract id"
            />
          </div>

          <div className={s.containerForTables}>
            <div className={s.tools}>
              {Object.entries(NetworksForTools).map((item: any) => {
                const [network, networkName] = item;
                const defaultPair = DefaultPairsByNetwork[network];
                return (
                  <Tool
                    key={uuid()}
                    title={`${networkName}`}
                    icon={NetworksIcons[network]}
                    links={[
                      `/${network.toLowerCase()}/live-new-pairs`,
                      `/${network.toLowerCase()}/pair-explorer/${defaultPair}`,
                      `/${network.toLowerCase()}/big-swap-explorer`,
                    ]}
                    keyName="uni"
                  />
                );
              })}
            </div>

            <div className={s.tables}>
              <HotTable title="HOT PAIRS" pairs={hotPairs} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
});

export default BoardPage;
