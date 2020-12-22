function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms))
}

const getAbi = (function () {
  const cache = {}
  return async function (name) {
    let cached = cache[name]
    if (cached) return cached
    cached = await xhr('get', 'abis/' + name + '.json')
    cache[name] = cached
    return cached
  }
})()

async function makeReadContract([name, address]) {
  return [
    name,
    new ethers.Contract(address, await getAbi(name), READ_WEB3_PROVIDER),
  ]
}

async function makeWriteContract(signer, [name, address]) {
  return [name, new ethers.Contract(address, await getAbi(name), signer)]
}
