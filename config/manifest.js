/* eslint-env node */
'use strict';

module.exports = function(/* environment, appConfig */) {
  // See https://github.com/san650/ember-web-app#documentation for a list of
  // supported properties

  return {
    name: "Easy Budget",
    short_name: "EZ Budget",
    description: "",
    start_url: "/",
    display: "standalone",
    background_color: "#233D4D",
    theme_color: "#3f51b5",
    icons: [
    ],
    ms: {
      tileColor: '#fff'
    }
  };
}
