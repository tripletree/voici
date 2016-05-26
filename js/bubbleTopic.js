var width  = 800;	//SVG绘制区域的宽度
var height = 800;	//SVG绘制区域的高度
			
		/*var svg = d3.select("#topic")			//选择<div id="topic">
					.append("svg")			//在<body>中添加<svg>
					.attr("width", width)	//设定<svg>的宽度属性
					.attr("height", height);//设定<svg>的高度属性*/

var radius = 400; 
var nTop = 0;
var oR = 20;
var childR = 0;
var w = window.innerWidth;
var h = window.innerHeight;


var cluster = d3.layout.cluster()
    .size([360, 410]);

/*var diagonal = d3.svg.diagonal.radial()
    .projection(function(d) { return [d.y, d.x / 180 * Math.PI]; });*/


var svg = d3.select("#topic").append("svg")
.attr("width",w)
.attr("height",h);

svg.append("rect")
.attr("id","deselector")
.attr("width",w)
.attr("height",h)
.style("fill","white")
.style("opacity",0)
.on("click",function() {return resetBubbles();});
 
 var main = svg.append("g")
 	.attr("width", radius * 2)
    .attr("height", radius * 2)
    .attr("transform", "translate(" + radius + "," + 300 + ")");

    var intro = main.append("g").attr("class","intro") 
    
     intro
    .append("text")
    .attr("transform","translate(-90,24)")
    .text("20 topics in total, 11 shared")
    .style("opacity",0)
    .transition()
    .style("opacity",1);

    intro
    .append("text")
    .attr("transform","translate(-54,0)")
    .text("Weibo")
    .style("opacity",0)
    .transition()
    .style("opacity",1);

     intro
    .append("text")
    .attr("transform","translate(25,0)")
    .text("Video")
    .style("opacity",0)
    .transition()
    .style("opacity",1);

    intro.append("circle")
    .attr("r",5)
    .attr("transform","translate(-65,-6)")
    .style("fill", "#EEACC8");

     intro.append("circle")
    .attr("r",5)
    .attr("transform","translate(12,-6)")
    .style("fill", "#95D7F2");




d3.json("./data/flare.json", function(error, root) {
  if (error) throw error;

 var nodes = cluster.nodes(root);
  

  var node = main.selectAll(".topBubble")

      .data(root.children)
    .enter().append("g")
    	  	.attr("class", "topBubble")
          
          node
          .attr("transform",function(d) { return "rotate(" + (d.x - 90) + ")translate(0)"; })
    	  	.transition()
    	  	.ease("elastic")
    	  	.duration(1000)

          .attr("transform", function(d) { return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")"; });
      

  nTop=root.children.length;
  console.log(nTop);


  node.append("circle")
  	  .attr("class", "topCircle")
      .attr("r", function(d) { return oR; })
      .style("fill", "#95D7F2")
      .style("opacity",0.8)
      .on("mouseover", function(d,i) {return hoverBubble(d,i);})

      .on("click", function(d,i) {return activateBubble(d,i);});

  node.append("text")
      .attr("dy", ".31em")
      .attr("class", "topBubbleText")
      .attr("text-anchor", function(d) { return d.x < 180 ? "start" : "end"; })
      .attr("transform", function(d) { return d.x < 180 ? "translate(25)" : "rotate(180)translate(-25)"; })
      .text(function(d) { return d.name; });




      for(var i=0;i<nTop;i++){

      	var childNode = main.selectAll(".childNode"+i)
      		.data(root.children[i].children)
      		.enter().append("g")
      		.attr("class","childNode"+i)
      		.attr("transform", function(d) { return "rotate(" + (d.x - 90) +  ")translate(" + (d.y-180)+ ")";  })    		
      		.style("opacity", 0);



      	childNode.append("circle")
      		 .attr("class","childCircle"+i)
      		 .attr("r", function(d){return d.size*20;})
      		 .style("fill", "#95D7F2");
      		 

      	childNode.append("text")
      		.attr("class", "childText")
      		.attr("text-anchor", function(d) { return d.x < 180 ? "start" : "end"; })
            .attr("transform", function(d) { return d.x < 180 ? "translate(25)" : "rotate(180)translate(-25)"; })
      		.text(function(d) { return d.name; });
      		

      	}

      
});

