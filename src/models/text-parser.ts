import { encode } from '../utils';
import { HTMLParser } from './html-parser';

export class TextParser {

  private content: string;

  constructor(content: string) {
    this.content = content;
  }

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

  public getFragment(): DocumentFragment {
    const htmlParser = new HTMLParser(this.getHTML());
    return htmlParser.getFragment();
  }
}
