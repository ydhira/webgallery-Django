(function(){
	"use strict";

	angular.module("webgallery")
		.controller("galleryController", function(imageService,userService, $scope,$window,$location){

			var controller = this;
			controller.imageData = imageService.getAll();
			controller.current_index = imageService.getCurrentIndex();
            controller.commentData = imageService.getAllComments();
            controller.drawingData = imageService.getAllDrawing();

			controller.thumbnail = imageService.getThumbnail();
			controller.newComment = {};

			controller.currentColor = "#000000";
		    controller.paint = false;
		    controller.editor = false;
            controller.firstUser = true;

		    controller.showLeftRight = true;
		    controller.showEditButton = true;
		    controller.backEditButton = false;
		   	controller.displayShow = true;
		    controller.showButton = false;

            controller.movedRight = false;
            controller.movedLeft = false;
			controller.allUsers = userService.getAll();
			//this is user object
			controller.owner = null ;


			imageService.getLoggedUser(function(err,data){
				if (err){

				}
				else{
					controller.owner = data;
				}

			});

			controller.pathArray = window.location.pathname.split( '/' );
			//this is an int. pk for the user you clicked
			controller.CurrentGalleryID = controller.pathArray[2];

			imageService.getDirectory( controller.CurrentGalleryID,function(err, data){
				if (err) {

				}
				else {

					controller.imageData = data;
					controller.movedLeft = false;
					controller.movedRight = false;

					imageService.getComments(function(err, data){
						if (err){

                        }
						else {
							controller.commentData = data;
						}
					});

					imageService.getDrawing(function(err, data){
						if (err) console.log(err);
						else {
							//JSON.parse(data);
							if (data.length >0 ) {
								controller.drawingData = JSON.parse(data[0].fields.drawingImage);
							}

							else{
								controller.drawingData = [];
							}
							controller.update_canvas();

						}
					});
				}
			});

		    controller.viewImage = function(id){
		    };

		    controller.addDrawing = function(x, y, drag){
		    	controller.drawingData.push({x:x,y:y,drag:drag,color:controller.currentColor});
		    };

            controller.addDrawingDatabse = function(){
                var jsonChar = JSON.stringify(controller.drawingData);
                imageService.addDrawing(jsonChar, function(err, data){
					if (err) {

					}
                    else{

                    }
				});
            };

		    controller.erase = function(){
		    	var canvas = angular.element(document.querySelector('#canvasTry'))[0];
		        var context = canvas.getContext("2d");
		        context.clearRect(0, 0, canvas.width, canvas.height);

                imageService.erase( function(err, data){
					if (err) {

					}
                    else {
                        controller.drawingData = [] ;
                        controller.update_canvas();
                    }
				});
		    };

		    controller.changeToYellow = function(){
		    	controller.currentColor = "#fdff00";
		    };

		    controller.changeToRed = function(){
		    	controller.currentColor = "#FF0000";
		    };

            controller.editImage = function(){
                if (controller.CurrentGalleryID == controller.owner[0].pk) {
                    controller.showButton = true;
                    controller.showLeftRight = false;
                    controller.editor = true;
                    controller.showEditButton = false;
                    controller.backEditButton = true;
                }
            };

            controller.backEdit = function(){
		    	controller.showLeftRight = true;
		    	controller.paint = false;
		    	controller.editor = false;
		    	controller.showEditButton = true;
		    	controller.backEditButton = false;
		    	controller.showButton = false;
                controller.addDrawingDatabse();
            };

            controller.update_canvas = function(){

		    	var canvas = angular.element(document.querySelector('#canvasTry'))[0];
                var context = canvas.getContext("2d");
		        context.clearRect(0, 0, canvas.width, canvas.height);
                context.lineJoin = "round";
		        context.lineWidth = 2;

		        for(var i in controller.drawingData){
		            var p = controller.drawingData[i];
		            if(p.drag && controller.drawingData[i-1] !== undefined){
		                var prev = controller.drawingData[i-1];
		                context.beginPath();
		                context.moveTo(prev.x, prev.y);
		                context.lineTo(p.x, p.y);
		                context.closePath();
		                context.strokeStyle = p.color;
		                context.stroke();
		            }
		        }
            };


			controller.init_canvas = function(){
                    var canvas = document.getElementById('canvasTry');
                    var context = canvas.getContext("2d");
                    canvas.onmousedown = function (e) {
                        if (controller.editor) {
                            controller.paint = true;
                            var x = e.pageX - this.offsetLeft;
                            var y = e.pageY - this.offsetTop;
                            controller.addDrawing(x, y, false);
                            controller.update_canvas();
                        }
                    };

                    canvas.onmousemove = function (e) {
                        if (controller.paint) {
                            var x = e.pageX - this.offsetLeft;
                            var y = e.pageY - this.offsetTop;
                            controller.addDrawing(x, y, true);
                            controller.update_canvas();
                        }
                    };

                    canvas.onmouseup = function (e) {
                        controller.paint = false;
                    };

                    canvas.onmouseleave = function (e) {
                        controller.paint = false;
                    };
			};



            controller.addComment = function(){
                imageService.addComment(controller.newComment, function(err, data){
					if (err) {

					}
                    else{
                        controller.commentData = data;
                    }
				});

                controller.newComment = {};
                $scope.addComment.$setPristine();

            };


			controller.moveLeft = function(){
				imageService.moveLeft( controller.CurrentGalleryID, function(err, data){
					if (err) {

					}
                    else {
                        controller.imageData = data;
						controller.current_index = controller.imageData.length - 1;

						imageService.getComments(function(err, data){
                        if (err){

                        }
                        else {
                            controller.commentData = data;
							}
						});

						imageService.getDrawing(function(err, data){
							if (err) console.log(err);
							else {
								//JSON.parse(data);
								if (data.length >0 ) {
									controller.drawingData = JSON.parse(data[0].fields.drawingImage);
								}

								else{
									controller.drawingData = [];
								}
								controller.update_canvas();
							}
						});

                    }

				});
			};

			controller.moveRight = function(){
				imageService.moveRight( controller.CurrentGalleryID,function(err, data){
					if (err) {

					}
                    else {
                        controller.imageData = data;
						controller.current_index = 0;
						imageService.getComments(function(err, data){
                        if (err) console.log(err);
                        else {
                            controller.commentData = data;
                        	}
						});

					imageService.getDrawing(function(err, data){
						if (err) console.log(err);
						else {
							if (data.length >0 ) {
								controller.drawingData = JSON.parse(data[0].fields.drawingImage);
							}
							else{
								controller.drawingData = [];
							}
							controller.update_canvas();
						    }
					    });
					}

				});
			};


			controller.deleteImage = function() {
				if (controller.CurrentGalleryID == controller.owner[0].pk) {
					imageService.deleteImage(controller.owner[0].pk, function (err, data) {
						if (err) {

						}
						else {
							controller.imageData = data;
							console.log("after deletion, data got is ", controller.imageData );
							imageService.getComments(function(err, data){
							if (err) console.log(err);
							else {
								controller.commentData = data;
								}
							});
							imageService.getDrawing(function(err, data){
								if (err) console.log(err);
								else {
									//JSON.parse(data);
									if (data.length >0 ) {
										controller.drawingData = JSON.parse(data[0].fields.drawingImage);
									}
									else{
										controller.drawingData = [];
									}
									controller.update_canvas();
								}
							});
						}
					});

					controller.update_canvas();
				}

			};
			controller.deleteComment = function(i){

                if (controller.CurrentGalleryID == controller.owner[0].pk || controller.commentData[i].fields.commentMadeBy == controller.owner[0].pk ) {
                    imageService.deleteComment(i, function (err, data) {
                        if (err) {

                        }
                        else controller.commentData = data;
                    });
                }
			};

			controller.updateView = function(){
				controller.current_index = imageService.getCurrentIndex();
				controller.thumbnail = imageService.getThumbnail();
			};
		});
})();
