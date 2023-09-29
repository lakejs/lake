import { encode } from '../utils';

export class TextParser {

  private content: string;

  constructor(content: string) {
    this.content = content;
  }

  public getHTML(): string {
    let html = '';
    html = encode(this.content);
    html = `<p>${html}</p>`;
    html = html.replace(/(\r\n){2,}/g, '</p><p>');
    html = html.replace(/\r\n/g, '<br />');
    html = html.replace(/(\r|\n){2,}/g, '</p><p>');
    html = html.replace(/\r|\n/g, '<br />');
    html = html.replace(/<p><\/p>/g, '');
    return html;
  }
}
