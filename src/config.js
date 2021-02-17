export const APP_SLUG = 'ditto_swaptobsc';

export const APP_TITLE = 'Ditto    |    Swap to BSC';

export const CACHE_WALLET_KEY = 'wallet';

export const BORDER_RADIUS = 8;

export const IS_TESTNET = !!~window.location.href.indexOf('testnet');
export const IS_DEV = !!~window.location.href.indexOf('local');

export const API_URL =
  process.env.REACT_APP_API_URL ||
  (IS_TESTNET
    ? 'https://ditto.money/api-testnet'
    : IS_DEV
    ? 'http://localhost:5001'
    : 'https://ditto.money/api');


export const INFURA_ID = '1e8cc8aac2bd47f98da31fd2846d6132';

export const NETWORK_NAME = IS_TESTNET || IS_DEV ? 'Ethereum Testnet Ropsten' : 'Ethereum Mainnet';

export const SWAP_CONTRACT_ADDRESS = IS_TESTNET || IS_DEV ? '0xFDaCD496EfFB198C81Fb5E74F156e889f4ecCF91' : '0xFDaCD496EfFB198C81Fb5E74F156e889f4ecCF91';

export const NETWORK_CHAIN_ID = IS_TESTNET || IS_DEV ? 3 : 1;

export const READ_WEB3_PROVIDER = IS_TESTNET
  ? 'https://data-seed-prebsc-1-s1.binance.org:8545'
  : 'https://bsc-dataseed1.binance.org:443';

export const SECONDARY_COLOR = '#ed7ac0';
