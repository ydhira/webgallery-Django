(function(){
    "use strict";

    angular.module("webgallery")
        .controller("canvasController",function($scope,imageService){

            var image_id = null;

            var controller = this;

            var paint = false;

            var currentColor = "#000000";

            var canvas = document.getElementById('canvasTry');
            var context = canvas.getContext("2d");

            var addDrawing = function(x, y, drag){
              var point = {x:x,y:y,drag:drag,color:currentColor};
              imageService.add_drawing(image_id,point,function(err,data){
                  if (err) console.log(err);
              });
            };

            var update_canvas = function(){
                context.clearRect(0, 0, canvas.width, canvas.height);
                imageService.get_drawing(image_id,function(err,data){
                    if (err) console.log(err);
                    else{
                        console.log(image_id);

                        context.lineJoin = "round";
                        context.lineWidth = 2;
                        for(var i in data){
                            var p = data[i];
                            if(p.drag){
                                var prev = data[i-1];
                                context.beginPath();
                                context.moveTo(prev.x, prev.y);
                                context.lineTo(p.x, p.y);
                                context.closePath();
                                context.strokeStyle = p.color;
                                context.stroke();
                            }
                        }
                    }
                });
            };

            // init
            controller.init = function(id){
                image_id = id;
                update_canvas();
                canvas.onmousedown = function(e){
                    paint = true;
                    var x = e.pageX - this.offsetLeft;
                    var y = e.pageY - this.offsetTop;
                    addDrawing(x,y,false);
                    update_canvas();
                };

                canvas.onmousemove = function(e){
                    if(paint){
                        var x = e.pageX - this.offsetLeft;
                        var y = e.pageY - this.offsetTop;
                        addDrawing(x,y,true);
                        update_canvas();
                    }
                };

                canvas.onmouseup = function(e){
                    paint = false;
                };

                canvas.onmouseleave = function(e){
                    paint = false;
                };
           };
        });
})();