// String Utils
import './utils/unsafe-template.test';
import './utils/template.test';
import './utils/camel-case.test';
import './utils/in-string.test';
import './utils/encode.test';
import './utils/to-base64.test';
import './utils/from-base64.test';
import './utils/to-hex.test';
import './utils/parse-style.test';
import './utils/normalize-value.test';
import './utils/denormalize-value.test';
import './utils/modifier-text.test';
import './utils/file-size.test';

// Native DOM Utils
import './utils/get-css.test';
import './utils/to-node-list.test';

// Nodes Utils
import './utils/query.test';
import './utils/split-nodes.test';
import './utils/merge-nodes.test';
import './utils/wrap-node-list.test';
import './utils/get-deep-element.test';
import './utils/remove-zws.test';
import './utils/remove-empty-marks.test';
import './utils/change-tag-name.test';
import './utils/fix-numbered-list.test';
import './utils/append-break.test';
import './utils/remove-break.test';
import './utils/indent-block.test';
import './utils/morph.test';
import './utils/is-visible.test';
import './utils/scroll-to-node.test';

// Box Utils
import './utils/get-box.test';

// Network Utils
import './utils/request.test';
import './utils/upload-file.test';

// Models
import './models/nodes.test';
import './models/fragment.test';
import './models/range.test';
import './models/box.test';

// Parsers
import './parsers/html-parser.test';
import './parsers/text-parser.test';

// Operations
import './operations/insert-bookmark.test';
import './operations/to-bookmark.test';
import './operations/insert-contents.test';
import './operations/delete-contents.test';
import './operations/set-blocks.test';
import './operations/split-block.test';
import './operations/insert-block.test';
import './operations/split-marks.test';
import './operations/add-mark.test';
import './operations/remove-mark.test';
import './operations/insert-box.test';
import './operations/remove-box.test';

// Managers
import './managers/selection.test';
import './managers/command.test';
import './managers/history.test';
import './managers/keystroke.test';
import './managers/box-manager.test';
import './managers/plugin.test';

// Boxes
import './boxes/hr.test';
import './boxes/hr-ui.test';
import './boxes/image.test';
import './boxes/image-ui.test';
import './boxes/video.test';
import './boxes/video-ui.test';
import './boxes/file.test';
import './boxes/file-ui.test';
import './boxes/emoji.test';
import './boxes/emoji-ui.test';
import './boxes/equation.test';
import './boxes/equation-ui.test';
import './boxes/mention.test';
import './boxes/mention-ui.test';

// Plugins
import './plugins/copy.test';
import './plugins/cut.test';
import './plugins/paste.test';
import './plugins/drop.test';
import './plugins/undo.test';
import './plugins/redo.test';
import './plugins/select-all.test';
import './plugins/heading.test';
import './plugins/block-quote.test';
import './plugins/list.test';
import './plugins/align.test';
import './plugins/indent.test';
import './plugins/bold.test';
import './plugins/italic.test';
import './plugins/underline.test';
import './plugins/strikethrough.test';
import './plugins/subscript.test';
import './plugins/superscript.test';
import './plugins/code.test';
import './plugins/font-family.test';
import './plugins/font-size.test';
import './plugins/font-color.test';
import './plugins/highlight.test';
import './plugins/remove-format.test';
import './plugins/format-painter.test';
import './plugins/link/insert-link.test';
import './plugins/link/link-popup.test';
import './plugins/link/link-popup-ui.test';
import './plugins/link/index.test';
import './plugins/hr.test';
import './plugins/code-block/code-block.test';
import './plugins/code-block/code-block-ui.test';
import './plugins/code-block/index.test';
import './plugins/image.test';
import './plugins/video.test';
import './plugins/file.test';
import './plugins/emoji.test';
import './plugins/equation.test';
import './plugins/special-character.test';
import './plugins/mention.test';
import './plugins/table/utils.test';
import './plugins/table/insert-table.test';
import './plugins/table/delete-table.test';
import './plugins/table/insert-column.test';
import './plugins/table/delete-column.test';
import './plugins/table/insert-row.test';
import './plugins/table/delete-row.test';
import './plugins/table/merge-cells.test';
import './plugins/table/split-cell.test';
import './plugins/table/index.test';
import './plugins/markdown.test';
import './plugins/enter-key.test';
import './plugins/shift-enter-key.test';
import './plugins/backspace-key.test';
import './plugins/delete-key.test';
import './plugins/tab-key.test';
import './plugins/arrow-keys.test';
import './plugins/escape-key.test';
import './plugins/slash.test';

// UI
import './ui/button.test';
import './ui/button-ui.test';
import './ui/dropdown.test';
import './ui/dropdown-ui.test';
import './ui/resizer.test';
import './ui/corner-toolbar.test';
import './ui/corner-toolbar-ui.test';
import './ui/menu.test';
import './ui/slash-menu.test';
import './ui/slash-menu-ui.test';
import './ui/mention-menu.test';
import './ui/mention-menu-ui.test';
import './ui/toolbar.test';
import './ui/floating-toolbar.test';
import './ui/floating-toolbar-ui.test';

// Editor
import './editor.test';

// Others
import './check-exports.test';
import './check-nodes.test';
