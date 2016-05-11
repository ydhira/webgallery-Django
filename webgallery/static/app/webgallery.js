(function(){

  "use strict";

angular.module('dropzone', []).directive('dropzone', function () {
  return function (scope, element, attrs) {
    var config, dropzone;

    config = scope[attrs.dropzone];
    console.log("Hello from dropzone", element[0]);
    dropzone = new Dropzone(element[0], config.options);
    console.log("hello after");

    angular.forEach(config.eventHandlers, function (handler, event) {
      dropzone.on(event, handler);
    });
  };
});


angular.module('webgallery',['dropzone'])
        .config(function($interpolateProvider) {
             //http://django-angular.readthedocs.org/en/latest/integration.html
             $interpolateProvider.startSymbol('{$');
             $interpolateProvider.endSymbol('$}');
         });


})();

