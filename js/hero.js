
class Hero extends Entity{

	constructor(map, x, y) {
		super(map, x, y);
		this.SPEED = 528;
		
		this.health = 200;
		this.maxHealth = 200;
		this.image = loader.getImage('hero');
		
		this.items = [];
		this.canCraft = false;
		this.refreshText();
	}
	
	hasItem(itemId){
		for(let w = 0; w < this.items.length; w++){
			if(this.items[w].id == itemId){
				return true;
			}
		}
		return false;
	}
	vider(){
		if(this.items.length > 0){
			this.removeItem(this.items[this.items.length-1].id);
		}
	}
	addItem(itemId){
		var item = "";
		if(itemId < 26){
			item = Item.getItem(itemId);
		}else{
			item = Craft.getCraft(itemId);
		}
		text.innerHTML = text.innerHTML.replace("<br><b>Cherche des matériaux pour crafter de nouveaux items</b><br>", "");

		text.innerHTML = text.innerHTML + "<div style='cursor: grab;' onclick='game.hero.removeItem(" + item.id + ")'>- " + item.name + "</div>";
		this.items.push(item);
		
		this.refreshText();
		
	}
	
	removeItem(itemId){
		var item = "";
		if(itemId < 26){
			item = Item.getItem(itemId);
		}else{
			item = Craft.getCraft(itemId);
		}
		for(var i = this.items.length-1; i >= 0; i--){
			if(this.items[i].id === itemId){
				this.items.splice(this.items.indexOf(item), 1);
				text.innerHTML = text.innerHTML.replace('<div style="cursor: grab;" onclick="game.hero.removeItem(' + item.id + ')">- ' + item.name + "</div>", "");
				i = -1;
			}	
		}
		if(this.items.length === 0){
			text.innerHTML = text.innerHTML + "<br><b>Cherche des matériaux pour crafter de nouveaux items</b><br>";
		}
		
	}
	craft(){
		var craftDispo = this.itemsCraftable();
		
		for(var i = 0; i < craftDispo.length; i++){
			if(this.items.indexOf(craftDispo[i]) > 0){
				i++;
				continue;
			}
			var itemToRemove = craftDispo[i].itemsNeeded;
			for(var j = 0; j < itemToRemove.length; j++){
				this.removeItem(itemToRemove[j].id);
			}
			this.addItem(craftDispo[i].id);
		}
	}
	itemsCraftable(){
		var itemsCraftable = [];
		
		//loops through all craftables items
		for(var i = 0; i < Craft.crafts.length; i++){
			var craft = Craft.crafts[i];
			//Get items needed for crafting
			var itemsManquant = craft.itemsNeeded;
			//loop though all items Needed
			var found = [];
			for(var s = 0; s < itemsManquant.length; s++){
				found.push(false);
			}
			for(var t = 0; t < itemsManquant.length; t++){
				
				var itemManquant = itemsManquant[t];
				//Check if player have this item
				for(var x = 0; x < this.items.length; x++){
					if(this.items[x].id === itemManquant.id){
						found[t] = true;
					}
				}
							
			}
			var craftable = true;
			for(var t = 0; t < found.length; t++){
				if(found[t] == false){
					craftable = false;
				}
			}
			if(craftable){
				//console.log(craft.name + " craftable avec vos " + craft.itemsNeeded);
				this.canCraft = true;
				itemsCraftable.push(craft);
			}
		}
		return itemsCraftable;

	}

	move(delta, dirx, diry){
		super.move(delta, dirx, diry)
		//check if we walk on an item
		this._takeItem(dirx, diry);
	}
	

	_takeItem(dirx, diry){
		var left = this.x - this.width / 2;
		var right = this.x + this.width / 2 - 1;
		var top = this.y - this.height / 2;
		var bottom = this.y + this.height / 2 - 1;
		
		var item = this.map.isItem(left, right, top, bottom);
		
		//console.log(item);
		
		if(typeof item !== "undefined"){
			//Sur ou devant le constructeur
			if(item[3] === 100){
				
				if(this.itemsCraftable().length > 0){
					game.ctx.fillStyle = "#FF0000";
					game.ctx.font = "30px Arial";
					game.ctx.fillText("Crafter E", 5, canvas.height-this.height*1.2);	
				}
				
			}else{
				console.log("hey");
				map.setTile(item[0], item[1], item[2]);
				this.addItem(item[3]);
				this.canCraft = false;
			}
		}
		
		//if (item !== 0) {  map.setTile(0, item.x, item.y, 0);}

	}	
	
	refreshText(){
		var craftDispo = this.itemsCraftable();
		subText.innerHTML = "<u>Craft Possible :</u>";
		var txt = subText.innerHTML + "<div id='craftList'>";
		for(let j = 0; j < Craft.crafts.length; j++){
			if(craftDispo.indexOf(Craft.crafts[j]) !== -1){
				txt += "<br><div class='craftListItem'>-<div style='color:green;'>" + Craft.crafts[j].name + "</div> ( ";					
			}else{
				txt += "<br><div class='craftListItem'>-<div style='color:gray;'> " + Craft.crafts[j].name + "</div> ( ";		
			}
			for(let i = 0; i < Craft.crafts[j].itemsNeeded.length; i++){

					if(this.hasItem(Craft.crafts[j].itemsNeeded[i].id)){
						txt +=  "<div style='color: green;'>" + Craft.crafts[j].itemsNeeded[i].name + "</div>";
					}else{
						txt += "<div style='color: gray;'>" + Craft.crafts[j].itemsNeeded[i].name + "</div>";
					}

					if(i < Craft.crafts[j].itemsNeeded.length - 1){
						txt += ", ";
					}else{
						txt += " )</div>";
					}
			}
		}
		txt += "</div>";
		subText.innerHTML = txt;
	}
	render(){
		//mini map
		game.ctx.drawImage(loader.getImage('map'),(canvas.width - canvas.width/5)+10, (canvas.height - canvas.height/5)+25, 127,112);
		
		game.ctx.drawImage(
				this.image,
				(canvas.width - canvas.width/5) + ((this.x)/(canvas.width/15))+9,
				(canvas.height - canvas.height/5) + ((this.y)/(canvas.width/15))+25, this.height/17, this.height/17);
		
		//hero
		game.ctx.drawImage(
				this.image,
				this.screenX - this.width / 2,
				this.screenY - this.height / 2, this.width, this.height);
		//UI
		this.drawUI();
		
	}
	
	drawUI(){
		game.ctx.fillStyle = "#FF0000";

		game.ctx.font = "20px Arial";
		game.ctx.fillText("Pos: [" +Math.floor(this.x)+ "," + Math.floor(this.y)+  "]", 5, canvas.height-20);
		var index = 10;
		//items
		for(var i = 0; i < this.items.length ; i++){
			
			
			game.ctx.fillRect(index-2,8, this.height+4, this.height+4);
			game.ctx.drawImage(
					loader.getImage('?'),
					index, 10, this.height, this.height);
			index+= this.height+10;
		}
	}
}