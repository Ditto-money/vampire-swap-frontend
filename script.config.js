const IS_TESTNET = !!~window.location.pathname.indexOf('testnet')
const IS_DEV = !!~window.location.href.indexOf('local')

const API_URL = IS_DEV
  ? 'http://localhost:5001'
  : IS_TESTNET
  ? 'https://ditto.money/testnet-api'
  : 'https://ditto.money/api'

const CONTRACTS = IS_TESTNET
  ? {
      token: '0x363e3b7f1B3e84E94D6300E16eC8F368a18E498E',
      controller: '0xdA28e9c657D4690cb367D1d3dD969A8969c0b3D8',
      oracle: '0x0F9ACBCc0A97d6b915DAd5db4176f2BCB2eDCA63',
    }
  : {
      token: '0x363e3b7f1B3e84E94D6300E16eC8F368a18E498E',
      controller: '0xdA28e9c657D4690cb367D1d3dD969A8969c0b3D8',
      oracle: '0x0F9ACBCc0A97d6b915DAd5db4176f2BCB2eDCA63',
    }

const WEB3_PROVIDER = IS_TESTNET
  ? 'https://data-seed-prebsc-1-s1.binance.org:8545'
  : 'https://bsc-dataseed1.binance.org:443'

const COLORS = {
  red: '#ED7AC0',
}
