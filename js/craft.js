//Item craft
class Craft{
	constructor(id, name, items){
		
		this.id = id;
		this.name = name;
		this.itemsNeeded = [];
		for(var i = 0; i < items.length;i++){
			if(items[i] < 26){
				this.itemsNeeded.push(Item.getItem(items[i]));
			}else{
				this.itemsNeeded.push(Craft.getCraft(items[i]));
			}
		}
	}
	static getCraftablesForItem(itemId){
		var craftables = [];
		for(var i = 0; i < this.crafts.length; i++){
			var craft = this.crafts[i];
			for(var j = 0; j < craft.itemsNeeded.length; j++){
				var item = craft.itemsNeeded[j];
				if(item.id === itemId){
					craftables.push(craft);
				}
			}
		}
		return craftables;
	}
	static getCraft(id){
		for(var i = 0; i < this.crafts.length; i++){
			if(this.crafts[i].id === id){return this.crafts[i];}
		}
		return false;
	}
	
	static getItemsManquant(id){
		for(var i = 0; i < this.crafts.length; i++){
			if(this.crafts[i].id === id){return this.crafts[i].itemsNeeded;}
		}
		return false;
	}
}