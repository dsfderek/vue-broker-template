import Vue from 'vue'
import Clipboard from 'clipboard'

function clipboardSuccess(message) {
  Vue.prototype.$message({
    message,
    showClose: true,
    type: 'success' ,
    duration: 1500
  })
}

function clipboardError(message) {
  Vue.prototype.$message({
    message:"复制失败",
    type: 'error'
  })
}

export default function clipboard(message, text, event) {
  const clipboard = new Clipboard(event.target, {
    text: () => text
  })
  clipboard.on('success', () => {
    clipboardSuccess(message)
    clipboard.destroy()
  })
  clipboard.on('error', () => {
    clipboardError()
    clipboard.destroy()
  })
  clipboard.onClick(event)
}
