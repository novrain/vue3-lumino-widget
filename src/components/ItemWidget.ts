import { Message } from '@lumino/messaging'
import { Widget } from '@lumino/widgets'

export interface Item {
  id: string,
  name: string,
}

export interface OnMessage {
  (msg: Message): void
}

export interface Options {
  closable?: boolean
  onClose?: OnMessage
  onActive?: OnMessage
  onShow?: OnMessage
}

export interface WidgetEvent {
  msg: Message
  item: Item
  widget: ItemWidget
}

export class ItemWidget extends Widget {
  closable: boolean
  item: Item
  onClose?: OnMessage
  onActive?: OnMessage
  onShow?: OnMessage

  constructor(item: Item, { closable = true, onClose, onActive, onShow }: Options) {
    super({ node: ItemWidget.createNode(item) })
    this.closable = closable
    // classes and flags
    this.setFlag(Widget.Flag.DisallowLayout)
    this.addClass('lumino-content')
    // tab title
    this.title.label = item.name
    this.title.closable = closable
    this.item = item
    this.onClose = onClose
    this.onActive = onActive
    this.onShow = onShow
  }

  static createNode(item: Item) {
    const div = document.createElement('div')
    div.setAttribute('id', item.id)
    return div
  }

  protected onAfterShow(msg: Message): void {
    super.onAfterShow(msg)
    if (this.onShow) {
      this.onShow(msg)
    }
  }

  protected onActivateRequest(msg: Message): void {
    super.onActivateRequest(msg)
    if (this.onActive) {
      this.onActive(msg)
    }
  }

  protected onCloseRequest(msg: Message): void {
    if (this.onClose) {
      this.onClose(msg)
    } else {
      super.onCloseRequest(msg)
    }
  }

  doClose(msg: Message): void {
    super.onCloseRequest(msg)
  }
}
