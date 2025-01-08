import { encode } from '../utils/encode';
import { HTMLParser } from './html-parser';

// The TextParser interface provides the ability to parse a text.
export class TextParser {

  private readonly content: string;

  constructor(content: string) {
    this.content = content;
  }

  // Returns an HTML string.
  public getHTML(): string {
    let html = this.content;
    html = html.replace(/ {2}/g, ' \xA0');
    html = encode(html.trim());
    html = `<p>${html}</p>`;
    html = html.replace(/(\r\n){2,}/g, '</p><p><br /></p><p>');
    html = html.replace(/\r\n/g, '</p><p>');
    html = html.replace(/[\r\n]{2,}/g, '</p><p><br /></p><p>');
    html = html.replace(/[\r\n]/g, '</p><p>');
    return html;
  }

  // Returns a DocumentFragment object.
  public getFragment(): DocumentFragment {
    const htmlParser = new HTMLParser(this.getHTML());
    return htmlParser.getFragment();
  }
}
