import etherscan from '../assets/img/icons/table/actions-etherscan.svg';
import bsc from '../assets/img/icons/table/actions-bsc.svg';
import polygon from '../assets/img/icons/table/actions-polygon.svg';
import xdai from '../assets/img/icons/table/actions-xdai.svg';
import avalanche from '../assets/img/icons/table/actions-avalanche.svg';
import fantom from '../assets/img/icons/table/actions-fantom.svg';

export const getNetworkImage = (actionNetwork: string) => {
  let src;

  switch (actionNetwork) {
    case 'binance':
      src = bsc;
      break;
    case 'ethereum':
      src = etherscan;
      break;
    case 'polygon':
      src = polygon;
      break;
    case 'xdai':
      src = xdai;
      break;
    case 'avalanche':
      src = avalanche;
      break;

    default:
      src = fantom;
      break;
  }
  return <img src={src} alt={`${src}`} style={{ width: '20px', height: '20px' }} />;
};
