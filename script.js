const rootContainer = document.getElementById('root-container')
const loaderContainer = document.getElementById('loader-container')
const [
  rebaseCooldownContainer,
  dittoPriceContainer,
  dittoSupplyContainer,
  rebaseButtonContainer,
  priceTargetContainer,
  dittoMarketCapContainer,
] = document.querySelectorAll('.col')
const addressLabel = document.getElementById('address-label')
const rebaseButton = document.getElementById('rebase-button')
const walletsContainer = document.getElementById('connect-wallets')
const closeWalletsButton = walletsContainer.querySelector('.close')
const connectMetamaskButton = document.getElementById('connect-metamask')
const connectWalletConnectButton = document.getElementById(
  'connect-wallet-connect'
)
const connectBscButton = document.getElementById('connect-bsc')

const contracts = {}

let writeProvider

let supply
let price
let cooldownTimer
let chartData

window.onload = load

async function load() {
  rebaseButton.addEventListener('click', function () {
    rebase()
  })
  closeWalletsButton.addEventListener('click', function () {
    closeWallets()
  })
  connectMetamaskButton.addEventListener('click', connectMetamask)
  connectWalletConnectButton.addEventListener('click', connectWalletConnect)
  connectBscButton.addEventListener('click', connectBsc)

  await connectCachedProvider()
  await completeBootLoader()
  await loadStats()
  await updateStuffIfTestnet()
}

async function connectMetamask() {
  if (!window.ethereum)
    return sl('error', 'Please install the Metamask extension')
  await window.ethereum.enable()
  closeWallets()
  await loadAccount(window.ethereum)
}

async function connectWalletConnect() {
  const walletConnectProvider = new WalletConnectProvider.default({
    infuraId: INFURA_ID,
  })
  await walletConnectProvider.enable()
  closeWallets()
  await loadAccount(walletConnectProvider)
}

async function connectBsc() {
  if (!window.BinanceChain)
    return sl('error', 'Please install the Binance Wallet extension')
  await window.BinanceChain.enable()
  closeWallets()
  await loadAccount(window.BinanceChain)
}

function showWallets() {
  show(walletsContainer)
}

function closeWallets() {
  hide(walletsContainer)
}

async function connectCachedProvider() {
  ;(await Promise.all(Object.entries(CONTRACTS).map(makeReadContract))).forEach(
    ([name, contract]) => {
      contracts[name] = contract
    }
  )
}

async function loadAccount(p) {
  const provider = new ethers.providers.Web3Provider(p)
  const net = await provider.getNetwork()
  if (net.chainId !== REQUIRED_CHAIN_ID) {
    if (p.disconnect) {
      p.disconnect()
    }
    sl(
      'error',
      `Please connect to Binance Smart Chain ${
        IS_TESTNET ? 'Testnet' : 'Mainnet'
      } and retry.`
    )
    return
  }
  writeProvider = provider
  const signer = provider.getSigner()
  ;(
    await Promise.all(
      Object.entries(CONTRACTS).map(makeWriteContract.bind(null, signer))
    )
  ).forEach(([name, contract]) => {
    contracts[name] = contract
  })
  const address = await signer.getAddress()
  if (address) {
    addressLabel.innerText = `${address.substring(0, 6)}...${address.substring(
      address.length - 4,
      address.length
    )}`
  }
  loadStats()
}

async function loadStats() {
  setupCharts()
  loadCooldownStats()
  await Promise.all([loadDittoPrice(), loadDittoSupply()])
  loadDittoMarketCap()
}

async function loadCooldownStats() {
  const cooldownExpiryTimestamp = await contracts.controller.cooldownExpiryTimestamp()
  if (cooldownTimer) clearInterval(cooldownTimer)
  cooldownTimer = setInterval(function () {
    const ms = 1000 * cooldownExpiryTimestamp - Date.now()
    let duration
    if (ms < 0) {
      duration = '0d:0h:0m:0s'
      rebaseButton.removeAttribute('disabled')
    } else {
      duration = toHumanizedDuration(ms)
      rebaseButton.setAttribute('disabled', 'disabled')
    }
    rebaseCooldownContainer.querySelectorAll('div')[1].innerText = duration
  })
}

async function loadDittoPrice() {
  price = new Big((await contracts.oracle.getData()).toString()).div(
    new Big(1e18)
  )
  dittoPriceContainer.querySelectorAll('div')[1].innerText =
    '$' + toHumanizedCurrency(price)
}

async function loadDittoSupply() {
  supply = new Big((await api('get', '/total-supply')).totalSupply).div(
    new Big(1e9)
  )
  dittoSupplyContainer.querySelectorAll(
    'div'
  )[1].innerText = toHumanizedCurrency(supply)
}

async function loadDittoMarketCap() {
  const mktCap = price.mul(supply)
  dittoMarketCapContainer.querySelectorAll('div')[1].innerText =
    '$' + toHumanizedCurrency(mktCap)
}

async function rebase() {
  await requireWriteProvider()
  try {
    await contracts.controller.rebase()
  } catch (e) {
    return sl('error', e)
  }
  sl('info', 'Done!')
  loadCooldownStats()
}

