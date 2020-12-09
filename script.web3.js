function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms))
}

async function makeContracts([name, address]) {
  const abi = await xhr('get', 'abis/' + name + '.json')

  window.READ_WEB3 = new Web3(WEB3_PROVIDER)
  const readContract = new READ_WEB3.eth.Contract(abi, address)

  let writeContract
  if (window.web3) {
    window.WRITE_WEB3 = new Web3(web3.currentProvider)
    writeContract = new WRITE_WEB3.eth.Contract(abi, address)
  }

  return {
    name,
    read: (method) => {
      return (...args) => {
        return new Promise((resolve, reject) => {
          readContract.methods[method](...args).call(
            handleContractCall(resolve, reject)
          )
        })
      }
    },
    write: (from) => {
      return (method) => {
        return (...args) => {
          return new Promise((resolve, reject) => {
            writeContract.methods[method](...args).send(
              {from},
              handleContractCall(resolve, reject)
            )
          })
        }
      }
    },
  }
}

function handleContractCall(resolve, reject) {
  return (err, response) => {
    if (err) {
      return reject(new Error(err.message))
    }
    if (response.c && response.c.length) {
      return resolve(response.c)
    }
    resolve(response)
    // resolve(response.c?.[0] ?? response);
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
    WRITE_WEB3.eth
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
  } else if (typeof txHash === 'string') {
    return transactionReceiptRetry()
  } else {
    throw new Error('Invalid Type: ' + txHash)
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
