import axios from 'axios';
import config from '../config/index';

type TypeGetCoinInfoProps = {
  symbol: string;
};

class CoingeckoService {
  private axios: any;

  constructor() {
    this.axios = axios.create({
      baseURL: config.APIS.COINGECKO,
      // withCredentials: true,
    });
  }

  getAllCoins = async () => {
    try {
      const url = `/coins/list`;
      const result = await this.axios.get(url);
      // console.log('CoinGeckoService getAllCoins:', result);
      if (result.data.Response === 'Error') return null;
      return result.data;
    } catch (e) {
      console.error('CoinGeckoService getAllCoins:', e);
      return null;
    }
  };

  getCoinInfo = async ({ symbol }: TypeGetCoinInfoProps) => {
    try {
      const resultGetAllCoins = await this.getAllCoins();
      let coinId;
      if (resultGetAllCoins) {
        const coin = resultGetAllCoins.filter(
          (item: any) => item.symbol.toLowerCase() === symbol.toLowerCase(),
        )[0];
        coinId = coin.id;
      }
      const url = `/coins/${coinId}`;
      const result = await this.axios.get(url);
      // console.log('CoinGeckoService getCoinInfo:', result);
      if (result.data.Response === 'Error') return null;
      return result.data;
    } catch (e) {
      console.error('CoinGeckoService getCoinInfo:', e);
      return null;
    }
  };
}

export default new CoingeckoService();
