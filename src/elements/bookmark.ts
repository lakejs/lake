class BookmarkElement extends HTMLElement {

}

if (customElements.get('lake-bookmark') !== undefined) {
  customElements.define('lake-bookmark', BookmarkElement);
}
