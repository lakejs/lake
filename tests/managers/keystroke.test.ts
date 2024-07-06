import { isMac } from '../utils';
import { query } from '../../src/utils';
import { Nodes } from '../../src/models/nodes';
import { Keystroke } from '../../src/managers/keystroke';

describe('managers / keystroke', () => {

  let container: Nodes;

  beforeEach(() => {
    container = query('<div contenteditable="true" />');
    container.html('<p>foo</p>');
    query(document.body).append(container);
  });

  afterEach(() => {
    container.remove();
  });

  it('setKeydown method: should trigger mod+b', () => {
    const keystroke = new Keystroke(container);
    keystroke.setKeydown('mod+b', () => container.html('mod+b'));
    container.emit('keydown', new KeyboardEvent('keydown', {
      ctrlKey: !isMac,
      metaKey: isMac,
      key: 'b',
    }));
    expect(container.html()).to.equal('mod+b');
  });

  it('setKeydown method: should trigger mod+shift+x', () => {
    const keystroke = new Keystroke(container);
    keystroke.setKeydown('mod+shift+x', () => container.html('mod+shift+x'));
    container.emit('keydown', new KeyboardEvent('keydown', {
      ctrlKey: !isMac,
      metaKey: isMac,
      shiftKey: true,
      key: 'x',
    }));
    expect(container.html()).to.equal('mod+shift+x');
  });

  it('setKeydown method: should trigger arrow-left', () => {
    const keystroke = new Keystroke(container);
    keystroke.setKeydown('arrow-left', () => container.html('arrow-left'));
    container.emit('keydown', new KeyboardEvent('keydown', {
      key: 'ArrowLeft',
    }));
    expect(container.html()).to.equal('arrow-left');
  });

  it('setKeydown method: should trigger mod+]', () => {
    const keystroke = new Keystroke(container);
    keystroke.setKeydown('mod+]', () => container.html('mod+]'));
    container.emit('keydown', new KeyboardEvent('keydown', {
      ctrlKey: !isMac,
      metaKey: isMac,
      key: ']',
    }));
    expect(container.html()).to.equal('mod+]');
  });

  it('setKeydown method: should trigger enter', () => {
    const keystroke = new Keystroke(container);
    keystroke.setKeydown('enter', () => container.html('enter'));
    container.emit('keydown', new KeyboardEvent('keydown', {
      key: 'Enter',
      isComposing: false,
    }));
    expect(container.html()).to.equal('enter');
  });

  it('setKeydown method: should not trigger enter in composition mode', () => {
    const keystroke = new Keystroke(container);
    keystroke.setKeydown('enter', () => container.html('enter'));
    container.emit('keydown', new KeyboardEvent('keydown', {
      key: 'Enter',
      isComposing: true,
    }));
    expect(container.html()).to.equal('<p>foo</p>');
  });

  it('setKeyup method: should trigger enter', () => {
    const keystroke = new Keystroke(container);
    keystroke.setKeyup('enter', () => container.html('enter'));
    container.emit('keyup', new KeyboardEvent('keyup', {
      key: 'Enter',
      isComposing: false,
    }));
    expect(container.html()).to.equal('enter');
  });

  it('keydown method: should trigger enter', () => {
    const keystroke = new Keystroke(container);
    keystroke.setKeydown('enter', () => container.html('enter'));
    keystroke.keydown('enter');
    expect(container.html()).to.equal('enter');
  });

  it('keyup method: should trigger enter', () => {
    const keystroke = new Keystroke(container);
    keystroke.setKeyup('enter', () => container.html('enter'));
    keystroke.keyup('enter');
    expect(container.html()).to.equal('enter');
  });

});
