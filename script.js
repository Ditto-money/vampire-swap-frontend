const rootContainer = document.getElementById("root-container")
const loaderContainer = document.getElementById("loader-container")

const connectButtonContainer = document.getElementById(
  "connect-button-container"
)
const connectButton = connectButtonContainer.querySelector("button")

const addressLabel = document.getElementById("address-label")

const [
  rebaseCooldownContainer,
  dittoPriceContainer,
  dittoSupplyContainer,
  rebaseButtonContainer,
  priceTargetContainer,
  dittoMarketCapContainer,
] = document.querySelectorAll(".col")

const rebaseButton = rebaseButtonContainer.querySelector("button")

const contracts = {}
let address
let supply
let price
let cooldownTimer
let chartData

window.onload = preload;

var i = 0;
function preload() {
  if (window.BinanceChain) return load();
  if (i++ === 4) return;
  setTimeout(preload, 1000);
}

async function load() {
  registerWeb3()
  await Promise.all(
    Object.entries(CONTRACTS).map(function ([name, address]) {
      const contract = (contracts[name] = new Contract())
      return contract.setContract(name, address)
    })
  )
  connectButton.addEventListener("click", function () {
    connectWeb3()
  })
  rebaseButton.addEventListener("click", function () {
    rebase()
  })
  await loadAccount()
}

async function connectWeb3() {
  await requireWeb3()
  await window.BinanceChain.request({method: "eth_requestAccounts"})
  await loadAccount()
}

async function loadAccount() {
  const [addr] = await window.BinanceChain.request({method: "eth_accounts"})
  setAddress(addr)

  completeBootLoader()
  loadStats()
}

async function setAddress(addr) {
  address = addr
  if (address) {
    addressLabel.innerText = `${address.substring(0, 6)}...${address.substring(
      address.length - 4,
      address.length
    )}`

    for (const contractName in contracts) {
      contracts[contractName].setAccount(address)
    }
  }
  toggle(connectButtonContainer, !address)
}

async function loadStats() {
  setupCharts()
  loadCooldownStats()
  await Promise.all([loadDittoPrice(), loadDittoSupply()])
  loadDittoMarketCap()
}

async function loadCooldownStats() {
  const cooldownExpiryTimestamp = await contracts.controller.read(
    "cooldownExpiryTimestamp",
    []
  )
  if (cooldownTimer) clearInterval(cooldownTimer)
  cooldownTimer = setInterval(function () {
    const ms = 1000 * cooldownExpiryTimestamp - Date.now()
    let duration
    if (ms < 0) {
      duration = "0d:0h:0m:0s"
      rebaseButton.removeAttribute("disabled")
    } else {
      duration = toHumanizedDuration(ms)
      rebaseButton.setAttribute("disabled", "disabled")
    }
    rebaseCooldownContainer.querySelectorAll("div")[1].innerText = duration
  })
}

async function loadDittoPrice() {
  price = parseFloat(
    Web3.utils.fromWei(
      await contracts.oracle.read("getData", []),
      "ether"
    )
  )
  dittoPriceContainer.querySelectorAll("div")[1].innerText =
    "$" + toHumanizedCurrency(price)
}

async function loadDittoSupply() {
  supply = (await api('get', '/total-supply')).totalSupply;
  dittoSupplyContainer.querySelectorAll("div")[1].innerText = toHumanizedNumber(supply)
}

async function loadDittoMarketCap() {
  const mktCap = price * supply
  dittoMarketCapContainer.querySelectorAll("div")[1].innerText =
    "$" + toHumanizedCurrency(mktCap)
}

async function rebase() {
  await requireWeb3(true)
  try {
    await waitForTxn(await contracts.controller.write("rebase"))
  } catch (e) {
    return sl("error", e)
  }
  sl("info", "Done!")
  loadCooldownStats()
}

