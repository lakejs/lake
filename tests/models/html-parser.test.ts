import { expect } from 'chai';
import { parseStyle, query } from '../../src/utils';
import { Nodes, HTMLParser } from '../../src/models';

describe('models.HTMLParser class', () => {

  let container: Nodes;

  beforeEach(() => {

    container = query('<div contenteditable="true" />');
    query(document.body).append(container);
  });

  afterEach(() => {
    container.remove();
  });

  it('DOM: should remove those nodes that do not match rules.', () => {
    container.html('<h1>foo</h1><p>bar<temp2>two</temp2></p><temp1>one</temp1>');
    const htmlParser = new HTMLParser(container);
    const nodeList = htmlParser.getNodeList();
    expect(nodeList.length).to.equal(2);
    expect(container.find('h1').length).to.equal(1);
    expect(container.find('p').length).to.equal(1);
    expect(container.find('temp1').length).to.equal(0);
    expect(container.find('temp2').length).to.equal(0);
  });

  it('DOM: should remove those id attributes that do not match rules.', () => {
    container.html('<h1 id="one">foo</h1><p id="...">bar</p>');
    const htmlParser = new HTMLParser(container);
    const nodeList = htmlParser.getNodeList();
    expect(nodeList.length).to.equal(2);
    expect(container.find('h1').attr('id')).to.equal('one');
    expect(container.find('p').hasAttr('id')).to.equal(false);
  });

  it('DOM: should remove those class attributes that do not match rules.', () => {
    container.html('<h1 class="one">foo</h1><p class="...">bar</p>');
    const htmlParser = new HTMLParser(container);
    const nodeList = htmlParser.getNodeList();
    expect(nodeList.length).to.equal(2);
    expect(container.find('h1').attr('class')).to.equal('one');
    expect(container.find('p').hasAttr('class')).to.equal(false);
  });

  it('DOM: should remove those href attributes that do not match rules.', () => {
    container.html('<a href="http://url/">foo</a>');
    const htmlParser = new HTMLParser(container);
    const nodeList = htmlParser.getNodeList();
    expect(nodeList.length).to.equal(1);
    expect(container.find('a').attr('href')).to.equal('http://url/');
  });

  it('DOM: should remove those target attributes that do not match rules.', () => {
    container.html('<a href="http://url1/" target="_blank">foo</a><a href="http://url2/" target="...">bar</a>');
    const htmlParser = new HTMLParser(container);
    const nodeList = htmlParser.getNodeList();
    expect(nodeList.length).to.equal(2);
    expect(container.find('a').attr('target')).to.equal('_blank');
    expect(container.find('a').eq(1).hasAttr('target')).to.equal(false);
  });

  it('DOM: should remove those styles that do not match rules.', () => {
    container.html('<span style="color: red; background-color: blue; margin: 1px;">foo</span>');
    const htmlParser = new HTMLParser(container);
    const nodeList = htmlParser.getNodeList();
    expect(nodeList.length).to.equal(1);
    const styles = parseStyle(container.find('span').attr('style'));
    expect(styles.color).to.equal('red');
    expect(styles['background-color']).to.equal('blue');
    expect(styles.margin).to.equal(undefined);
  });

});
