import { gql } from '@apollo/client';

// get pair-info-card at pair-explorer page UNISWAP
export const GET_PAIR_INFO = `
  query Pair($id: ID!, $blockNumber: Int) {
    base_info: pair(id: $id) {
      reserveUSD
      reserve0
      reserve1
      token0 {
        name
        symbol
        derivedETH
        derivedUSD
        totalSupply
        id
      }
      token1 {
        name
        symbol
        derivedETH
        derivedUSD
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
        derivedUSD
      }
      token1 {
        derivedETH
        derivedUSD
      }
    }
  }
`;

// get pair-info-card at pair-explorer page SUSHISWAP
export const GET_PAIR_INFO_SUSHIWAP = `
  query Pair($id: ID!, $blockNumber: Int) {
    base_info: pair(id: $id) {
      reserveUSD
      reserve0
      reserve1
      token0 {
        name
        symbol
        derivedETH
        derivedUSD
        totalSupply
        id
      }
      token1 {
        name
        symbol
        derivedETH
        derivedUSD
        totalSupply
        id
      }
      txCount
      liquidityProviderCount
      volumeUSD
      createdAtTimestamp: timestamp
    }
    h24_ago_by_sum: pairHourDatas(
      first: 24
      orderBy: date
      orderDirection: desc
      where: { pair: $id }
    ) {
      hourlyVolumeUSD: volumeUSD
    }
    tokens_prices_24h_ago: pair(block: { number: $blockNumber }, id: $id) {
      token0 {
        derivedETH
        derivedUSD
      }
      token1 {
        derivedETH
        derivedUSD
      }
    }
  }
`;

// GET BLOCK NUMBER 24h AGO
export const GET_BLOCK_24H_AGO = `
  query blocks($timestamp: BigInt!) {
    blocks(
      first: 1
      orderBy: timestamp
      orderDirection: asc
      where: { timestamp_gte: $timestamp }
    ) {
      id
      number
    }
  }
`;

// GET BLOCK NUMBER NOW
export const GET_LAST_BLOCK = `
  query _meta {
    _meta {
      block {
        hash
        number
      }
    }
  }
`;

// GET all pair swaps for table at pair explorer page
export const GET_PAIR_SWAPS = `
  query getPairSwaps($id: ID!) {
    swaps(orderBy: timestamp, first: 250, orderDirection: desc, where: { pair: $id }) {
      pair {
        token0 {
          symbol
          id
        }
        token1 {
          symbol
          id
        }
      }
      timestamp
      amount0In
      amount0Out
      amount1In
      amount1Out
      token0PriceETH
      token0PriceUSD
      token1PriceETH
      token1PriceUSD
      from
      transaction {
        id
      }
    }
  }
`;

// big swaps table (sushiswap and uniswap)
export const GET_BIG_SWAPS = `
  query getBigSwaps($lowerThreshold: BigDecimal) {
    swaps(orderBy: timestamp, orderDirection: desc, where: { amountUSD_gt: $lowerThreshold }) {
      timestamp

      pair {
        reserve0
        reserve1
        id
        token0 {
          symbol
          id
        }
        token1 {
          symbol
          id
        }
      }

      amount0In
      amount0Out
      amount1In
      amount1Out

      transaction {
        id
      }

      amountUSD
    }
  }
`;

// live new pairs table
export const GET_LIVE_SWAPS = `
  query getLiveSwaps {
    pairs(first: 100, orderBy: createdAtTimestamp, orderDirection: desc) {
      id
      createdAtTimestamp
      creationTxnHash
      reserve0
      reserve1
      initialReserve0
      initialReserve1
      reserveUSD
      token0 {
        id
        symbol
        derivedETH
        derivedUSD
      }
      token1 {
        id
        symbol
        derivedETH
        derivedUSD
      }
    }
  }
`;

// live new pairs table SUSHISWAP
export const GET_LIVE_SWAPS_SUSHISWAP = `
  query getLiveSwaps {
    pairs(first: 100, orderBy: timestamp, orderDirection: desc) {
      id
      createdAtTimestamp: timestamp
      creationTxnHash
      reserve0
      reserve1
      initialReserve0
      initialReserve1
      reserveUSD
      token0 {
        id
        symbol
        derivedETH
        derivedUSD
      }
      token1 {
        id
        symbol
        derivedETH
        derivedUSD
      }
    }
  }
`;

// ETH price now
export const ETH_PRICE_QUERY = gql`
  query ethPrice {
    bundle(id: "1") {
      ethPrice
    }
  }
`;

// SEARCHING QUERIES
// SEARCH BY PAIR ID OR TOKEN ID
export const SEARCH_BY_ID = `
  query getPairByPairId($id: ID) {
    match_by_pair: pairs(where: { id_gte: $id }, first: 3) {
      id
      txCount
      token0 {
        id
        symbol
        name
      }
      token1 {
        id
        symbol
        name
      }
    }
    match_by_token: tokens(where: { id_gte: $id }, first: 3) {
      id
      pairBase {
        id
        txCount
        token0 {
          id
          symbol
          name
        }
        token1 {
          id
          symbol
          name
        }
      }
    }
  }
`;

