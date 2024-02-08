/* Page scroll listener */
let isScrolling = false
let scrollEndTimeout = null
let scrollEndEventName = 'lm-scroll-ended'
window.addEventListener('scroll', () => {
  isScrolling = true
  if (scrollEndTimeout !== null) {
    window.clearTimeout(scrollEndTimeout)
  }
  scrollEndTimeout = window.setTimeout(() => {
    window.dispatchEvent(new CustomEvent(scrollEndEventName))
  }, 100)
})

function waitForScrollEnd(callback) {
  if (!isScrolling) return callback()
  const wrappedCallback = () => {
    callback()
    window.removeEventListener(scrollEndEventName, wrappedCallback)
  }
  window.addEventListener(scrollEndEventName, wrappedCallback)
}

/* Handle scrllgngn page change */
const onScrllgngnPageChange = (eventData) => {
  const header = document.querySelector('.drogues-header')
  if (header === null) return
  const nav = header.querySelector('.drogues-header__nav')
  if (nav === null) return

  const currentPageIndex = eventData?.details?.state?.currPagePos
  const currentPage = eventData?.details?.state?.pages.get(currentPageIndex)
  const currentChapter = +currentPage.id.charAt(0)

  console.log(currentPage)
  console.log({currentChapter})

  const [...headerItems] = header.querySelectorAll('.drogues-header__nav a')
  headerItems.forEach((headerItem) => headerItem.classList.remove('active'))

  let currentItem = undefined
  if (headerItems[currentChapter - 1] !== undefined) {
    currentItem = headerItems[currentChapter - 1]
  }
  if (currentItem === undefined) return
  currentItem.classList.add('active')

  const navWidth = nav.clientWidth
  const navOffset = nav.scrollLeft
  const navDisplayZone = {
    start: navOffset,
    stop: navWidth + navOffset,
  }

  const currentItemOffset = currentItem.offsetLeft
  const currentItemWidth = currentItem.clientWidth
  const currentItemDisplayZone = {
    start: currentItemOffset,
    stop: currentItemOffset + currentItemWidth,
  }

  if (currentItemDisplayZone.start < navDisplayZone.start) {
    waitForScrollEnd(() => {
      nav.scrollLeft = currentItemOffset - 6
    })
  } else if (currentItemDisplayZone.stop > navDisplayZone.stop) {
    waitForScrollEnd(() => {
      nav.scrollLeft =
        nav.scrollLeft + (currentItemDisplayZone.stop - navDisplayZone.stop) + 6
    })
  }
}

export { onScrllgngnPageChange }