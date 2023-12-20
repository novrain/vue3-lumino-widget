import { Message, MessageLoop } from '@lumino/messaging'
import { DockPanel, Widget } from '@lumino/widgets'

export interface Item {
  id: string,
  name?: string,
}

export interface OnMessage {
  (msg: Message): void
}

export interface Options {
  closable?: boolean
  onClose?: OnMessage
  onActive?: OnMessage
  onDeActive?: OnMessage
  onShow?: OnMessage
  onHide?: OnMessage
}

export interface WidgetEvent {
  msg: Message
  item: Item
  widget: ItemWidget
}

const DeActiveRequest = new Message('de-active-request')
export class ItemWidget extends Widget {
  closable: boolean
  item: Item
  onClose?: OnMessage
  onActive?: OnMessage
  onDeActive?: OnMessage
  onShow?: OnMessage
  onHide?: OnMessage

  constructor(item: Item, { closable = true, onClose, onActive, onShow, onHide, onDeActive }: Options) {
    super({ node: ItemWidget.createNode(item) })
    this.closable = closable
    // classes and flags
    this.setFlag(Widget.Flag.DisallowLayout)
    this.addClass('lumino-content')
    // tab title
    this.title.label = item.name || 'tab'
    this.title.closable = closable
    this.item = item
    this.onClose = onClose
    this.onActive = onActive
    this.onDeActive = onDeActive
    this.onShow = onShow
    this.onHide = onHide
  }

  static createNode(item: Item) {
    const div = document.createElement('div')
    div.setAttribute('id', item.id)
    return div
  }

  processMessage(msg: Message): void {
    if (msg === DeActiveRequest) {
      this.onDeActivateRequest(msg)
      return
    }
    super.processMessage(msg)
  }

  protected onDeActivateRequest(msg: Message): void {
    if (this.onDeActive) {
      this.onDeActive(msg)
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

  protected onAfterShow(msg: Message): void {
    super.onAfterShow(msg)
    if (this.onShow) {
      this.onShow(msg)
    }
  }

  protected onAfterHide(msg: Message): void {
    super.onAfterHide(msg)
    if (this.onHide) {
      this.onHide(msg)
    }
  }

  doClose(msg: Message): void {
    super.onCloseRequest(msg)
  }
}

export class CustomDockPanel extends DockPanel {
  private _currentWidget: Widget | null = null
  public get currentWidget(): Widget | null {
    return this._currentWidget
  }

  public set currentWidget(value: Widget | null) {
    if (this._currentWidget !== value) {
      this.deActivateCurrent()
    }
    this._currentWidget = value
  }

  deActivateCurrent(): void {
    if (this._currentWidget) {
      MessageLoop.sendMessage(this._currentWidget, DeActiveRequest)
    }
  }

  processMessage(msg: Message): void {
    switch (msg.type) {
      case 'child-shown':
        {
          const child = (msg as Widget.ChildMessage).child
          if (this._currentWidget && this._currentWidget !== child) {
            MessageLoop.sendMessage(this._currentWidget, DeActiveRequest)
          }
          this._currentWidget = child
          break
        }
      case 'child-removed':
        if (this._currentWidget === (msg as Widget.ChildMessage).child) {
          this._currentWidget = null
        }
        break
    }
    super.processMessage(msg)
  }
}
