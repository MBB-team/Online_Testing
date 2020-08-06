// fscreen adaptation

window.fscreen = (function() {

  var core = {};

  core.key = {
    fullscreenEnabled: 0,
    fullscreenElement: 1,
    requestFullscreen: 2,
    exitFullscreen: 3,
    fullscreenchange: 4,
    fullscreenerror: 5,
    fullscreen: 6
  };

  core.webkit = [
    'webkitFullscreenEnabled',
    'webkitFullscreenElement',
    'webkitRequestFullscreen',
    'webkitExitFullscreen',
    'webkitfullscreenchange',
    'webkitfullscreenerror',
    '-webkit-full-screen',
  ];

  core.moz = [
    'mozFullScreenEnabled',
    'mozFullScreenElement',
    'mozRequestFullScreen',
    'mozCancelFullScreen',
    'mozfullscreenchange',
    'mozfullscreenerror',
    '-moz-full-screen',
  ];

  core.ms = [
    'msFullscreenEnabled',
    'msFullscreenElement',
    'msRequestFullscreen',
    'msExitFullscreen',
    'MSFullscreenChange',
    'MSFullscreenError',
    '-ms-fullscreen',
  ];

  // so it doesn't throw if no window or document
  core.document = typeof window !== 'undefined' && typeof window.document !== 'undefined' ? window.document : {};

  core.vendor = (
    ('fullscreenEnabled' in document && Object.keys(core.key)) ||
    (core.webkit[0] in document && core.webkit) ||
    (core.moz[0] in document && core.moz) ||
    (core.ms[0] in document && core.ms) ||
    []
  );

  core.fullscreenElement = function(){
    return document[core.vendor[core.key.fullscreenElement]];
  }

  return core;

  // export default {
  //   requestFullscreen: element => element[vendor[key.requestFullscreen]](),
  //   requestFullscreenFunction: element => element[vendor[key.requestFullscreen]],
  //   get exitFullscreen() { return document[vendor[key.exitFullscreen]].bind(document); },
  //   get fullscreenPseudoClass() { return ":" + vendor[key.fullscreen]; },
  //   addEventListener: (type, handler, options) => document.addEventListener(vendor[key[type]], handler, options),
  //   removeEventListener: (type, handler, options) => document.removeEventListener(vendor[key[type]], handler, options),
  //   get fullscreenEnabled() { return Boolean(document[vendor[key.fullscreenEnabled]]); },
  //   set fullscreenEnabled(val) {},
  //   get fullscreenElement() { return document[vendor[key.fullscreenElement]]; },
  //   set fullscreenElement(val) {},
  //   get onfullscreenchange() { return document[`on${vendor[key.fullscreenchange]}`.toLowerCase()]; },
  //   set onfullscreenchange(handler) { return document[`on${vendor[key.fullscreenchange]}`.toLowerCase()] = handler; },
  //   get onfullscreenerror() { return document[`on${vendor[key.fullscreenerror]}`.toLowerCase()]; },
  //   set onfullscreenerror(handler) { return document[`on${vendor[key.fullscreenerror]}`.toLowerCase()] = handler; },
  // };
})();
