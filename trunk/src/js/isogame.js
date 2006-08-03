/*  ISOGAME
	Isometric Game Engine for Javascript & HTML
	Released under GNU GPL License 
	by Francisco Javier Nieto <frjanibo@gmail.com> 2006 

	PLEASE SEND ME A MAIL ME IF YOU USE THIS!!! ;)
*/

const moz =(navigator.appName.indexOf("Netscape")>=0) 
const mie =(navigator.appName.indexOf("Explorer")>=0) 

const ISO_constants = {
	"origen_x":500,
	"origen_y":150,
	"tile_w":72,
	"tile_h":36
	};

// Useful methods for array
Array.prototype.$=function( id ){for(var f=0; f<this.length; f++){if( this[f].id == id) return this[f];}return false;};
Array.prototype._=function( id ){for(var f=0; f<this.length; f++)if( this[f].id == id) this.splice(f,1);};

var ISO_Sprite=function( id, orientation ){ //<<<
	var self = this;
	this.id = id;
	this.o = orientation;
	this.x = 0;
	this.y = 0;
	this.z = 0;
	this.dim_x=0;
	this.dim_y=0;
	this.dim_z=0;
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
	
	this.colision=function( x, y ){ //<<<
		x = parseInt(x);
		y = parseInt(y);
		if(( x >= this.x ) && ( x <= (this.x+(this.dim_x-1)) ) && ( y >= this.y ) && ( y <= (this.y+(this.dim_y-1)) ))
			return true;
		else 
			return false;
	} //>>>
	this.setXYZ=function( x,y,z ){ //<<<
		if(x!=undefined) this.x = parseInt(x);
		if(y!=undefined) this.y = parseInt(y);
		if(z!=undefined) this.z = parseInt(z);
	}; //>>>
	this.setDimensions=function( x, y, z ){ //<<<
		this.dim_x = parseInt(x);
		this.dim_y = parseInt(y);
		this.dim_z = parseInt(z);
	} //>>>
	this.getScreenPosition=function(){ //<<<
		var x = this.x;
		var y = this.y;
		var x_screen = (y*(ISO_constants.tile_w/2) - x*(ISO_constants.tile_w/2)) + ISO_constants.origen_x;
		var y_screen = (y*(ISO_constants.tile_h/2) + x*(ISO_constants.tile_h/2)) + ISO_constants.origen_y - parseInt(this.z);
		return new Array(x_screen, y_screen);
	}; //>>>
	this.setOffset=function( o, offset ){ //<<<
		this.offset[o] = new Array( parseInt(offset[0]), parseInt(offset[1]) );
	}; //>>>
	this.draw = function( where ){ //<<<
		this.img.id = this.id;
		if(!mie){
			if(this.img.getAttribute("src") == null) this.img.setAttribute("src", this.src[ this.o ]);
			if(this.img.src.indexOf(this.src[this.o]) == -1) this.img.src= this.src[this.o];
		}
		
		if(mie) {
			if(this.img.src=="") this.img.src=this.src[ this.o ];
			if(this.img.src.indexOf(this.src[this.o]) == -1) this.img.src= this.src[this.o];
		}
		
		this.img.style.position = "absolute";
		var position = this.getScreenPosition();
		this.img.style.left= position[0] + this.offset[this.o.charAt(0)][0];
		this.img.style.top = position[1] + this.offset[this.o.charAt(0)][1];

		//Calculo de profundidad (z)
		var x = parseInt( this.x );
		var y = parseInt( this.y );
		var z = parseInt( this.z );
		var inc_tamanio = (this.dim_x>this.dim_y)?this.dim_x:this.dim_y;
		var z_index = y+x+inc_tamanio;
		if((parseInt(y)==-1) || (parseInt(x)==-1)) var z_index = 2;
		this.img.style.zIndex = (z_index>0)?z_index:0;
		
		if(!this._drawn)	{
			document.getElementById(where).appendChild(this.img);
			this._drawn = true;
		}
	}; //>>>
	this.erase = function(){ //<<<
		if(this._drawn) {
			if(this.img.parentNode)	this.img.parentNode.removeChild( this.img );
			this._drawn = false;
		}
	}; //>>>
	this.update = function(){ //<<<
		var position = this.getScreenPosition();
		this.img.style.left= position[0] + this.offset[this.o.charAt(0)][0];
		this.img.style.top = position[1] + this.offset[this.o.charAt(0)][1];
	}; //>>>
} //>>>
var ISO_Tile=function( id, img, x, y ){ //<<<
	ISO_Sprite.apply(this,new Array(id, "s" ));
	this.src['s'] = "img/suelo.gif";
	this.offset['s'] = new Array(0,0);
	this.setXYZ( x, y );
	this.draw = function( where ){ //<<<
		this.img.id = this.id;
		if(mie) {
			if(this.img.src != this.src[this.o]) this.img.src = this.src[this.o];
		} else
			if(this.img.getAttribute("src") == null) this.img.setAttribute("src", this.src[ this.o ]);
		
		this.img.style.position = "absolute";
		var position = this.getScreenPosition();
		this.img.style.left= position[0] + this.offset[this.o][0];
		this.img.style.top = position[1] + this.offset[this.o][1];
		this.img.style.zIndex = 0;
		if( !this._drawn )	{
			document.getElementById(where).appendChild(this.img);
			this._drawn = true;
		}
	}; //>>>
} //>>>
var ISO_Group=function(){ //<<<
	this.elements = new Array();
	this.$=function( id ){ //<<<
		return this.elements.$( id );
	} //>>>
	this.add=function( sprite ){ //<<<
		if( !this.elements.$( sprite.id ) )
			this.elements.push( sprite );
	} //>>>
	this.remove=function( sprite ){ //<<<
		this.elements._( sprite.id );
	} //>>>
	this.update=function(){ //<<<
		for(var f=0; f<this.elements.length; f++) this.elements[f].update();
	} //>>>
	this.draw=function(where){ //<<<
		for(var f=0; f<this.elements.length; f++) this.elements[f].draw( where );
	} //>>>
	this.colision=function( groupOrSprite ){ //<<<
		if( groupOrSprite instanceof ISO_Sprite ) return this.spriteColision( groupOrSprite );
		if( groupOrSprite instanceof ISO_Group ) return this.groupColision( groupOrSprite );
	} //>>>
	this.spriteColision=function( sprite ){ //<<<
		var colisions = new Array();
		for(var f=0; f<this.elements.length; f++){
			if( sprite.colision( this.elements[f].x, this.elements[f].y ) )
				colisions.push( this.elements[f] );
		}
		return colisions;
	} //>>>
	this.GroupColision=function( group ){ //<<<
		var colisions = new Array();
		for(var f=0; f<this.elements.length; f++){
			if( group.colision( this.elements[f].x, this.elements[f].y ) )
				colisions.push( this.elements[f] );
		}
		return colisions;
	} //>>>
} //>>>
var ISO_Scene=function(){ //<<<
	var self = this;
	self.player = null;
	self.avatars= new ISO_Group();
	self.objects= new ISO_Group();
	self.tiles =  new ISO_Group();

	self.paredes=new ISO_Group();
	self.puertas=new ISO_Group();

	this.draw=function( where ){ //<<<
		self.tiles.draw( where );
		for(var f=0; f< self.objects.length; f++) self.objects[f].draw( where );
		for(var f=0; f< self.paredes.length; f++) self.paredes[f].draw( where );
		for(var f=0; f< self.puertas.length; f++) self.puertas[f].draw( where );
		for(var f=0; f< self.avatars.length; f++) self.avatars[f].draw( where );
	} //>>>
	this.addTile=function( tile ){ //<<<
		this.tiles.add(tile);
	} //>>>
	this.addObject=function( sprite ){ //<<<
		if( !this.objects.$( sprite.id )) this.objects.push( sprite );
	} //>>>
	this.addAvatar=function( avatar ){ //<<<
		if( !this.avatars.$( avatar.id )) this.avatars.push( avatar );
	} //>>>
	this.addWall = function( wall ){ //<<<
		this.walls.push( wall );
	} //>>>
	this.whatsIn=function( x, y ){ //<<<
		var ret = Array();

		for(var f=0; f< self.avatars.length; f++){
			var obj = self.avatars[f];
			if( obj.colision(x,y) ) ret.push( obj );
		}
		for(var f=0; f< self.objects.length; f++){
			var obj = self.objects[f];
			if( obj.colision(x,y) ) retorno.push( obj );
		}
		return retorno;
	} //>>>
} //>>>

function get3DfromScreen( x, y ){ //<<<
	x-=origen_x;
	y-=origen_y;
	var y_3d = Math.round( ((baldosa_w*y) - (baldosa_h*x)) / (baldosa_w*baldosa_h) );
	var x_3d = Math.round( ((baldosa_w*y) + (baldosa_h*x)) / (baldosa_w*baldosa_h) )-1;
	return new Array(x_3d,y_3d);
} //>>>
function getScreenfrom3D( x,y ){ //<<<
	var x_screen = (x*Math.round(baldosa_w/2) - y*Math.round(baldosa_w/2)) + origen_x;
	var y_screen = (x*Math.round(baldosa_h/2) + y*Math.round(baldosa_h/2)) + origen_y;
	return new Array(x_screen, y_screen);
} //>>>
function ISO_mainloop( func, delay ){ //<<<
	if( typeof func != "function" ) {
		throw "ISOGAME error: You must call ISO_mainloop with a function as first argument.";
		return false;
	}
	if(delay == undefined) delay = 250;
	return setInterval( func, delay );
} //>>>
