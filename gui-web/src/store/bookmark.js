import { ref } from 'vue'

class BookmarkStore {
  constructor () {
    this.slugs = ref([])

    try {
      if (window.localStorage.bookmarks) {
        this.slugs.value = JSON.parse(window.localStorage.bookmarks)
      }
    } catch (err) {
      console.warn('Bookmark.parse', err)
    }
  }

  toggleBookmark (slug) {
    if (this.slugs.value.includes(slug)) {
      this.slugs.value = this.slugs.value.filter(s => s !== slug)
    } else {
      this.slugs.value.push(slug)
    }

    window.localStorage.bookmarks = JSON.stringify(this.slugs.value)
  }
}

export default new BookmarkStore()
