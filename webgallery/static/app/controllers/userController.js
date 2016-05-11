(function() {
    "use strict";

    angular.module("webgallery")


        .controller("webgalleryController", function (userService, imageService, $http) {
            var controller = this;
            controller.allUsers = userService.getAll();

            userService.getAllUsers(function(err, data) {
                if (err) {

                }
                else {
                    controller.allUsers = data;
                }
            });

            controller.viewWebgallery= function (id){
                imageService.setOwner(id);

            };

        });

})();