// search by id SUSHISWAP
export const SEARCH_BY_ID_SUSHISWAP = `
  query getPairByPairId($id: ID) {
    match_by_pair: pairs(where: { id_gte: $id }, first: 3) {
      id
      txCount
      token0 {
        id
        symbol
        name
      }
      token1 {
        id
        symbol
        name
      }
    }
    match_by_token: tokens(where: { id_gte: $id }, first: 3) {
      id
      pairBase: basePairs {
        id
        txCount
        token0 {
          id
          symbol
          name
        }
        token1 {
          id
          symbol
          name
        }
      }
    }
  }
`;

// SEARCH BY TOKEN NAME
export const SEARCH_BY_NAME = `
  query searchByName($name: String, $name2: String) {
    match_by_symbol: tokens(where: { symbol_contains: $name }) {
      id
      symbol
      pairBase {
        id
        txCount
        token0 {
          symbol
          name
          id
        }
        token1 {
          symbol
          name
          id
        }
      }
      pairQuote {
        id
        txCount
        token0 {
          symbol
          name
          id
        }
        token1 {
          symbol
          name
          id
        }
      }
    }
    match_by_symbol1: tokens(where: { symbol_contains: $name2 }, first: 1) {
      id
    }
  }
`;

// search by symbol SUSHISWAP
export const SEARCH_BY_NAME_SUSHISWAP = `
  query searchByName($name: String, $name2: String) {
    match_by_symbol: tokens(where: { symbol_contains: $name }) {
      id
      symbol
      pairBase: basePairs {
        id
        txCount
        token0 {
          symbol
          name
          id
        }
        token1 {
          symbol
          name
          id
        }
      }
      pairQuote: quotePairs {
        id
        txCount
        token0 {
          symbol
          name
          id
        }
        token1 {
          symbol
          name
          id
        }
      }
    }
    match_by_symbol1: tokens(where: { symbol_contains: $name2 }, first: 1) {
      id
    }
  }
`;

// hot pairs UNISWAP
const PAIR_FRAGMENT = `
  fragment PairToken on Pair {
    id
    token0 {
      symbol
      id
      derivedUSD
    }
    token1 {
      symbol
      id
      derivedUSD
    }
  }
`;

export const GET_HOT_PAIRS = `
  ${PAIR_FRAGMENT}
  query getHotPairs($timestamp1: Int, $timestamp2: Int, $timestamp3: Int) {
    currentHour: pairHourDatas(
      orderBy: hourlyTxns
      orderDirection: desc
      where: { hourStartUnix: $timestamp1 }
    ) {
      pair {
        ...PairToken
      }
      hourlyTxns
    }

    oneHour: pairHourDatas(
      orderBy: hourlyTxns
      orderDirection: desc
      where: { hourStartUnix: $timestamp2 }
    ) {
      pair {
        ...PairToken
      }
      hourlyTxns
    }

    twoHours: pairHourDatas(
      orderBy: hourlyTxns
      orderDirection: desc
      where: { hourStartUnix: $timestamp3 }
    ) {
      pair {
        ...PairToken
      }
      hourlyTxns
    }
  }
`;
export const GQL_GET_HOT_PAIRS = gql(GET_HOT_PAIRS);

// hot pairs SUSHISWAP
export const GET_HOT_PAIRS_SUSHISWAP = `
  ${PAIR_FRAGMENT}
  query getHotPairs($timestamp1: Int, $timestamp2: Int, $timestamp3: Int) {
    currentHour: pairHourDatas(
      orderBy: txCount
      orderDirection: desc
      where: { date: $timestamp1 }
    ) {
      pair {
        ...PairToken
      }
      hourlyTxns: txCount
    }

    oneHour: pairHourDatas(orderBy: txCount, orderDirection: desc, where: { date: $timestamp2 }) {
      pair {
        ...PairToken
      }
      hourlyTxns: txCount
    }

    twoHours: pairHourDatas(orderBy: txCount, orderDirection: desc, where: { date: $timestamp3 }) {
      pair {
        ...PairToken
      }
      hourlyTxns: txCount
    }
  }
`;
export const GQL_GET_HOT_PAIRS_SUSHISWAP = gql(GET_HOT_PAIRS_SUSHISWAP);

// get favs pairs
export const GET_FAVORITES_PAIRS = gql`
  query getFavsPairs($ids: [String]) {
    pairs(where: { id_in: $ids }) {
      id
      token0 {
        id
        symbol
        derivedUSD
      }
      token1 {
        id
        symbol
        derivedUSD
      }
    }
  }
`;
