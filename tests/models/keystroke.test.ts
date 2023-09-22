import { expect } from 'chai';
import { query } from '../../src/utils';
import { Nodes, Keystroke } from '../../src/models';

describe('models.Keystroke class', () => {

  let container: Nodes;

  beforeEach(() => {

    container = query('<div contenteditable="true" />');
    container.html('<p>foo</p>');
    query(document.body).append(container);
  });

  afterEach(() => {
    container.remove();
  });

  it('sets mod+b and then emits it', () => {
    const keystroke = new Keystroke(container);
    keystroke.setKeydown('mod+b', () => container.html('mod+b'));
    keystroke.keydown('mod+b');
    expect(container.html()).to.equal('mod+b');
    container.html('<p>foo</p>');
    keystroke.keydown('$mod+KeyB');
    expect(container.html()).to.equal('mod+b');
  });

  it('sets mod+shift+x and then emits it', () => {
    const keystroke = new Keystroke(container);
    keystroke.setKeydown('mod+shift+x', () => container.html('mod+shift+x'));
    keystroke.keydown('mod+shift+x');
    expect(container.html()).to.equal('mod+shift+x');
    container.html('<p>foo</p>');
    keystroke.keydown('$mod+Shift+KeyX');
    expect(container.html()).to.equal('mod+shift+x');
  });

  it('sets enter and then emits it', () => {
    const keystroke = new Keystroke(container);
    keystroke.setKeydown('enter', () => container.html('enter'));
    keystroke.keydown('enter');
    expect(container.html()).to.equal('enter');
    container.html('<p>foo</p>');
    keystroke.keydown('Enter');
    expect(container.html()).to.equal('enter');
  });

  it('sets mod+] and then emits it', () => {
    const keystroke = new Keystroke(container);
    keystroke.setKeydown('mod+]', () => container.html('mod+]'));
    keystroke.keydown('mod+]');
    expect(container.html()).to.equal('mod+]');
    container.html('<p>foo</p>');
    keystroke.keydown('$mod+]');
    expect(container.html()).to.equal('mod+]');
  });

});
