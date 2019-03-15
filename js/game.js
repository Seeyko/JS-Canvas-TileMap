// JavaScript Document
// Game object
class Game{
	constructor(context){
		this.ctx = context;
		this.hasScroll = true;
	}
	run(){
	    this._previousElapsed = 0;
		var p = this.load();
		Promise.all(p).then(function(loaded){
			this.init();
			//window.requestAnimationFrame(tick);
		}.bind(this));
	}
	
	init(){
		keyboard.listenForEvents(
        [keyboard.LEFT, keyboard.RIGHT, keyboard.UP, keyboard.DOWN, keyboard.SPACE, keyboard.CRAFT]);
		
		//this.tileAtlas = loader.getAllImage();
		
		this.hero = new Hero(map, 4375, 4881);
		this.camera = new Camera(map, canvasSize, canvasSize);
		this.camera.follow(this.hero);
	}
	update(delta){
	    this.hasScrolled = false;

		// handle hero movement with arrow keys
		var dirx = 0;
		var diry = 0;
		if (keyboard.isDown(keyboard.CRAFT)) {
			 if(this.hero.canCraft === true) {
				 this.hero.craft();
			 }
		}
		if (keyboard.isDown(keyboard.LEFT)) { dirx = -1; }
		else if (keyboard.isDown(keyboard.RIGHT)) { dirx = 1; }
		else if (keyboard.isDown(keyboard.UP)) { diry = -1; }
		else if (keyboard.isDown(keyboard.DOWN)) { diry = 1; }
		
		if(dirx !== 0 || diry !== 0){
			this.hero.move(delta, dirx, diry);
	        this.hasScrolled = true;
		}
		this.camera.update();		
	}
	render(spawn){
		if(this.hasScroll){
			// draw map background layer
			this._drawLayer(0);
			// draw map top layer
			this._drawLayer(1);
			this._drawLayer(2);

		}
				
		if(spawn === true){
			this.spawnItems();
			//draw decor and items
			
		}

		this.hero.render();

		this._drawLayer(3);
	}
	
	spawnItems(){
		let items = Item.items;
		for(let i = 0; i < items.length; i++){
			let item = items[i];
			let spawnRate = item.spawnRate;
			for(let j = 0; j < map.layers[1].length; j++){
				
				if(map.layers[2][j] === 0){
					let rdn = Math.random();
					if(rdn <= spawnRate){
						console.log(item.name);
						map.layers[2][j] = item.id;
					}
				}
			}
		}
	}
	load(){
		var loaded = [];
		
		loaded.push(loader.loadImage(0, "assets/" + 0 + ".png"));
		loaded.push(loader.loadImage(11, "assets/" + 11 + ".png"));
		loaded.push(loader.loadImage(2, "assets/" + 2 + ".png"));
		loaded.push(loader.loadImage(3, "assets/" + 3 + ".png"));
		loaded.push(loader.loadImage(4, "assets/" + 4 + ".png"));
		loaded.push(loader.loadImage(5, "assets/" + 5 + ".png"));
		loaded.push(loader.loadImage(6, "assets/" + 6 + ".png"));
		loaded.push(loader.loadImage(7, "assets/" + 7 + ".png"));
		loaded.push(loader.loadImage(8, "assets/" + 8 + ".png"));
		loaded.push(loader.loadImage(9, "assets/" + 9 + ".png"));
		loaded.push(loader.loadImage(10, "assets/" + 10 + ".png"));
		loaded.push(loader.loadImage(11, "assets/" + 11 + ".png"));
		loaded.push(loader.loadImage(12, "assets/" + 12 + ".png"));

		loaded.push(loader.loadImage('?', 'assets/noimg.png'));

		loaded.push(loader.loadImage('hero', 'assets/player.jpg'));
		loaded.push(loader.loadImage('map', 'assets/map.png'));
		return loaded;    	
	}

	_drawLayer(layer) {
		let startCol = Math.floor(this.camera.x / map.tsize);
		let endCol = startCol + (this.camera.width+1 / map.tsize);
		let startRow = Math.floor(this.camera.y / map.tsize);
		let endRow = startRow + (this.camera.height +1/ map.tsize);
		let offsetX = -this.camera.x + startCol * map.tsize;
		let offsetY = -this.camera.y + startRow * map.tsize;

		for (let c = startCol; c <= endCol; c++) {
			for (let r = startRow; r <= endRow; r++) {
				let tile = map.getTile(layer, c, r);
				let x = (c - startCol) * map.tsize + offsetX;
				let y = (r - startRow) * map.tsize + offsetY;
				if (typeof tile !=="undefined" && tile !== 1) {	// 1 => collision
					if((layer == 3 && tile != 0 )|| layer != 3){
						if(loader.getImage(tile) !== null){
							this.ctx.drawImage(
								loader.getImage(tile), // image
								Math.round(x),  // target x
								Math.round(y), // target y
								map.tsize, // target width
								map.tsize// target height
							);
						}else{
							this.ctx.drawImage(
								loader.getImage('?'), // image
								Math.round(x),  // target x
								Math.round(y), // target y
								map.tsize, // target width
								map.tsize// target height
							);		
						}
					}
				}
			}
		}
	};

}

function imageExists(url){
  var image = new Image();

    image.src = url;

    if (!image.complete) {
        return false;
    }
    else if (image.height === 0) {
        return false;
    }

    return true;
}