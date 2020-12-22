const fs = require('fs')
const path = require('path')
const INDEX_FILE = join('/index.html')

main()

function main() {
  let html = fs.readFileSync(INDEX_FILE, 'utf8')
  html = html.replace(/\?v=\d+/g, `?v=${Date.now()}`)
  fs.writeFileSync(INDEX_FILE, html, 'utf8')
}

function join(p) {
  return path.join(__dirname, p)
}