d3.json("./data/weibo.json", function(error, root) {
  if (error) throw error;

 var weibonodes = cluster.nodes(root);


  var weibonode = main.selectAll(".weibotopBubble")
      .data(root.children)
    .enter().append("g")
    	  .attr("class","weibotopBubble")
    	  	
    	  	weibonode
    	  	.attr("transform",function(d,i) { return "rotate(" + (d.x - 90) + ")translate(" + (0) + ")"; })
    	  	.transition()
    	  	.ease("elastic")
    	  	.duration(1000)
            .attr("transform", function(d,i) { return "rotate(" + (d.x - 90) + ")translate(" + (d.y-50) + ")"; });
    	
         

      


  weibonode.append("circle")
  	  .attr("class", "weibotopCircle")
      .attr("r", function(d) { 
      
      		return 20; 
     
      })
      .style("fill", "#EEACC8")
      .style("opacity",function(d){
      	if(d.name)
      	
      		return 0.8;
      	else
      		return 0;
      	

      })
      .on("click", function(d,i) {return activateWeiboBubble(d,i);})
      .on("mouseover", function(d,i) {return hoverWeiboBubble(d,i);});
      
  

});

    var div = d3.select("body").append("div")
    .attr("class", "video-panel")               
    .style("opacity", 0);  

    div.append("h5")
       .text("相关视频")
       .style("margin","10px");

    var videoList = div.append("ul");
    

   var videowrap = videoList.append("li").attr("class","video-list-item")
   .append("a")
    .attr("href","http://www.bilibili.com/video/av1213252/")
    .attr("target","_blank");

  videowrap
    .append("span")
    .attr("class","thumb")
    .append("img")
    .attr("src","./img/item7.jpg")
    .attr("width","120px")
    .attr("height","68px")
    .style("margin-left","10px");


  videowrap.append("div")
    .attr("class","title")
    .text("荷塘月色")
    .append("div")
    .attr("class","info")
    .text("音乐 4:50");


     var videowrap2 = videoList.append("li").attr("class","video-list-item").append("a")
    .attr("href","http://www.bilibili.com/video/av1213252/")
    .attr("target","_blank");

  videowrap2
    .append("span")
    .attr("class","thumb")
    .append("img")
    .attr("src","./img/item0.jpg")
    .attr("width","120px")
    .attr("height","68px")
    .style("margin-left","10px");


  videowrap2.append("div")
    .attr("class","title")
    .text("可念不可说")
    .append("div")
    .attr("class","info")
    .text("音乐 4:50");

  var videowrap3 = videoList.append("li").attr("class","video-list-item").append("a")
    .attr("href","http://www.bilibili.com/video/av1213252/")
    .attr("target","_blank");

  videowrap3
    .append("span")
    .attr("class","thumb")
    .append("img")
    .attr("src","./img/item11.jpg")
    .attr("width","120px")
    .attr("height","68px")
    .style("margin-left","10px");


  videowrap3.append("div")
    .attr("class","title")
    .text("君临天下")
    .append("div")
    .attr("class","info")
    .text("音乐 3:20");

   var divweibo = d3.select("body").append("div")
    .attr("class", "weibo-panel")               
    .style("opacity", 0);  

   divweibo.append("h5")
            .text("相关微博")
            .style("margin","15px");    

   var weiboList = divweibo.append("ul");
    

   var weibowrap = weiboList.append("li")
   .attr("class","video-list-item")
   .style("margin-left","15px");

   weibowrap.append("div")
   .attr("class","listDot");

   
   weibowrap.append("a")
    .attr("href","http://www.bilibili.com/video/av1213252/")
    .attr("target","_blank")
    .style("margin-left","15px")
    .style("margin-top","-12px")
    .text("失眠了，有没有催眠用的音乐或视频？");   

    var weibowrap2 = weiboList.append("li")
   .attr("class","video-list-item")
   .style("margin-left","15px");

   weibowrap2.append("div")
   .attr("class","listDot");

   
   weibowrap2.append("a")
    .attr("href","http://www.bilibili.com/video/av1213252/")
    .attr("target","_blank")
    .style("margin-left","15px")
    .style("margin-top","-12px")
    .text("喜欢这种古风的音乐");   



 function hoverBubble(d,i) {
 
     var t1 = main.transition()
     			 .ease("elastic")
     			 .duration("1000");

   t1.selectAll(".topCircle")
    .attr("r", function(d, ii) { 
                    if(i == ii)
                        return oR*1.3;
                    else
                        return oR;
                    });
             
 }

  /*function hoverWeiboBubble(d,i) {
 
     var t1 = main.transition()
           .ease("elastic")
           .duration("1000");

   t1.selectAll(".weibotopCircle")
    .attr("r", function(d, ii) { 
                    if(i == ii)
                        return 20;
                    else
                        return 14;
                    });
             
 }*/


 function activateBubble(d,i) {
 	 var t0 = main.transition()
                .duration(300);
 	var t1 = main.transition()
                .duration(1000);
    var t2 = main.transition()
                .duration(100);
    var t3 = main.transition()
                .duration(800);

     
            t0.selectAll(".topCircle")
             .style("fill", function(d, ii) { 
                    if(i == ii)
                        return "#71CAEE";
                    else
                        return "#95D7F2";
                    });

            t0.selectAll(".topBubble")
    		.ease("sin")
            .attr("transform", function(d) { return "rotate(" + (d.x - 90) + ")translate(" + (d.y-74) + ")"; });


             t0.selectAll(".weibotopBubble")
    		.ease("elastic")
            .attr("transform", function(d) { return "rotate(" + (d.x - 90) + ")translate(" + (d.y-110) + ")"; });

              t0.selectAll(".weibotopCircle")
             .attr("r", function(d, ii) { 
                    
                        return 14;
                    
                    });

            t0.selectAll(".topBubbleText")
             .attr("transform", function(d, ii) { 
             	if(i == ii){
             		
             		return d.x < 180 ? "translate(40)" : "rotate(180)translate(-40)"; 
             	}
             	else
             		return d.x < 180 ? "translate(25)" : "rotate(180)translate(-25)"; 
             });


            for(var k = 0; k < nTop; k++) 
            {
                
                t2.selectAll(".childCircle" + k)
                    .attr("r", function(d){
                            return (k==i)? (d.size*22): 0; 
                    })

               t1.selectAll(".childNode" + k)
					.ease("elastic")
					.delay(200)
                    .attr("transform", function(d) { 
                    	if(k==i) {

                    		return "rotate(" + (d.x - 90) + ")translate(" + (d.y-160)+ ")";
                    	}
                    		
                    	else
                    		return "rotate(" + (d.x - 90) + ")translate(" + (d.y-180)+ ")";

                    })
                    .style("opacity", function(d) { 
                    	if(k==i)
                    		return 1;
                    	else
                    		return 0; 


                      });
                    
                    
            }

            div .transition()        
                .duration(400)      
                .style("opacity", 1)    
                .style("right", "10px");    
            
          
           



 }

 function activateWeiboBubble(d,i) {

            divweibo .transition()        
                .duration(400)      
                .style("opacity", 1)    
                .style("right", "10px");  

 }

   resetBubbles = function () {

   	 var t0 = main.transition()
                .duration(300);
 	var t1 = main.transition()
                .duration(1000);
    var t2 = main.transition()
                .duration(100);
    var t3 = main.transition()
                .duration(800);

     t0.selectAll(".topCircle")
             .style("fill", "#95D7F2");
                   

            t0.selectAll(".topBubble")
    		.ease("sin")
            .attr("transform", function(d) { return "rotate(" + (d.x - 90) + ")translate(" + (d.y) + ")"; });


             t0.selectAll(".weibotopBubble")
    		.ease("sin")
            .attr("transform", function(d) { return "rotate(" + (d.x - 90) + ")translate(" + (d.y-50) + ")"; });

              t0.selectAll(".weibotopCircle")
             .attr("r", 20);

     for(var k = 0; k < nTop; k++) 
        {
           t0.selectAll(".childNode" + k)
           .ease("elastic")
      		.attr("transform", function(d) { return "rotate(" + (d.x - 90) +  ")translate(" + (d.y-180)+ ")";  })    		
      		.style("opacity", 0);
                           
        }          


          

  	       

  }

 /* window.onclick = resetBubbles;*/


d3.select(self.frameElement).style("height", radius * 2 + "px");

