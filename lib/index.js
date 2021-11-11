#!/usr/bin/env node
let args = process.argv.splice(2);
const type = args[0];
const isComponent = type === 'c' || type === 'C';

let generate = () => {};
if (isComponent) {
  generate = require('./generateView/generateComponent');
  args = args.splice(1);
} else {
  generate = require('./generateView/generatePage');
}

const init = async () => {
  if (args.length > 0) {
    for (let i = 0; i < args.length; i++) {
      e = args[i];
      !!e && (await generate(e, args.length - 1 === i));
    }
  } else {
    generate();
  }
};

init();
