function registerWeb3() {
  window.WEB3 = new Web3(WEB3_PROVIDER)
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms))
}

class Contract {
  async setContract(name, address) {
    this.address = address
    const abi = await xhr("get", "abis/" + name + ".json")
    this.contract = new window.WEB3.eth.Contract(abi, this.address)
  }

  setAccount(account) {
    this.account = account
  }

  async read(method, args = [], options = {}) {
    return this.callContract(false, method, args, options)
  }

  async write(method, args = [], options = {}) {
    return this.callContract(true, method, args, options)
  }

  async callContract(write, method, args) {
    return new Promise((resolve, reject) => {
      const options = {}
      if (this.account) {
        options.from = this.account
      }
      this.contract.methods[method](...args)[write ? "send" : "call"](
        options,
        (err, response) => {
          if (err) {
            return reject(new Error(method  + ' : ' + err.message))
          }
          if (response.c && response.c.length) {
            return resolve(response.c)
          }
          resolve(response)
          // resolve(response.c?.[0] ?? response);
        }
      )
    })
  }

  on(eventName, fn) {
    return this.contract.events[eventName]({}, fn)
  }
}

async function waitForTxn(txHash, interval) {
  NProgress.start()
  NProgress.set(0.4)

  try {
    await waitForTxnPromise(txHash, interval)
  } finally {
    NProgress.done()
  }
}

function waitForTxnPromise(txHash, interval) {
  const transactionReceiptRetry = () =>
    window.WEB3.eth
      .getTransactionReceipt(txHash)
      .then((receipt) =>
        receipt !== null
          ? receipt
          : sleep(interval ? interval : 1000).then(transactionReceiptRetry)
      )

  if (Array.isArray(txHash)) {
    return sequentialPromise(
      txHash.map((oneTxHash) => () => waitForTxnPromise(oneTxHash, interval))
    )
  } else if (typeof txHash === "string") {
    return transactionReceiptRetry()
  } else {
    throw new Error("Invalid Type: " + txHash)
  }
}

function sequentialPromise(promiseArray) {
  const result = promiseArray.reduce(
    (reduced, promise, index) => {
      reduced.results.push(undefined)
      return {
        chain: reduced.chain
          .then(() => promise())
          .then((result) => (reduced.results[index] = result)),
        results: reduced.results,
      }
    },
    {
      chain: Promise.resolve(),
      results: [],
    }
  )
  return result.chain.then(() => result.results)
}
