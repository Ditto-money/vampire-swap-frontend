const IS_TESTNET = !!~window.location.href.indexOf('testnet')
const IS_DEV = !!~window.location.href.indexOf('local')

const API_URL = IS_TESTNET
  ? 'https://ditto.money/testnet-api'
  : IS_DEV
  ? 'http://localhost:5001'
  : 'https://ditto.money/api'

const CONTRACTS = IS_TESTNET
  ? {
      token: '0xbf8C8eFD410414929eb63c62E2C28596c1AB7318',
      controller: '0xA121Fde07be72Dc9494FBa99bc84E48724a68820',
      oracle: '0xdA28e9c657D4690cb367D1d3dD969A8969c0b3D8',
    }
  : {
      token: '0x233d91A0713155003fc4DcE0AFa871b508B3B715',
      controller: '0xdA28e9c657D4690cb367D1d3dD969A8969c0b3D8',
      oracle: '0x0F9ACBCc0A97d6b915DAd5db4176f2BCB2eDCA63',
    }

const READ_WEB3_PROVIDER = new ethers.providers.JsonRpcProvider(
  IS_TESTNET
    ? 'https://data-seed-prebsc-1-s1.binance.org:8545'
    : 'https://bsc-dataseed1.binance.org:443'
)

const REQUIRED_CHAIN_ID = IS_TESTNET ? 97 : 56

const INFURA_ID = '1e8cc8aac2bd47f98da31fd2846d6132'

const COLORS = {
  red: '#ED7AC0',
}