async function setupCharts() {
  chartData = await api('get', '/')

  const current = {
    type: 'abs',
    duration: '1d',
  }

  const charts = [
    setupChart('price-chart', current, true, ({x, p}) => {
      return {x, p}
    }),
    setupChart('supply-chart', current, false, ({x, s: p}) => {
      return {x, p}
    }),
    setupChart('mkt-cap-chart', current, true, ({x, s, p}) => {
      const y = s.map((a, i) => parseFloat(a) + parseFloat(p[i]))
      return {x, p: y}
    }),
  ]

  for (const kind in current) {
    const buttons = document.body.querySelectorAll(
      `.chart-toggle-buttons > [data-${kind}]`
    )
    buttons.forEach((button) => {
      button.addEventListener('click', function () {
        buttons.forEach(function (b) {
          b.classList.toggle('active', b.dataset[kind] === button.dataset[kind])
        })
        current[kind] = button.dataset[kind]
        charts.forEach((fn) => fn(current))
      })
    })
  }
}

function setupChart(chartId, current, label, map) {
  const container = document.getElementById(chartId)

  const {x, y} = dataTransform(current)
  const config = {
    type: 'line',
    data: {
      labels: x,
      datasets: [
        {
          label: 'Price',
          backgroundColor: COLORS.red,
          borderColor: COLORS.red,
          fill: 'start',
          data: y,
        },
      ],
    },
    options: {
      responsive: true,
      title: {
        display: false,
      },
      legend: {
        display: false,
      },
      scales: {
        xAxes: [
          {
            display: true,
          },
        ],
        yAxes: [
          {
            display: true,
            lineTension: 0.000001,
            ticks: {
              callback: function (val, index, values) {
                return !label
                  ? val
                  : current.type === 'abs'
                  ? '$' + toHumanizedCurrency(val)
                  : val + '%'
              },
            },
          },
        ],
      },
      tooltips: {
        callbacks: {
          label: function (tooltipItem, data) {
            const val = tooltipItem.yLabel
            return !label
              ? val
              : current.type === 'abs'
              ? '$' + toHumanizedCurrency(val)
              : val + '%'
          },
        },
      },
    },
  }

  const ctx = container.querySelector('canvas').getContext('2d')
  const chart = new Chart(ctx, config)

  function updateChart() {
    const {x, y} = dataTransform(current)
    chart.data.labels = x
    chart.data.datasets[0].data = y
    chart.update()
  }

  function dataTransform({type, duration}) {
    const data = chartData[duration]
    const {x, p} = map(data)
    if (type === '%') {
      const y = ['0']
      for (let i = 1; i < p.length; i++) {
        const a = parseFloat(p[i])
        const b = parseFloat(p[i - 1])
        y.push(!a ? '0' : (100 * ((a - b) / a)).toHumanizedCurrency(2))
      }
      return {x, y}
    } else {
      return {x, y: p}
    }
  }

  return updateChart
}

function show(el) {
  toggle(el, true)
}

function hide(el) {
  toggle(el, false)
}

function toggle(el, show) {
  el.classList[show ? 'remove' : 'add']('hidden')
}

function enable(el) {
  attr(el, 'disabled', false)
}

function disable(el) {
  attr(el, 'disabled', 'disabled')
}

function attr(el, attribute, val) {
  if (val) {
    el.setAttribute(attribute, val)
  } else {
    el.removeAttribute(attribute)
  }
}

async function requireWriteProvider(addr) {
  if (!writeProvider) {
    showWallets()
    throw new Error('Provider required.')
  }
}

function completeBootLoader() {
  document.documentElement.classList.remove('loading')
  loaderContainer.remove()
  show(rootContainer)
}

function updateStuffIfTestnet() {
  if (IS_TESTNET) {
    const els = document.querySelectorAll('.testnet')
    for (let i = 0; i < els.length; i++) {
      const el = els[i]
      show(el)
    }
  }
}

function toHumanizedCurrency(val) {
  if (val.toNumber) {
    val = val.toNumber()
  }
  return new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD'})
    .format(val)
    .replace('$', '')
}

function toHumanizedDuration(ms) {
  const dur = {}
  const units = [
    {label: 'ms', mod: 1000},
    {label: 's', mod: 60},
    {label: 'm', mod: 60},
    {label: 'h', mod: 24},
    {label: 'd', mod: 31},
    // {label: "w", mod: 7},
  ]
  units.forEach(function (u) {
    ms = (ms - (dur[u.label] = ms % u.mod)) / u.mod
  })
  return units
    .reverse()
    .filter(function (u) {
      return u.label !== 'ms' // && dur[u.label]
    })
    .map(function (u) {
      let val = dur[u.label]
      if (u.label === 'm' || u.label === 's') {
        val = val.toString().padStart(2, '0')
      }
      return val + u.label
    })
    .join(':')
}

async function sleep(ms) {
  return await new Promise(function (resolve) {
    return setTimeout(resolve, ms)
  })
}

function sl(type, msg) {
  Swal.fire({
    icon: type,
    text: msg,
  })
}

function getBurntAmount() {
  return contracts.token.balanceOf('0x000000000000000000000000000000000000dead')
}

async function api(method, endpoint, data) {
  NProgress.start()
  NProgress.set(0.4)

  endpoint = API_URL + endpoint

  return xhr(method, endpoint, data)
}

async function xhr(method, endpoint, data) {
  NProgress.start()
  NProgress.set(0.4)

  try {
    const opts = {}
    if (data) {
      opts.method = method.toUpperCase()
      opts.body = JSON.stringify(data)
      opts.headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }
    }
    const res = await fetch(endpoint, opts)
    return await res.json()
  } finally {
    NProgress.done()
  }
}
