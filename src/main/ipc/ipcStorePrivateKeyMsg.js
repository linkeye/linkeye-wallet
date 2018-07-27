import storePrivateKey from '../key/storePrivateKey'

const {CLIENT_NORMAL_MSG, CRAWLER_NORMAL_MSG,} = require('../../constants/constants')

export default class storePrivateKeyIpc {
  constructor(listener, sender) {
    this.listener = listener
    this.sender = sender
    this.addListener(CLIENT_NORMAL_MSG, this.handleFn.bind(this))
    this.handlerStorePrivateKey = storePrivateKey(this)
  }

  handleFn(event, data) {
    try {
      this.handlerStorePrivateKey[data.type](event, data.data)
    } catch (error) {
      console.error('handler event error:' + error.message)
    }
  }

  addListener(chanel, cb) {
    this.listener.on(chanel, cb)
  }

  _sendMsg(chanel, msgBody) {
    this.sender.send(chanel, msgBody)
  }

  sendToClient(type, data) {
    this._sendMsg(CRAWLER_NORMAL_MSG, {
      type,
      data,
    })
  }
}