async function setupCharts() {
  chartData = await api("get", "/")

  const current = {
    type: "abs",
    duration: "1d",
  }

  const charts = [
    setupChart("price-chart", current, true, ({x, p}) => {
      return {x, p}
    }),
    setupChart("supply-chart", current, false, ({x, s: p}) => {
      return {x, p}
    }),
    setupChart("mkt-cap-chart", current, true, ({x, s, p}) => {
      const y = s.map((a, i) => parseFloat(a) + parseFloat(p[i]))
      return {x, p: y}
    }),
  ]

  for (const kind in current) {
    const buttons = document.body.querySelectorAll(
      `.chart-toggle-buttons > [data-${kind}]`
    )
    buttons.forEach((button) => {
      button.addEventListener("click", function () {
        buttons.forEach(function (b) {
          b.classList.toggle("active", b.dataset[kind] === button.dataset[kind])
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
    type: "line",
    data: {
      labels: x,
      datasets: [
        {
          label: "Price",
          backgroundColor: COLORS.red,
          borderColor: COLORS.red,
          fill: "start",
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
                  : current.type === "abs"
                  ? "$" + toHumanizedCurrency(val)
                  : val + "%"
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
              : current.type === "abs"
              ? "$" + toHumanizedCurrency(val)
              : val + "%"
          },
        },
      },
    },
  }

  const ctx = container.querySelector("canvas").getContext("2d")
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
    if (type === "%") {
      const y = ["0"]
      for (let i = 1; i < p.length; i++) {
        const a = parseFloat(p[i])
        const b = parseFloat(p[i - 1])
        y.push(!a ? "0" : (100 * ((a - b) / a)).toFixed(2))
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
  el.classList[show ? "remove" : "add"]("hidden")
}

function enable(el) {
  attr(el, "disabled", false)
}

function disable(el) {
  attr(el, "disabled", "disabled")
}

function attr(el, attribute, val) {
  if (val) {
    el.setAttribute(attribute, val)
  } else {
    el.removeAttribute(attribute)
  }
}

async function requireWeb3(addr) {
  if (!window.BinanceChain) {
    const e = new Error("Please install Binance Chain Wallet browser extension.")
    sl("error", e)
    throw e
  }
  if (addr && !address) {
    const [addr] = await BinanceChain.request({method: "eth_requestAccounts"})
    console.log(addr);
    setAddress(addr)
  }
}

function completeBootLoader() {
  document.documentElement.classList.remove("loading")
  loaderContainer.remove()
  show(rootContainer)
}

function toHumanizedNumber(val) {
  return val.toLocaleString("en-US", {maximumFractionDigits: 2, minimumFractionDigits: 2})
}

function toHumanizedCurrency(val) {
  return new Intl.NumberFormat("en-US", {style: "currency", currency: "USD"})
    .format(val)
    .replace("$", "")
}

function bn(n) {
  return window.WEB3.utils.toBN(n)
}

function toHumanizedDuration(ms) {
  const dur = {}
  const units = [
    {label: "ms", mod: 1000},
    {label: "s", mod: 60},
    {label: "m", mod: 60},
    {label: "h", mod: 24},
    {label: "d", mod: 31},
    // {label: "w", mod: 7},
  ]
  units.forEach(function (u) {
    ms = (ms - (dur[u.label] = ms % u.mod)) / u.mod
  })
  return units
    .reverse()
    .filter(function (u) {
      return u.label !== "ms" // && dur[u.label]
    })
    .map(function (u) {
      let val = dur[u.label]
      if (u.label === "m" || u.label === "s") {
        val = val.toString().padStart(2, "0")
      }
      return val + u.label
    })
    .join(":")
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
  return contracts.token.read("balanceOf", ["0x000000000000000000000000000000000000dead"]);
}

async function api(method, endpoint, data) {
  NProgress.start()
  NProgress.set(0.4)

  endpoint = (~window.location.href.indexOf("local")
  ? "http://localhost:5001"
  : "https://ditto.money/api") + endpoint;

  return xhr(method, endpoint, data);
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
        Accept: "application/json",
        "Content-Type": "application/json",
      }
    }
    const res = await fetch(endpoint, opts)
    return await res.json()
  } finally {
    NProgress.done()
  }
}
