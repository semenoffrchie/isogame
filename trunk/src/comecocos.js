var count=0;
var ccocos = {
"scene":new isogame.Scene(),
"drawScene":function(){ //{{{
	// Draw a 10x10 lattice
	for(var x=0; x< 180; x+=18)
		for(var y=0; y< 180; y+=18) {
			var tile = new isogame.Tile( x+","+y, "", x,y);
			tile.setDimensions(18,18,0);
			ccocos.scene.addTile( tile );
		}
	var map = Array();
	for( f=1; f<= 163; f+=18) map.push( Array(1,f) );
	for( f=1; f<= 163; f+=18) map.push( Array(163,f) );
	for( f=1; f<= 163; f+=18) map.push( Array(f,163) );
	for( f=1; f<= 163; f+=18) map.push( Array(f,1) );
	map.push( Array(55,55) );
	map.push( Array(55,55) );
	map.push( Array(73,73) );
	map.push( Array(91,91) );
	map.push( Array(109,109) );
/*	var map = Array(
			Array(1,1),Array(1,19),Array(1,37),Array(1,55),Array(1,73),Array(1,91),Array(1,109),Array(1,127),Array(1,145),Array(1,163),
			Array(163,163),Array(145,163),Array(127,163),Array(109,163),Array(163,163),
			Array(19,1),Array(37,1)
	);
*/
	for(var f=0; f< map.length; f++) {
		var tile = new isogame.Tile( map[f][0]+"_"+map[f][1], "", map[f][0], map[f][1] );
		tile.src['w'] = "img/suelo2.gif";
		tile.setDimensions(17,17,10);
		tile.setXYZ( map[f][0], map[f][1], 1 ); 
		tile.setOffset( "w", Array(0,-10) );
		ccocos.scene.addTile( tile );
	}
		var tile = new isogame.Tile( "test", "", 73, 73 );
		tile.src['w'] = "img/suelo2.gif";
		tile.setDimensions(17,17,10);
		tile.setXYZ( 55,55, 11 ); 
		tile.setOffset( "w", Array(0,-10) );
		ccocos.scene.addTile( tile );

},//}}}
"createPJ":function(){ //{{{
	ccocos.pj = new isogame.Sprite("comecocos"+(count++), "w");
	ccocos.pj.src['w'] = "img/pj.gif";
	ccocos.pj.notify = pj_notify;
	ccocos.pj.setDimensions( 17,17, 10);
	ccocos.pj.setXYZ(19,19,1);
	ccocos.pj.setOffset( "w", Array(0,0) );
	ccocos.scene.addObject( ccocos.pj );
	ccocos.pj.draw("screen");
	ccocos.pj.img.style.border="0px solid black";


}, //}}}
"mainloop":function(){
	var speed = 2;
	isogame.EventManager.process();
	
	if(ccocos.pj.movingkey!=""){
		var nextCube = ccocos.pj.getCube();
		if(ccocos.pj.movingkey=="UP")    nextCube.x-=speed;
		if(ccocos.pj.movingkey=="DOWN")  nextCube.x+=speed;
		if(ccocos.pj.movingkey=="LEFT")  nextCube.y-=speed;
		if(ccocos.pj.movingkey=="RIGHT") nextCube.y+=speed;
		
		var obs=ccocos.scene.whatsInCube(nextCube);
		if(( obs.length == 0 ) && (nextCube.x > 0) && (nextCube.y > 0)) ccocos.pj.setCube( nextCube );
/*
	var nextCube = ccocos.pj.getCube();
	nextCube.z--;
	var obs=ccocos.scene.whatsInCube(nextCube);
	if( obs.length == 0 ) ccocos.pj.setCube( nextCube );
*/
	}
	ccocos.pj.update();

	document.getElementById("pj_x").value = ccocos.pj.x;
	document.getElementById("pj_y").value = ccocos.pj.y;
	document.getElementById("pj_z").value = ccocos.pj.z;
	document.getElementById("pj_zcalc").value = ccocos.pj.z_calc();

}

};

window.onload=function(){
	document.getElementById("output").value="";
	ccocos.drawScene();
	ccocos.createPJ();
	ccocos.scene.draw("screen");
	isogame.EventManager.register( ccocos.pj );
	isogame.mainloop( ccocos.mainloop, 50 );
};

function pj_notify(ev){
	if(ev.type == "keydown") ccocos.pj.movingkey = ev.originalEvent.keychar;
	if(ev.type == "keyup") ccocos.pj.movingkey = "";
}
