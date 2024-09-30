import { showBox } from '../utils';

const htmlCode = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Lake example - IIFE / UMD</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" href="../dist/lake.css" />
    <script src="../node_modules/lake-codemirror/dist/codemirror.min.js"></script>
    <script src="../dist/lake.min.js"></script>
    <style>
      .lake-editor {
        padding: 0 8px;
        margin: 0 auto;
        min-width: 300px;
        max-width: 1000px;
      }
      .lake-toolbar-root {
        border: 1px solid #d9d9d9;
        border-bottom: 0;
      }
      .lake-root {
        border: 1px solid #d9d9d9;
        height: calc(100vh - 160px);
        overflow: auto;
      }
    </style>
  </head>
  <body>
    <div class="lake-editor">
      <div class="lake-toolbar-root"></div>
      <div class="lake-root"></div>
    </div>
    <script>
      const toolbar = new Lake.Toolbar({
        root: '.lake-toolbar-root',
      });
      const editor = new Lake.Editor({
        root: '.lake-root',
        toolbar,
        value: '<p><br /><focus /></p>',
      });
      editor.render();
    </script>
  </body>
</html>
`.trim();

const cssCode = `
.lake-container {
  font-family: var(--lake-font-family);
  font-size: 16px;
  color: var(--lake-text-color);
  padding: 16px 24px;
}
.lake-container:focus {
  outline: none;
}
`.trim();

const javascriptCode = `
class name {
  // class body
}
class name extends otherName {
  // class body
}

const number = 42;

try {
  number = 99;
} catch (err) {
  console.log(err);
  // Expected output: TypeError: invalid assignment to const 'number'
  // (Note: the exact output may be browser-dependent)
}

console.log(number);
// Expected output: 42
`.trim();

const javaCode = `
import com.demo.util.MyType;
import com.demo.util.MyInterface;

public enum Enum {
  VAL1, VAL2, VAL3
}

public class Class<T, V> implements MyInterface {
  public static final MyType<T, V> member;

  private class InnerClass {
    public int zero() {
      return 0;
    }
  }

  @Override
  public MyType method() {
    return member;
  }

  public void method2(MyType<T, V> value) {
    method();
    value.method3();
    member = value;
  }
}
`.trim();

describe('boxes / code-block-ui', () => {

  it('HTML', () => {
    showBox('codeBlock', {
      lang: 'html',
      code: htmlCode,
    }, box => {
      expect(box.value.lang).to.equal('html');
    });
  });

  it('HTML (read-only)', () => {
    showBox('codeBlock', {
      lang: 'html',
      code: htmlCode,
    }, box => {
      expect(box.value.lang).to.equal('html');
    }, true);
  });

  it('CSS', () => {
    showBox('codeBlock', {
      lang: 'css',
      code: cssCode,
    }, box => {
      expect(box.value.lang).to.equal('css');
    });
  });

  it('JavaScript', () => {
    showBox('codeBlock', {
      lang: 'javascript',
      code: javascriptCode,
    }, box => {
      expect(box.value.lang).to.equal('javascript');
    });
  });

  it('Java', () => {
    showBox('codeBlock', {
      lang: 'java',
      code: javaCode,
    }, box => {
      expect(box.value.lang).to.equal('java');
    });
  });

  it('error status', () => {
    const CodeMirror = window.LakeCodeMirror;
    window.LakeCodeMirror = undefined;
    showBox('codeBlock', {
      lang: 'javascript',
      code: javascriptCode,
    }, box => {
      expect(box.getContainer().find('.lake-code-block-error').length).to.equal(1);
      window.LakeCodeMirror = CodeMirror;
    });
  });

  it('error status (read-only): should not display', () => {
    const CodeMirror = window.LakeCodeMirror;
    window.LakeCodeMirror = undefined;
    showBox('codeBlock', {
      lang: 'javascript',
      code: javascriptCode,
    }, box => {
      expect(box.node.computedCSS('display')).to.equal('none');
      window.LakeCodeMirror = CodeMirror;
    }, true);
  });

});
