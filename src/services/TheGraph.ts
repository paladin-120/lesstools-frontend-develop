import axios from 'axios';
import config from '../config/index';

type TypePropsGetPairSwaps = {
  subgraph: string;
  query: string;
  variables?: any;
};

class TheGraphService {
  private axios: any;

  constructor() {
    this.axios = axios.create({
      baseURL: config.APIS.THE_GRAPH,
      withCredentials: false,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });
  }

  query = async (props: TypePropsGetPairSwaps) => {
    try {
      const { subgraph, query, variables = {} } = props;
      const result = await this.axios.post(subgraph, {
        query,
        variables,
      });
      // console.log('TheGraph query:', result);
      if (result.data.Response === 'Error') return null;
      return result.data.data;
    } catch (e) {
      console.error('TheGraph query:', e);
      return null;
    }
  };
}

export default new TheGraphService();
