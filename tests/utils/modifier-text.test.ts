import { modifierText } from '../../src/utils/modifier-text';

const windowsUserAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 Edg/91.0.864.59';
const macUserAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_2) AppleWebKit/601.3.9 (KHTML, like Gecko) Version/9.0.2 Safari/601.3.9';
const linuxUserAgent = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36';

describe('utils / modifier-text', () => {

  it('should return correct text', () => {
    expect(modifierText('mod+Z', windowsUserAgent)).to.equal('Ctrl+Z');
    expect(modifierText('mod+Z', macUserAgent)).to.equal('⌘+Z');
    expect(modifierText('mod+Z', linuxUserAgent)).to.equal('Ctrl+Z');
  });

});
