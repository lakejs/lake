import { encode } from '../utils/encode';
import { HTMLParser } from './html-parser';

/**
 * The TextParser interface enables parsing of text into structured HTML.
 */
export class TextParser {

  private readonly content: string;

  constructor(content: string) {
    this.content = content;
  }

  /**
   * Converts the parsed text into an HTML string.
   */
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

  /**
   * Generates a DocumentFragment object that represents the parsed text.
   */
  public getFragment(): DocumentFragment {
    const htmlParser = new HTMLParser(this.getHTML());
    return htmlParser.getFragment();
  }
}
