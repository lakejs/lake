import { Editor, query } from 'lakelib';

export default (value: string) => {
  query('body').addClass('readonly');
  query('.lake-toolbar-root').remove();
  const editor = new Editor({
    root: '.lake-root',
    value,
    readonly: true,
  });
  editor.render();
  const html = editor.getHTML();
  editor.unmount();
  const container = query('<div class="lake-container"></div>');
  query('.lake-root').append(container);
  container.html(html);
  return editor;
};
