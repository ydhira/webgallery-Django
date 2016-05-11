(function(){
    "use strict";


    angular.module('webgallery')
        .directive('ngFiles', ['$parse', function ($parse) {

            function fn_link(scope, element, attrs) {
                var onChange = $parse(attrs.ngFiles);
                element.on('change', function (event) {
                    onChange(scope, { $files: event.target.files });
                });
            }

            return {
                link: fn_link
            };
        } ]);

    angular.module('webgallery')
        .controller('adminController',function(imageService,$scope,$location, $window){

            var controller = this;
            this.showdropzone = true;
            controller.uploadMode = false;
            controller.file = null;
            controller.image = {};
            controller.ddpicture = null ;
            controller.toggle = function(){
                controller.uploadMode = !this.uploadMode;
                controller.image = {};
            };

            // http://www.encodedna.com/angularjs/tutorial/angularjs-file-upload-using-http-post-formdata-webapi.htm
            controller.upload = function ($files) {
                controller.image.img_file = $files[0];
            };

            controller.add_image = function(){

                controller.image.img_file = controller.file;
                imageService.addImage(controller.image, function(err,data){
                    if (err) {

                    }
                    else{
                        controller.image = {};
                        $scope.add_image_form.$setPristine();

                    }
                });
            };

            Dropzone.autoDiscover = false;

            $scope.dropzoneConfig = {


                'options': { // passed into the Dropzone constructor

                    url: 'notNeeded',
                    autoProcessQueue: false,
                    maxFiles: 1,
                    addRemoveLinks: true,
                    acceptedFiles: 'image/*',
                    accept: function (file, done) {
                        controller.file = file;
                        done();
                    }
                },

                'eventHandlers': {


                  'sending': function (file, xhr, formData) {
                  },
                  'success': function (file, response) {
                  }
                }
              };


        });
})();