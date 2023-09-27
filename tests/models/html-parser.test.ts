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

  it('getNodeList method: should remove those elements that do not match rules.', () => {
    container.html('<h1>foo</h1><p>bar<temp2>two</temp2></p><temp1>one</temp1>');
    const htmlParser = new HTMLParser(container);
    const nodeList = htmlParser.getNodeList();
    expect(nodeList.length).to.equal(3);
    expect(container.find('h1').length).to.equal(1);
    expect(container.find('p').length).to.equal(1);
    expect(container.find('temp1').length).to.equal(0);
    expect(container.find('temp2').length).to.equal(0);
  });

  it('getNodeList method: should remove those id attributes that do not match rules.', () => {
    container.html('<h1 id="one">foo</h1><p id="...">bar</p>');
    const htmlParser = new HTMLParser(container);
    const nodeList = htmlParser.getNodeList();
    expect(nodeList.length).to.equal(2);
    expect(container.find('h1').attr('id')).to.equal('one');
    expect(container.find('p').hasAttr('id')).to.equal(false);
  });

  it('getNodeList method: should remove those class attributes that do not match rules.', () => {
    container.html('<h1 class="one">foo</h1><p class="...">bar</p>');
    const htmlParser = new HTMLParser(container);
    const nodeList = htmlParser.getNodeList();
    expect(nodeList.length).to.equal(2);
    expect(container.find('h1').attr('class')).to.equal('one');
    expect(container.find('p').hasAttr('class')).to.equal(false);
  });

  it('getNodeList method: should keep those href attributes that match rules.', () => {
    container.html('<a href="http://url/">foo</a>');
    const htmlParser = new HTMLParser(container);
    const nodeList = htmlParser.getNodeList();
    expect(nodeList.length).to.equal(1);
    expect(container.find('a').attr('href')).to.equal('http://url/');
  });

  it('getNodeList method: should remove those target attributes that do not match rules.', () => {
    container.html('<a href="http://url1/" target="_blank">foo</a><a href="http://url2/" target="...">bar</a>');
    const htmlParser = new HTMLParser(container);
    const nodeList = htmlParser.getNodeList();
    expect(nodeList.length).to.equal(2);
    expect(container.find('a').attr('target')).to.equal('_blank');
    expect(container.find('a').eq(1).hasAttr('target')).to.equal(false);
  });

  it('getNodeList method: should remove those styles that do not match rules.', () => {
    container.html('<span style="color: red; background-color: blue; margin: 1px;">foo</span>');
    const htmlParser = new HTMLParser(container);
    const nodeList = htmlParser.getNodeList();
    expect(nodeList.length).to.equal(1);
    const styles = parseStyle(container.find('span').attr('style'));
    expect(styles.color).to.equal('red');
    expect(styles['background-color']).to.equal('blue');
    expect(styles.margin).to.equal(undefined);
  });

  it('getHTML method: should remove those tags that do not match rules.', () => {
    const input = '<h1>foo</h1><p>bar<temp2>two</temp2></p><temp1>one</temp1>';
    const output = '<h1>foo</h1><p>bartwo</p>one';
    container.html(input);
    const htmlParser = new HTMLParser(container);
    expect(htmlParser.getHTML()).to.equal(output);
  });

  it('getHTML method: should remove those id attributes that do not match rules.', () => {
    const input = '<h1 id="one">foo</h1><p id="...">bar</p>';
    const output = '<h1 id="one">foo</h1><p>bar</p>';
    container.html(input);
    const htmlParser = new HTMLParser(container);
    expect(htmlParser.getHTML()).to.equal(output);
  });

  it('getHTML method: should remove those class attributes that do not match rules.', () => {
    const input = '<h1 class="one">foo</h1><p class="...">bar</p>';
    const output = '<h1 class="one">foo</h1><p>bar</p>';
    container.html(input);
    const htmlParser = new HTMLParser(container);
    expect(htmlParser.getHTML()).to.equal(output);
  });

  it('getHTML method: should keep those href attributes that match rules.', () => {
    const input = '<a href="http://url/">foo</a>';
    const output = input;
    container.html(input);
    const htmlParser = new HTMLParser(container);
    expect(htmlParser.getHTML()).to.equal(output);
  });

  it('getHTML method: should remove those target attributes that do not match rules.', () => {
    const input = '<a href="http://url1/" target="_blank">foo</a><a href="http://url2/" target="...">bar</a>';
    const output = '<a href="http://url1/" target="_blank">foo</a><a href="http://url2/">bar</a>';
    container.html(input);
    const htmlParser = new HTMLParser(container);
    expect(htmlParser.getHTML()).to.equal(output);
  });

  it('getHTML method: should remove those styles that do not match rules.', () => {
    const input = '<span style="color: red; background-color: blue; margin: 1px;">foo</span>';
    const output = '<span style="color: red; background-color: blue;">foo</span>';
    container.html(input);
    const htmlParser = new HTMLParser(container);
    expect(htmlParser.getHTML()).to.equal(output);
  });

  it('getHTML method: should remove those void nodes that do not match rules.', () => {
    const input = '<p>bar<br /><embed /></p>';
    const output = '<p>bar<br /></p>';
    container.html(input);
    const htmlParser = new HTMLParser(container);
    expect(htmlParser.getHTML()).to.equal(output);
  });

  it('getHTML method: including reserved characters', () => {
    const input = '<p>foo&lt;&gt;&quot;&amp; &nbsp; &nbsp; –—©\'</p>';
    const output = input;
    container.html(input);
    const htmlParser = new HTMLParser(container);
    expect(htmlParser.getHTML()).to.equal(output);
  });

});
