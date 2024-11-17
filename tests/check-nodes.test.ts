import { query } from '../src/utils/query';

describe('check nodes', () => {

  it('should remove nodes for test', () => {
    const execNode = query('.mocha-exec');
    let node = execNode.next();
    while (node.length > 0) {
      if (node.isElement && !node.hasClass('lake-ui-test')) {
        // eslint-disable-next-line no-console
        console.error(node.get(0));
      }
      node = node.next();
    }
  });

});
