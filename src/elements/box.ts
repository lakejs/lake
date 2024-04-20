class BoxElement extends HTMLElement {

}

if (customElements.get('lake-box') !== undefined) {
  customElements.define('lake-box', BoxElement);
}
