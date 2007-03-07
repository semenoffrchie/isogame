var count=0;
var ccocos = {
"scene":new isogame.Scene(),
"drawScene":function(){ //{{{
	// Draw a 10x10 lattice
	for(var x=0; x< 180; x+=18)
		for(var y=0; y< 180; y+=18) {
			var tile = new isogame.Tile( x+","+y, "", x,y);
			tile.z = 0;
			tile.dim_x=18;
			tile.dim_y=18;
			ccocos.scene.addTile( tile );
		}
	var map = Array(
			Array(10,1)
	);
	for(var f=0; f< map.length; f++) {
		var tile = new isogame.Tile( map[f][0]+"_"+map[f][1], "", map[f][0], map[f][1] );
		tile.src['s'] = "img/cubo.gif";
		tile.dim_z=30;
		tile.dim_x=13;
		tile.dim_y=13;
		tile.setXYZ( map[f][0], map[f][1], 2 ); 
		ccocos.scene.addTile( tile );
	}

},//}}}
"createPJ":function(){ //{{{
	ccocos.pj = new isogame.Sprite("comecocos"+(count++), "w");
	ccocos.pj.src['w'] = "img/cobayo_right.gif";
	ccocos.pj.dim_z = 10;
	ccocos.pj.dim_y = 12;
	ccocos.pj.dim_x = 12;
	ccocos.pj.notify = pj_notify;
	ccocos.pj.setXYZ(100,100,2);
	ccocos.pj.setOffset( "w", Array(17,5) );
	ccocos.scene.addObject( ccocos.pj );
	ccocos.pj.draw("screen");
	ccocos.pj.img.style.border="1px solid black";


}, //}}}
"mainloop":function(){
	var speed = 3;
	isogame.EventManager.process();
	
	if(ccocos.pj.movingkey!=""){
		var nextCube = ccocos.pj.getCube();
		if(ccocos.pj.movingkey=="UP")    nextCube.x-=speed;
		if(ccocos.pj.movingkey=="DOWN")  nextCube.x+=speed;
		if(ccocos.pj.movingkey=="LEFT")  nextCube.y-=speed;
		if(ccocos.pj.movingkey=="RIGHT") nextCube.y+=speed;
		var obs=ccocos.scene.whatsInCube(nextCube);
		if( obs.length == 0 ) ccocos.pj.setCube( nextCube );

	var nextCube = ccocos.pj.getCube();
	nextCube.z--;
	var obs=ccocos.scene.whatsInCube(nextCube);
	if( obs.length == 0 ) ccocos.pj.setCube( nextCube );
	}
	ccocos.pj.update();
	document.getElementById("pj_x").value = ccocos.pj.x;
	document.getElementById("pj_y").value = ccocos.pj.y;
	document.getElementById("pj_z").value = ccocos.pj.z;
}

};

window.onload=function(){
	document.getElementById("output").value="";
	ccocos.drawScene();
	ccocos.createPJ();
	ccocos.scene.draw("screen");
	isogame.EventManager.register( ccocos.pj );
	isogame.mainloop( ccocos.mainloop, 200 );
};

function pj_notify(ev){
	if(ev.type == "keydown") ccocos.pj.movingkey = ev.originalEvent.keychar;
	if(ev.type == "keyup") ccocos.pj.movingkey = "";
}
