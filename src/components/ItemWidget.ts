import { Message } from '@lumino/messaging'
import { Widget } from '@lumino/widgets'

export interface Item {
  id: string,
  name: string,
}

export interface OnClose {
  (msg: Message): void
}

export interface OnActive {
  (msg: Message): void
}

export interface Options {
  closable?: boolean
  onClose?: OnClose
  onActive?: OnActive
}

export interface WidgetEvent {
  msg: Message
  item: Item
  widget: ItemWidget
}

export class ItemWidget extends Widget {
  closable: boolean
  item: Item
  onClose?: OnClose
  onActive?: OnActive

  constructor(item: Item, { closable = true, onClose }: Options) {
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
  }

  static createNode(item: Item) {
    const div = document.createElement('div')
    div.setAttribute('id', item.id)
    return div
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
