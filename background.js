let handler = null

const backTransitionCss = `
  *:not(html):not(body) {
    visibility: hidden !important; 
    transition: all .15s ease-out !important; 
  }
`

browser.commands.onCommand.addListener((command) => {
  switch (command) {
    case 'history-go-back':
      browser.tabs.query({ active: true, currentWindow: true, pinned: false })
        .then((tabs) => {
          const activeTab = tabs[0]
          if (activeTab) {
            browser.tabs.insertCSS({ code: backTransitionCss })
            if (handler)
              clearTimeout(handler)
            handler = setTimeout(() => {
              if (activeTab.active)
                browser.tabs.remove(activeTab.id)
            }, 250)
          }
        })
      break
    default:
      console.warn('unknown command:', command)
  }
})

browser.tabs.onUpdated.addListener((tabId, change, tab) => {
  setTimeout(() => {
    if (tab.active && handler !== null) {
      browser.tabs.removeCSS({ code: backTransitionCss })
      clearTimeout(handler)
      handler = null
    }
  }, 50)
})
