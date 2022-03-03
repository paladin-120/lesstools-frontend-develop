export const GET_LIVE_SWAPS_UNI_2 = `
  query getLiveSwaps {
    pairs(first: 100, orderBy: createdAtTimestamp, orderDirection: desc) {
      id
      createdAtTimestamp
      reserve0
      reserve1
      reserveUSD
      token0 {
        id
        symbol
        derivedETH
      }
      token1 {
        id
        symbol
        derivedETH
      }
    }
  }
`;

export const GET_PAIR_INFO_UNI_2 = `
  query Pair($id: ID!, $blockNumber: Int) {
    base_info: pair(id: $id) {
      reserveUSD
      reserve0
      reserve1
      token0 {
        name
        symbol
        derivedETH
        totalSupply
        id
      }
      token1 {
        name
        symbol
        derivedETH
        totalSupply
        id
      }
      txCount
      liquidityProviderCount
      volumeUSD
      createdAtTimestamp
    }
    h24_ago_by_sum: pairHourDatas(
      first: 24
      orderBy: hourStartUnix
      orderDirection: desc
      where: { pair: $id }
    ) {
      hourlyVolumeUSD
    }
    tokens_prices_24h_ago: pair(block: { number: $blockNumber }, id: $id) {
      token0 {
        derivedETH
      }
      token1 {
        derivedETH
      }
    }
    bundle(id:1){
      ethPrice
    }
  }
`;

export const GET_PAIR_SWAPS_UNI_2 = `
  query getPairSwaps($id: ID!) {
    swaps(orderBy: timestamp, first: 250, orderDirection: desc, where: { pair: $id }) {
      pair {
        token0 {
          symbol
          id
          derivedETH
        }
        token1 {
          symbol
          id
          derivedETH
        }
      }
      timestamp
      amount0In
      amount0Out
      amount1In
      amount1Out
      from: sender
      transaction {
        id
      }
    }
    bundle(id:1){
      ethPrice
    }
  }
`;
