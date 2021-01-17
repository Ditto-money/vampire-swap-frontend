export const APP_SLUG = 'ditto';

export const APP_TITLE = 'Ditto Dashboard';

export const CACHE_WALLET_KEY = 'wallet';

export const BORDER_RADIUS = 8;

export const IS_TESTNET = !!~window.location.href.indexOf('testnet');
export const IS_DEV = !!~window.location.href.indexOf('local');

export const API_URL = IS_TESTNET
  ? 'https://ditto.money/api-testnet'
  : // : IS_DEV
    // ? 'http://localhost:5001'
    'https://ditto.money/api';

export const CONTRACTS = IS_TESTNET
  ? {
      token: '0xbf8C8eFD410414929eb63c62E2C28596c1AB7318',
      controller: '0xA121Fde07be72Dc9494FBa99bc84E48724a68820',
      oracle: '0xdA28e9c657D4690cb367D1d3dD969A8969c0b3D8',
    }
  : {
      token: '0x233d91A0713155003fc4DcE0AFa871b508B3B715',
      controller: '0xdaE0B6F111c62010a8dC6A003B02053C004cFFc1',
      oracle: '0x2df19009b4a48636699d4dbf00e1d7f923c6fa47',
    };

export const INFURA_ID = '1e8cc8aac2bd47f98da31fd2846d6132';

export const NETWORK_NAME = IS_TESTNET ? 'testnet' : 'mainnet';

export const NETWORK_CHAIN_ID = IS_TESTNET ? 97 : 56;

export const READ_WEB3_PROVIDER = IS_TESTNET
  ? 'https://data-seed-prebsc-1-s1.binance.org:8545'
  : 'https://bsc-dataseed1.binance.org:443';

export const DURATIONS_MAP = new Map([
  ['1d', '1 DAY'],
  ['30d', '30 DAYS'],
  ['all', 'ALL'],
]);

export const TYPES_MAP = new Map([
  ['abs', 'ABS'],
  ['%', '%'],
]);

export const DURATIONS_ARRAY = Array.from(DURATIONS_MAP);
export const TYPES_ARRAY = Array.from(TYPES_MAP);

export const SECONDARY_COLOR = '#ed7ac0';
