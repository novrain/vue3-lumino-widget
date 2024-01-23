import { ElementAttrs, VirtualElement, VirtualNode, h } from '@lumino/virtualdom'
import { DockPanel, TabBar, TabPanel, Widget } from '@lumino/widgets'

/**
 * a widget which displays titles as a single row or column of tabs.
 * Tweaked to use an inline svg as the close icon
 */
export class TabBarSvg<T> extends TabBar<T> {

  /**
   * Construct a new tab bar. Overrides the default renderer.
   *
   * @param options - The options for initializing the tab bar.
   */
  constructor(options: TabBar.IOptions<T> = {}) {
    options.renderer = options.renderer || TabBarSvg.defaultRenderer
    super(options)
    const addIcon = new TabBarSvg.IconRender('add')
    addIcon.render(this.addButtonNode)
  }
}

export namespace TabBarSvg {

  const closeSvg = `<svg viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg">
                      <g class="jp-icon-none jp-icon-selectable-inverse jp-icon3-hover" fill="none">
                        <circle cx="12" cy="12" r="11"/>
                      </g>

                      <g class="jp-icon3 jp-icon-selectable jp-icon-accent2-hover" fill="#616161">
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                      </g>

                      <g class="jp-icon-none jp-icon-busy" fill="none">
                        <circle cx="12" cy="12" r="7"/>
                      </g>
                    </svg>`
  const addSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" viewBox="0 0 24 24">
                    <g class="jp-icon3" fill="#616161">
                      <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                    </g>
                  </svg>`

  export class IconRender implements VirtualElement.IRenderer {
    static iconMap = new Map<string, HTMLElement>()
    static closeIcon: HTMLElement | undefined = undefined

    static registerIcon(key: string, iconSvg: string) {
      const parser = new DOMParser()
      const svg = parser.parseFromString(iconSvg, "image/svg+xml")
      IconRender.iconMap.set(key, svg.documentElement)
    }

    static getIconElement(key: string) {
      return IconRender.iconMap.get(key)?.cloneNode(true)
    }

    constructor(public key: string) {

    }

    render(container: HTMLElement, options?: { attrs?: ElementAttrs | undefined; children?: readonly VirtualNode[] | undefined } | undefined): void {
      if (container) {
        // take ownership by removing any existing children
        while (container.firstChild) {
          container.firstChild.remove()
        }
      } else {
        // create a container if needed
        container = document.createElement('div')
      }
      // @ts-ignore
      container.appendChild(IconRender.getIconElement(this.key))
    }
  }

  IconRender.registerIcon('close', closeSvg)
  IconRender.registerIcon('add', addSvg)
  const closeIcon = new IconRender('close')

  /**
   * A modified implementation of the TabBar Renderer.
   */
  export class Renderer extends TabBar.Renderer {
    /**
     * Render the close icon element for a tab.
     *
     * @param data - The data to use for rendering the tab.
     *
     * @returns A virtual element representing the tab close icon.
     */
    renderCloseIcon(data: TabBar.IRenderData<any>): VirtualElement {
      const n = h.div({ className: 'lm-TabBar-tabCloseIcon' }, closeIcon)
      return n
    }
  }

  export const defaultRenderer = new Renderer()
}

/**
 * a widget which provides a flexible docking area for widgets.
 * Tweaked to use an inline svg as the close icon
 */
export class DockPanelSvg extends DockPanel {
  /**
   * Construct a new dock panel.
   *
   * @param options - The options for initializing the panel.
   */
  constructor(options: DockPanel.IOptions = {}) {
    super({
      ...options,
      renderer: DockPanelSvg.defaultRenderer
    })
  }
}

export namespace DockPanelSvg {
  /**
   * A modified implementation of the DockPanel Renderer.
   */
  export class Renderer extends DockPanel.Renderer {
    /**
     * Create a new tab bar (with inline svg icons enabled
     * for use with a dock panel.
     *
     * @returns A new tab bar for a dock panel.
     */
    createTabBar(): TabBarSvg<Widget> {
      const bar = new TabBarSvg<Widget>()
      bar.addClass('lm-DockPanel-tabBar')
      return bar
    }
  }

  export const defaultRenderer = new Renderer()
}

/**
 * A widget which combines a `TabBar` and a `StackedPanel`.
 * Tweaked to use an inline svg as the close icon
 */
export class TabPanelSvg extends TabPanel {
  /**
   * Construct a new tab panel.
   *
   * @param options - The options for initializing the tab panel.
   */
  constructor(options: TabPanel.IOptions = {}) {
    options.renderer = options.renderer || TabBarSvg.defaultRenderer
    super(options)
  }
}