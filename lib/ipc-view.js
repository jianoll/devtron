'use strict'

const View = require('./view')
const ipc = require('./ipc-helpers')

class IpcView extends View {
  constructor (event, table) {
    super('js-ipc-table-row')

    this.event = event
    table.appendChild(this.element)
    this.render()
  }

  render () {
    this.eventName.textContent = this.event.channel

    if (this.event.sent) {
      this.eventIcon.classList.add('ipc-icon-sent')
    } else {
      this.eventIcon.classList.add('ipc-icon-received')
    }

    if (this.event.listenerCount > 0) {
      this.eventListenerCount.textContent = this.event.listenerCount
    }

    this.eventData.textContent = this.event.data
  }
}

const addNewEvents = () => {
  const table = document.querySelector('.js-ipc-table')
  ipc.getEvents().then((events) => {
    events.forEach((event) => new IpcView(event, table))
  }).catch((error) => {
    console.error('Getting IPC events failed')
    console.error(error.stack || error)
  })
}

document.addEventListener('DOMContentLoaded', () => {
  ipc.listenForEvents().then(() => {
    setInterval(addNewEvents, 333)
  }).catch((error) => {
    console.error('Listening for IPC events failed')
    console.error(error.stack || error)
  })
})