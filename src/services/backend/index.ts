import axios from 'axios';
import config from '../../config/index';

export type PLATFORM = 'ETH' | 'BSC' | 'POLYGON ';

type IPostMetamaskLoginProps = {
  address: string;
  msg: string;
  signed_msg: string;
};

type IGetTokenAdditionalInfoProps = {
  pair_address: string;
  token_address: string;
  token_name: string;
  token_symbol: string;
  platform: string;
};

type IVoteForPair = {
  pair_address: string;
  platform: PLATFORM;
  vote: 1 | -1;
  token: string;
};

type IAddPairToFavorite = {
  pair_address: string;
  platform: PLATFORM;
};

export type IAdminToken = {
  name: string;
  address: string;
  image: string;
};

export type IAdditionalInfoFromBackend = {
  pair: {
    address: string;
    dislikes: number;
    likes: number;
    is_favourite_of_current_user: boolean;
    platform: PLATFORM;
    token_being_reviewed: {
      bsc_address: null | string;
      fantom_address: null | string;
      xdai_address: null | string;
      chat_urls: Array<string>;
      circulating_supply: string;
      cmc_id: number;
      cmc_slug: string;
      eth_address: string;
      holders_count: number;
      name: string;
      polygon_address: null | string;
      symbol: string;
      total_supply: string;
      twitter_url: string;
      website_url: string;
    };
  };
  vote: 0 | -1 | 1;
};

type IGetFavoritesOfUser = {
  platform: PLATFORM;
};

type ICandlesDataFromOurBackend = {
  candles: number;
  pair_id: string;
  pool: string;
  time_interval: string;
  fsym: string;
  tsym: string;
  fromTs: string;
  toTs: string;
  faddress: string;
  taddress: string;
};

class BackendService {
  private axios: any;

  constructor() {
    this.axios = axios.create({
      baseURL: config.APIS.backend,
      // withCredentials: true,
    });
  }

  // METAMASK LOGIN
  getMetamaskMessage = async () => {
    try {
      const message = await this.axios.get('/accounts/get_metamask_message/');
      return { data: message.data };
    } catch (error) {
      return { data: null, error };
    }
  };

  postMetamaskLogin = async (data: IPostMetamaskLoginProps) => {
    try {
      const res = await this.axios.post('/accounts/metamask_login/', {
        address: data.address,
        msg: data.msg,
        signed_msg: data.signed_msg,
      });
      return { data: res.data };
    } catch (error) {
      return { data: '', error };
    }
  };

  // TOKEN PAIR INFO
  getTokenPairAdditionalData = async (data: IGetTokenAdditionalInfoProps) => {
    try {
      const res: {
        data: IAdditionalInfoFromBackend;
      } = await this.axios.post('/analytics/pair_info', {
        pair_address: data.pair_address,
        token_address: data.token_address,
        token_name: data.token_name,
        token_symbol: data.token_symbol,
        platform: data.platform,
      });
      return { data: res.data };
    } catch (error) {
      return { data: null, error };
    }
  };

  // VOTE FOR PAIR
  voteForPair = async (data: IVoteForPair) => {
    const headers = {
      Authorization: `Token ${data.token}`,
    };
    const dataPost = {
      pair_address: data.pair_address,
      platform: data.platform,
      vote: data.vote,
    };
    try {
      const res: { data: IAdditionalInfoFromBackend } = await this.axios.post(
        '/analytics/pair_vote',
        dataPost,
        {
          headers,
        },
      );
      return { data: res.data };
    } catch (error) {
      return { data: null, error };
    }
  };

  addOrRemovePairToFavorite = async (data: IAddPairToFavorite) => {
    const headers = {
      Authorization: `Token ${localStorage.getItem('lesstools_token')}`,
    };

    try {
      const res = await this.axios.post(
        '/accounts/add_or_remove_favourite_pair/',
        {
          pair_address: data.pair_address,
          platform: data.platform,
        },
        { headers },
      );

      return { data: res.data };
    } catch (error) {
      return { data: null, error };
    }
  };

  getFavoritesOfUser = async (data: IGetFavoritesOfUser) => {
    const headers = {
      Authorization: `Token ${localStorage.getItem('lesstools_token')}`,
    };
    try {
      const res = await this.axios.get(`/accounts/favourite_pairs/${data.platform}`, {
        headers,
      });
      return { data: res.data };
    } catch (error) {
      return { data: null, error };
    }
  };

  getUserPlan = async () => {
    const headers = {
      Authorization: `Token ${localStorage.getItem('lesstools_token')}`,
    };
    try {
      const res = await this.axios.get('/accounts/', { headers });
      return { data: res.data };
    } catch (error) {
      return {
        data: null,
        error,
      };
    }
  };

  getPlanPrices = async () => {
    try {
      const res = await this.axios.get('/accounts/price/');
      return { data: res.data };
    } catch (error) {
      return { data: null, error };
    }
  };

  getCandlesFromOurBackned = async (data: ICandlesDataFromOurBackend) => {
    try {
      const res = await this.axios.get(
        `/analytics/candles/${data.pair_id}&${data.pool}&${data.time_interval}&${data.candles}&${data.fromTs}&${data.toTs}&${data.fsym}&${data.tsym}&${data.faddress}&${data.taddress}`,
      );
      return res;
    } catch (error) {
      return { data: null, error };
    }
  };

  getAdminTokens = async () => {
    try {
      const res: {
        data: {
          main_token: IAdminToken;
          pairs: Array<IAdminToken>;
        };
      } = await this.axios.get('/analytics/admin_tokens');
      return res.data;
    } catch (error) {
      return null;
    }
  };
}

export default new BackendService();
