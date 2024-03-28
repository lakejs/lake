// If your file hasn't any import or export line, this file would be executed
// in global scope that all declaration in it are visible outside this file.
// All magic come from var. Replace var with let or const won't work.
// See more in https://stackoverflow.com/questions/38906359/create-a-global-variable-in-typescript

/* eslint-disable no-var */

declare var expect: typeof chai.expect;
