(function(){

	"use strict";

	angular.module('webgallery')
		.service('imageService', function($q,$http, $window){

            var service = this;
			service.imageData = [];
            service.commentData = [];
            service.drawingData = [];
			service.current_index = 0;
			service.thumbnail = [service.current_index-1, service.current_index, service.current_index+1];
            // this is a int for the pk of the CurrentGalleryID
            service.CurrentGalleryID = null;
			var defer = $q.defer();
            service.owner = null;

            service.getLoggedUser = function(callback){
                 $http.get('/webgallery/getLoggedUser/')
                    .success(function (data, status) {
                        service.owner = data;
                        callback(null, data);
                    })
                    .error(function (error, status) {
                        callback(error, null);
                    });
            };

            service.setCurrentGalleryID = function(id){
                service.CurrentGalleryID = id;
            };


			service.getDirectory = function( CurrentGalleryID, callback){
                service.CurrentGalleryID = CurrentGalleryID;
                 $http.get('/webgallery/getdirectory/'+CurrentGalleryID+'/')
                    .success(function (data, status) {
                        service.imageData = data;
                        callback(null, data);
                    })
                    .error(function (error, status) {
                        callback(error, null);
                    });

            };


            service.getComments = function( callback){
                if (service.imageData.length > 0) {
                    var id = service.imageData[service.current_index].pk;
                    $http.get('/webgallery/getComments/' + id + '/' )
                        .success(function (data, status) {
                            service.commentData = data;
                            callback(null, data);
                        })
                        .error(function (error, status) {
                            callback(error, null);
                        });
                }
            };

            service.getDrawing = function(callback){
                if (service.imageData.length > 0) {
                    var id = service.imageData[service.current_index].pk;
                    $http.get('/webgallery/getDrawing/' + id + '/')
                        .success(function (data, status) {
                            if (data.length > 0) {
                                service.drawingData = JSON.parse(data[0].fields.drawingImage);
                            }

                            callback(null, data);
                        })
                        .error(function (error, status) {
                            callback(error, null);
                        });
                }
            };

			service.init = function(d){
				service.imageData = d;

			};

			service.update = function(){
				return defer.promise;
			};



			var pushToLocal = function(){
			    localStorage["service.imageData"] = JSON.stringify(service.imageData);
			};

			service.getAll = function(){
				return service.imageData;
			};

            service.getAllComments = function(){
				return service.commentData;
			};

            service.getAllDrawing = function(){
                return service.drawingData;
            };

			service.getCurrentIndex = function(){
				return service.current_index;
			};

			service.getThumbnail = function(){
				return service.thumbnail;
			};

			service.moveLeft= function(CurrentGalleryID, callback){
                if (service.imageData.length > 0) {
                    var id = service.imageData[service.current_index].pk;
                    $http.get('/webgallery/getPrevImg/' + id + '/' + CurrentGalleryID + '/')
                        .success(function (data, status) {
                            service.imageData = data;
                            service.current_index = service.imageData.length - 1;
                            callback(null, data);
                        })
                        .error(function (error, status) {
                            callback(error, null);
                        });
                }
			};

			service.moveRight= function(CurrentGalleryID,callback){
                if (service.imageData.length > 0) {
                    var id = service.imageData[service.current_index].pk;
                    $http.get('/webgallery/getNextImg/' + id + '/' + CurrentGalleryID + '/')
                        .success(function (data, status) {
                            service.imageData = data;
                            service.current_index = 0;
                            callback(null, data);
                        })
                        .error(function (error, status) {
                            callback(error, null);
                        });
                }

			};


			service.addImage = function(image, callback){
                service.getLoggedUser(function(err,data){
                    if (err){

                    }
                    else{
                        service.owner = data;
                        var formdata = new FormData();
                        for (var key in image){
                            formdata.append(key, image[key]);
                        }
                        formdata.append('owner', service.owner[0].pk);
                        var request = {
                            method : 'POST',
                            url : '/webgallery/addImage/',
                            data: formdata ,
                            headers:{
                                'Content-Type' : undefined
                            }
                        };
                         $http(request)
                            .success(function(data,status){
                                callback(null, data);
                            })
                            .error(function(error, status){
                                callback(error, null);
                            });
                    }
                    $window.location.href = '/main/'+service.owner[0].pk;
			    });
			};


            service.addDrawing = function(drawing, callback){
                var formdata = new FormData();
                formdata.append('draw', drawing);
                var imageid = service.imageData[service.current_index].pk ;
                var request = {
					method : 'POST',
					url : '/webgallery/addDrawing/' + imageid +'/',
					data: formdata ,
					headers:{
						'Content-Type' : undefined
					}
				};
                $http(request)
                    .success(function(data,status){
                        callback(null, data);
                    })
                    .error(function(error, status){
                        callback(error,null);
                    });
            };

			service.addComment = function(comment, callback){
                var formdata = new FormData();
                for (var key in comment){
					formdata.append(key, comment[key]);
				}
                var id = service.imageData[service.current_index].pk ;
                var request = {
					method : 'POST',
					url : '/webgallery/img/' + id + '/addComment/',
					data: formdata ,
					headers:{
						'Content-Type' : undefined
					}
				};

				 $http(request)
                    .success(function(data,status){
                        service.commentData = data;
                        callback(null, data);
                    })
                    .error(function(error, status){
                        callback(error, null);
                    });
			};

			service.deleteImage = function(ownerID,callback){
                if (service.imageData.length > 0) {
                    var id = service.imageData[service.current_index].pk;
                    $http.post('/webgallery/deleteImage/' + id + '/' + ownerID + '/', {})
                        .success(function (data, status) {
                            if (service.current_index > 0) {
                                service.current_index--;
                            }
                            callback(null, data);
                        })
                        .error(function (error, status) {
                            callback(error, null);
                        });
                    if (service.imageData.length === 0) {
                    }
                }
			};

			service.deleteComment = function(i , callback){
                var imageid = service.imageData[service.current_index].pk ;
                var commentid = service.commentData[i].pk;
                $http.post('/webgallery/deleteComment/img/' + imageid +'/cmt/' + commentid +'/' ,{})
                    .success(function(data,status){
                        service.commentData = data;
                        callback(null, data);
                    })
                    .error(function(error, status){
                        callback(error,null);
                    });
			};

            service.erase = function( callback){
                var imageid = service.imageData[service.current_index].pk ;
                $http.post('/webgallery/eraseImg/' + imageid  +'/' ,{})
                    .success(function(data,status){
                        service.drawingData = data;
                        callback(null, data);
                    })
                    .error(function(error, status){
                        callback(error,null);
                    });
			};
	});
})();