#! /usr/bin/env phantomjs

var page = require('webpage').create(),
  system = require('system'),
  address,
  selector,
  outFn,
  clipRect,
  timeOut;

if (system.args.length < 4 || system.args.length > 5) {
  console.log('Usage: ' + system.args[0] + ' <URL> <selector> <outfile> [timeout/ms]');
  phantom.exit(1);
}

address = system.args[1];
selector = system.args[2];
outFn = system.args[3];
timeOut = system.args.length === 5 ? +system.args[4] : 200;

page.open(address, function (status) {
  if (status !== 'success') {
    console.log('error -- cannot load address: ' + address);
    phantom.exit(1);
  }

  clipRect = page.evaluate(function (s) {
    var elem = document.querySelector(s);
    return elem ? elem.getBoundingClientRect() : {};
  }, selector);

  if (Object.keys(clipRect).length === 0) {
    console.log('error -- cannot select: ' + selector);
    phantom.exit(1);
  }

  page.clipRect = clipRect;

  window.setTimeout(function () {
    page.render(outFn);
    phantom.exit(0);
  }, timeOut);
});
