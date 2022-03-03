import React, { useEffect, useState } from 'react';

import s from './TradingviewWidget.module.scss';
import Datafeed from './datafeed';
import { formalizePairAsInWhitelistBySymbols } from '../../utils/formalizePairAsInWhitelist';

import './styles.css';

import Loader from '../Loader';

export interface InterfaceTradingviewWidgetProps {
  containerId?: string;
  symbol?: string;
  interval?: string;
  libraryPath?: string;
  chartsStorageUrl?: string;
  chartsStorageApiVersion?: string;
  clientId?: string;
  userId?: string;
  fullscreen?: boolean;
  autosize?: boolean;
  studiesOverrides?: any;
}

function getLanguageFromURL() {
  const regex = new RegExp('[\\?&]lang=([^&#]*)');
  const results = regex.exec(window.location.search);
  return results === null ? null : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

const TradingviewWidget: React.FC<InterfaceTradingviewWidgetProps> = React.memo((props) => {
  const [isLoaded, setIsLoaded] = useState(false);

  const {
    symbol = 'Coinbase:BTC/USD',
    interval = '30',
    containerId = 'tv_chart_container',
    libraryPath = '/charting_library/',
    chartsStorageUrl = 'https://saveload.tradingview.com',
    chartsStorageApiVersion = '1.1',
    clientId = 'tradingview.com',
    userId = 'public_user_id',
    fullscreen = false,
    autosize = true,
    studiesOverrides = {},
  } = props;

  const split_symbol = symbol.split(/[:/]/);

  useEffect(() => {
    const [primaryToken, monitoringToken] = formalizePairAsInWhitelistBySymbols(
      split_symbol[0],
      split_symbol[1],
    );
    const widgetOptions = {
      debug: false,
      symbol: `${monitoringToken}/${primaryToken}`,
      interval,
      datafeed: Datafeed,
      // interval,
      // toolbar_bg: "#1a103d",
      container_id: containerId,
      library_path: libraryPath,
      time_frames: [
        { text: '5y', resolution: '1W' },
        { text: '1y', resolution: '1D' },
        { text: '6m', resolution: '1D' },
        { text: '3m', resolution: '120' },
        { text: '1m', resolution: '60' },
        { text: '5d', resolution: '5' },
        { text: '1d', resolution: '1' },
      ],
      locale: getLanguageFromURL() || 'en',
      disabled_features: ['use_localstorage_for_settings'],
      charts_storage_url: chartsStorageUrl,
      charts_storage_api_version: chartsStorageApiVersion,
      theme: 'dark',
      client_id: clientId,
      user_id: userId,
      fullscreen,
      autosize,
      studies_overrides: studiesOverrides,
      custom_css_url: './styles.css',
      overrides: {
        'mainSeriesProperties.style': 1,
        'paneProperties.backgroundType': 'solid',
        'paneProperties.background': '#000000',
        'paneProperties.vertGridProperties.color': '#000000',
        'paneProperties.horzGridProperties.color': '#000000',
        'scalesProperties.textColor': '#AAA',
        'scalesProperties.lineColor': '#ffffff',
        'scalesProperties.backgroundColor': '#000000',
      },
    };

    // eslint-disable-next-line no-multi-assign,new-cap
    const widget = ((window as any).tvWidget = new (window as any).TradingView.widget(
      widgetOptions,
    ));

    widget.onChartReady(() => {
      setIsLoaded(true);
    });

    widget.headerReady().then(function () {
      let isUsd = false;
      const [mainToken, shittoken] = formalizePairAsInWhitelistBySymbols(
        split_symbol[0],
        split_symbol[1],
      );

      const button = widget.createButton();
      button.setAttribute('title', 'Change pair');
      button.textContent = `${shittoken}/USD`;
      button.addEventListener('click', function () {
        if (!isUsd) {
          widget.setSymbol(`${shittoken}/USD`, '60');
          button.textContent = symbol;
          isUsd = true;
        } else {
          widget.setSymbol(`${shittoken}/${mainToken}`, '60');
          button.textContent = `${shittoken}/USD`;
          isUsd = false;
        }
      });
    });

    // });
    return () => (window as any).tvWidget.remove();
  }, [
    symbol,
    interval,
    containerId,
    libraryPath,
    chartsStorageUrl,
    chartsStorageApiVersion,
    clientId,
    userId,
    fullscreen,
    autosize,
    studiesOverrides,
    split_symbol,
  ]);

  return (
    <>
      {!isLoaded && (
        <div className={s.loader}>
          <Loader />
        </div>
      )}
      <div id={containerId} className={s.container} />
    </>
  );
});

export default TradingviewWidget;
