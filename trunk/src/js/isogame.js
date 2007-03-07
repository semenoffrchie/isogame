/*  ISOGAME
	Isometric Game Engine for Javascript & HTML
	Released under GNU GPL License 
	by Francisco Javier Nieto <frjanibo@gmail.com> 2006 

	PLEASE SEND ME A MAIL ME IF YOU USE THIS!!! ;)

	Note: //{{{ and //}}} are my fold methods for vim ;)
*/

// Useful methods for array
Array.prototype.$=function( id ){for(var f=0; f<this.length; f++){if( this[f].id == id) return this[f];}return false;};
Array.prototype._=function( id ){for(var f=0; f<this.length; f++) if( this[f].id == id) this.splice(f,1)};

var isogame={
"config":{ //{{{
	"mie":(navigator.appName.indexOf("Explorer")>=0),
	"moz":(navigator.appName.indexOf("Netscape")>=0),
	"origen_x":500,
	"origen_y":150,
	"tile_w":72,
	"tile_h":36
	}, //}}}

//Classes
"Cube":function( id, x, y, z, dim_x, dim_y, dim_z ){ //{{{
	var self=this;
	this.id=id;
	this.x = x;
	this.y = y;
	this.z = z;
	this.dim_x = dim_x;
	this.dim_y = dim_y;
	this.dim_z = dim_z;
	this.collides = function( cube ) { //{{{
		var centro_x1 = cube.x + (cube.dim_x/2);
		var centro_y1 = cube.y + (cube.dim_y/2);
		var centro_z1 = cube.z + (cube.dim_z/2);
		var centro_x2 = this.x + (this.dim_x/2);
		var centro_y2 = this.y + (this.dim_y/2);
		var centro_z2 = this.z + (this.dim_z/2);

		var delta_x = Math.abs( centro_x1 - centro_x2 );
		var delta_y = Math.abs( centro_y1 - centro_y2 );
		var delta_z = Math.abs( centro_z1 - centro_z2 );

		var sum_x = (cube.dim_x/2) + (this.dim_x/2);
		var sum_y = (cube.dim_y/2) + (this.dim_y/2);
		var sum_z = (cube.dim_z/2) + (this.dim_z/2);
	  
		if( (delta_x <= sum_x) && (delta_y <= sum_y) && (delta_z <= sum_z) ) return true;
		else return false;
	} //}}}

}, //}}}
"Sprite":function( id, orientation ){ //{{{
	//{{{ Constructor
	var self = this;
	this.id = id;
	this.o = orientation;
	this.x = 0;
	this.y = 0;
	this.z = 0;
	this.dim_x=1;
	this.dim_y=1;
	this.dim_z=1;
	this.src = new Array();
	this.src['n'] = "";
	this.src['s'] = "";
	this.src['w'] = "";
	this.src['e'] = "";
	this.offset = new Array();
	this.offset['s'] = new Array(0,0);
	this.offset['w'] = new Array(0,0);
	this.offset['n'] = new Array(0,0);
	this.offset['e'] = new Array(0,0);
	this.img = document.createElement("img");
	this._drawn = false;
	//}}}
	this.colision=function( x, y ){ //{{{
		x = parseInt(x);
		y = parseInt(y);
		if(( x >= this.x ) && ( x <= (this.x+this.dim_x) ) && ( y >= this.y ) && ( y <= (this.y+this.dim_y) )) {
			return true;
		}
		else 
			return false;
	} //}}}
	this.getCube=function(){ //{{{
		return new isogame.Cube( this.id, this.x, this.y, this.z, this.dim_x, this.dim_y, this.dim_z );
	} //}}}
	this.setCube=function(cube){ //{{{
		this.x = cube.x;
		this.y = cube.y;
		this.z = cube.z;
	} //}}}
	this.setXYZ=function( x,y,z ){ //{{{
		if(x!=undefined) this.x = parseInt(x);
		if(y!=undefined) this.y = parseInt(y);
		if(z!=undefined) this.z = parseInt(z);
	}; //}}}
	this.setDimensions=function( x, y, z ){ //{{{
		this.dim_x = parseInt(x);
		this.dim_y = parseInt(y);
		this.dim_z = parseInt(z);
	} //}}}
	this.getScreenPosition=function(){ //{{{
		var x = this.x;
		var y = this.y;
		//var x_screen = (y*(isogame.config.tile_w/2) - x*(isogame.config.tile_w/2)) + isogame.config.origen_x;
		//var y_screen = (y*(isogame.config.tile_h/2) + x*(isogame.config.tile_h/2)) + isogame.config.origen_y - parseInt(this.z);
		var x_screen = (y*2)-(x*2) + isogame.config.origen_x;
		var y_screen = y+x+isogame.config.origen_y-parseInt(this.z);
		return new Array(x_screen, y_screen);
	}; //}}}
	this.setOffset=function( o, offset ){ //{{{
		this.offset[o] = new Array( parseInt(offset[0]), parseInt(offset[1]) );
	}; //}}}
	this.draw = function( where ){ //{{{
		this.img.id = this.id;
		if(!isogame.config.mie){
			if(this.img.getAttribute("src") == null) this.img.setAttribute("src", this.src[ this.o ]);
			if(this.img.src.indexOf(this.src[this.o]) == -1) this.img.src= this.src[this.o];
		}
		
		if(isogame.config.mie) {
			if(this.img.src=="") this.img.src=this.src[ this.o ];
			if(this.img.src.indexOf(this.src[this.o]) == -1) this.img.src= this.src[this.o];
		}
		
		this.img.style.position = "absolute";
		var position = this.getScreenPosition();
		this.img.style.left= position[0] + this.offset[this.o.charAt(0)][0];
		this.img.style.top = position[1] + this.offset[this.o.charAt(0)][1];
		
		if(!this._drawn)	{
			document.getElementById(where).appendChild(this.img);
			this._drawn = true;
		}
	}; //}}}
	this.erase = function(){ //{{{
		if(this._drawn) {
			if(this.img.parentNode)	this.img.parentNode.removeChild( this.img );
			this._drawn = false;
		}
	}; //}}}
	this.update = function(){ //{{{
		var position = this.getScreenPosition();
		this.img.style.left= position[0] + this.offset[this.o.charAt(0)][0];
		this.img.style.top = position[1] + this.offset[this.o.charAt(0)][1] - this.dim_z;
		this.img.style.zIndex = this.z_calc();
	}; //}}}
	this.z_calc = function(){ //{{{
		var x = parseInt( this.x );
		var y = parseInt( this.y );
		var z = parseInt( this.z );
		var inc_tamanio = (this.dim_x>this.dim_y)?this.dim_x:this.dim_y;
		var z_index = (y+x)*z+inc_tamanio;

		var pos = this.getScreenPosition();
		//var z_index = x+y+z;
		if((parseInt(y)==-1) || (parseInt(x)==-1)) var z_index = 2;
		return (z_index>0)?z_index:0;
	} //}}}
	this.notify = function( ev ){ //{{{
		this.x = ev.originalEvent.coords[0];
		this.y = ev.originalEvent.coords[1];
	}; //}}}
} //}}}
,"Tile":function( id, img, x, y ){ //{{{
	isogame.Sprite.apply(this,new Array(id, "s" ));
	this.src['s'] = "img/suelo.gif";
	this.offset['s'] = new Array(0,0);
	this.setXYZ( x, y );
	this.draw = function( where ){ //{{{
		this.img.id = this.id;
		if(isogame.config.mie) {
			if(this.img.src != this.src[this.o]) this.img.src = this.src[this.o];
		} else
			if(this.img.getAttribute("src") == null) this.img.setAttribute("src", this.src[ this.o ]);
		
		this.img.style.position = "absolute";
		var position = this.getScreenPosition();
		this.img.style.left= position[0] + this.offset[this.o][0];
		this.img.style.top = position[1] + this.offset[this.o][1];
		
		this.img.style.zIndex = this.z_calc();
		if( !this._drawn )	{
			document.getElementById(where).appendChild(this.img);
			this._drawn = true;
		}
	}; //}}}
} //}}}
,"Group":function(){ //{{{
	var self=this;
	this.elements = new Array();
	this.length = 0;
	this.$=function( id ){ //{{{
		return this.elements.$( id );
	} //}}}
	this.add=function( sprite ){ //{{{
		if( !this.elements.$( sprite.id ) )
			this.elements.push( sprite );
		this.length = this.elements.length;
	} //}}}
	this.remove=function( sprite ){ //{{{
		this.elements._( sprite.id );
		this.length = this.elements.length;
	} //}}}
	this.item=function( key ){ //{{{
		return this.elements[key];
	} //}}}
	this.update=function(){ //{{{
		for(var f=0; f<this.elements.length; f++) this.elements[f].update();
	} //}}}
	this.draw=function(where){ //{{{
		for(var f=0; f<this.elements.length; f++) this.elements[f].draw( where );
	} //}}}
	this.colision=function( groupOrSprite ){ //{{{
		if( groupOrSprite instanceof isogame.Sprite ) return this.spriteColision( groupOrSprite );
		if( groupOrSprite instanceof isogame.Group ) return this.groupColision( groupOrSprite );
	} //}}}
	this.spriteColision=function( sprite ){ //{{{
		var colisions = new Array();
		for(var f=0; f<this.elements.length; f++){
			if( sprite.colision( this.elements[f].x, this.elements[f].y ) )
				colisions.push( this.elements[f] );
		}
		return colisions;
	} //}}}
	this.GroupColision=function( group ){ //{{{
		var colisions = new Array();
		for(var f=0; f<this.elements.length; f++){
			if( group.colision( this.elements[f].x, this.elements[f].y ) )
				colisions.push( this.elements[f] );
		}
		return colisions;
	} //}}}
	this.notify = function( ev ){ //{{{
	}; //}}}
} //}}}
,"Scene":function(){ //{{{
	var self = this;
	self.player = null;
	self.avatars= new isogame.Group();
	self.objects= new isogame.Group();
	self.tiles =  new isogame.Group();

	this.draw=function( where ){ //{{{
		self.tiles.draw( where );
		self.objects.draw( where );
		for(var f=0; f< self.avatars.length; f++) self.avatars[f].draw( where );
	} //}}}
	this.addTile=function( tile ){ //{{{
		self.tiles.add(tile);
	} //}}}
	this.addObject=function( sprite ){ //{{{
		self.objects.add( sprite );
	} //}}}
	this.addAvatar=function( avatar ){ //{{{
		if( !this.avatars.$( avatar.id )) this.avatars.push( avatar );
	} //}}}
	this.addWall = function( wall ){ //{{{
		this.walls.push( wall );
	} //}}}
	this.whatsIn=function( x, y ){ //{{{
		var ret = Array();
		for(var f=0; f< self.tiles.length; f++){
			var obj = self.tiles.item(f);
			//if( (obj.x==x) && (obj.y==y) ) ret.push( obj );
			if( (obj.x <= x) && (obj.x+obj.dim_x > x) && (obj.y <= y) && (obj.y+obj.dim_y > y ) )	ret.push( obj )
		}
		if( ret.length == 0 ){
			throw "isogame.Scene.whatsIn: invalid coordinates";
			return ret;
		}

		for(var f=0; f< self.objects.length; f++){
			var obj = self.objects.item(f);
			if( obj.colision(x,y) ) ret.push( obj );
		}
		
		var seguir=true;
		while(seguir){
			seguir=false;
			for(var f=0; f< obj.length; f++){
				if(obj[f].z > obj[f+1].z) {
					var o1 = obj[f];
					obj[f] = obj[f+1];
					obj[f+1] = o1;
					//intercambio
					seguir=true;
				}
				
			}
		}

		return ret;
	} //}}}
	this.whatsInCube=function( cube ){ //{{{
		var ret = Array();
		for(var f=0; f< self.tiles.length; f++){
			var tile = self.tiles.item(f);
			if( cube.collides( tile.getCube() ) ) ret.push( tile );
		}

		for(var f=0; f< self.objects.length; f++){
			var obj = self.objects.item(f);
			if( (cube.collides( obj.getCube() )) && (cube.id!=obj.id) ) ret.push( obj );
		}
		
		var seguir=true;
		while(seguir){
			seguir=false;
			for(var f=0; f< (ret.length-1); f++){
				if(ret[f].z > ret[f+1].z) {
					var o1 = ret[f];
					ret[f] = ret[f+1];
					ret[f+1] = o1;
					//intercambio
					seguir=true;
				}
				
			}
		}

		return ret;
	} //}}}
	this.getDimensions=function(){ //{{{
		var dim_x=0;
		var dim_y=0;
		for(var f=0; f< this.tiles.length; f++){
			var tile = this.tiles.item(f);
			if( tile.x > dim_x) dim_x=tile.x;
			if( tile.y > dim_y) dim_y=tile.y;
		}
		return Array(dim_x, dim_y);
	}; //}}}
	this.notify = function( ev ){ //{{{
	}; //}}}
} //}}}

// Events
,"EventManager": new function(){ //{{{
	this.listeners = new Array();
	this.events = new Array();

	this.register=function( ob ){ //{{{
		if( ! this.listeners.$( ob.id ) ) this.listeners[this.listeners.length]=ob;
	} //}}}
	this.unregister=function( ob ){ //{{{
		this.listeners._( ob.id );
	} //}}}
	this.post=function( ev ){ //{{{
		if( ev.type == "mousemove" ) 
			this.mouse_event = ev;
		else
			this.events.push( ev );
	} //}}}
	this.process=function(){ //{{{
		while( this.events.length > 0 ){
			var e = this.events.shift();
			for(var i=0; i< this.listeners.length; i++)	this.listeners[i].notify( e );
		}
		if( this.mouse_event ) {
			for(var i=0; i< this.listeners.length; i++)	
				this.listeners[i].notify( this.mouse_event );
			this.mouse_event = false;
			}

	} //}}}
} //}}}
,"Event":function( type, event ){ //{{{
	this.type = type;
	this.originalEvent = event;
} //}}}

// Functions
,"mainloop":function ( func, delay ){ //{{{
	if( typeof func != "function" ) {
		throw "ISOGAME error: You must call isogame.mainloop with a function as first argument.";
		return false;
	}
	window.onmousemove=isogame.MouseController;
	if(isogame.config.mie)
		document.onkeydown=isogame.KeyboardController;
	else {
		window.onkeydown=isogame.KeyboardController;
		window.onkeyup=isogame.KeyboardController;
	}
	if(delay == undefined) delay = 250;
	return setInterval( func, delay );
} //}}}
,"MouseController":function(event){ //{{{
	
	if(isogame.config.moz)	
		var coords = new Array( event.pageX, event.pageY );
	else 
		var coords = new Array( event.clientX, event.clientY );

	event.coords = coords;
	var e= new isogame.Event( "mousemove", event );
	isogame.EventManager.post( e );
} //}}}
,"KeyboardController":function(ev){ //{{{
	var key = undefined;
	if(isogame.config.mie) {
		var ev = window.event;
		key = window.event.keyCode;
	} else key = ev.which;
	
	var keychar = String.fromCharCode( key );
	if(key==37) keychar = "LEFT";
	if(key==38) keychar = "UP";
	if(key==39) keychar = "RIGHT";
	if(key==40) keychar = "DOWN";
	ev.key = key;
	ev.keychar = keychar;
	var e= new isogame.Event( ev.type, ev );
	isogame.EventManager.post( e );

	if(( key > 36) && (key < 41) )return false;
} //}}}
,"RayCast":function(scene,x,y){ //{{{
	var dimensions = scene.getDimensions();
	var a = dimensions[1] - y;
	var b = dimensions[0] - x;
	var c = Math.sqrt( Math.pow(a,2) + Math.pow(b,2) );
	var alfa = Math.atan2( a, b ); //*180/Math.PI;
	alert("a: "+a+" b:"+b);
	alert("Hipotenusa:"+c);
	//alert("Seno de alfa: "+(a/c));
	//alert("Coseno alfa: "+(b/c));
	//alert("Seno de alfa: "+Math.cos(alfa) );
	//alert("Coseno alfa: "+ Math.sin(alfa) );
	// y = mx+b
	var x1 = dimensions[0];
	var x2 = x;
	var y1 = dimensions[1];
	var y2 = y;
	var m = Math.tan( alfa );
	var n = ((y1*x2) - (y2*x1)) / (x2-x1);

	var last_x = null;
	var last_y = null;
	for( var x = dimensions[0]; x > x2; x-=0.2 ){
		var y = m*x+n;
		if(( x == last_x) && (y==last_y)) continue;
		last_x = x;
		last_y = y;
		
		var tile = new isogame.Tile( x+","+y, "", x,y);
		tile.z = 10;
		tile.dim_x = 1;
		tile.dim_y = 1;
		scene.addTile( tile );
		tile.draw("screen");
		//alert("x="+x+" y="+y);
	}
	return;




	// Tenemos la distancia en el eje z=0;
	var alfa = Math.atan( 0.5 );


	var hipotenusa = distancia / Math.cos( alfa );
	var b = Math.sin( alfa ) * hipotenusa;

	var x1 = x;
	var x2 = dimensions[0];
	var y1 = y;
	var y2 = dimensions[1];
	var z1 = 0;
	var z2 = b;
	var m1 = Math.abs( (y2-y1)/(x2-x1) );
	if((y1==0)||(x1==0))
		var n1=0;
	else
		var n1 = ((y1*x2) - (y2*x1)) / (x2-x1);
	
	var m2 = 1;

	var x = x2;
	var y = y2;
	var z = z1;
	var cadena = "n="+n1+"\n";
	cadena += "m1="+m1+"\n";
	cadena += "m2="+m2+"\n";

	while( (x>=x1) && (y>=y1) ){
	
	}


	for( ; x >= x1; x-=1){
		y = m1*x + n1;
		var z = (y*x)*m2;
		echo("x="+x+" y="+y+" z="+z);
		var tile = new isogame.Tile( x+","+y, "", x,y);
		tile.z = 10;
		tile.dim_x = 1;
		tile.dim_y = 1;
		scene.addTile( tile );
		tile.draw("screen");
		cadena += "x="+x+" y="+y+" z="+z+"\n";
	}	
	alert(cadena);

} //}}}
,"get3DfromScreen":function( x, y ){ //{{{
	x-= isogame.config.origen_x;
	y-= isogame.config.origen_y;
	var w = isogame.config.tile_w;
	var h = isogame.config.tile_h;

	var x_3d = Math.round( ((w*y) - (h*x)) / (w*h) );
	var y_3d = Math.round( ((w*y) + (h*x)) / (w*h) )-1;

	var x_3d = Math.round( ((w*y) - (h*x)) / (w*h)*18 );
	var y_3d = Math.round( ((w*y) + (h*x)) / (w*h)*18 )-1;

	//var x_3d = Math.round( y+x/(w*h) );
	//var y_3d = Math.round( (x/32) - );
	return new Array(x_3d,y_3d);
} //}}}
,"getScreenfrom3D":function ( x,y ){ //{{{
	var w = isogame.config.tile_w;
	var h = isogame.config.tile_h;

	var x_screen = (x*Math.round(w/2) - y*Math.round(w/2)) + isogame.config.origen_x;
	var y_screen = (x*Math.round(h/2) + y*Math.round(h/2)) + isogame.config.origen_y;
	return new Array(x_screen, y_screen);
} //}}}
};

function echo( str ){ //{{{
	document.getElementById("output").value += str +"\n";
	document.getElementById("output").scrollTop = document.getElementById("output").scrollHeight;
} //}}}
