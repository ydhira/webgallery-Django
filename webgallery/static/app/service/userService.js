(function() {

    "use strict";

    angular.module('webgallery')
        .service('userService', function ($q, $http) {

            var service = this;
			service.allUsers = [] ;



            service.getAllUsers = function(callback){
                $http.get('/webgallery/getAllUsers/')
                    .success(function (data, status) {
                        service.allUsers = data;
                        callback(null, data);

                    })
                    .error(function (error, status) {
                        callback(error, null);
                    });
            };

            service.getAll = function(){
                return service.allUsers;
            };

        });

})();


