
/** OrderedFlavorModel attributes:
 *
 *  collectionName              'OrderedFlavors'
 *  _id                         Str
 *  user_id                     Str
 *  quantity                    Str
 *  rate                        Int
 *  keg_type                    Str
 *  flavor_id                   Str
 *  flavor_icon                 Str
 *  flavor_name                 Str
 *
 */

OrderedFlavorModel = function(doc){
    _.extend(this, Model);
	this.collectionName ='OrderedFlavors';
	
	var defaultFlavor = Flavors.findOne({one_off_quantity_available: {$gt: 0}}, {sort: {one_off_quantity_available: -1}});

    // Default values - This kind of model will never be saved so we can se the default only this way
    this.user_id = Meteor.userId();
    this.quantity = 1;
    this.rate = App.prices.fiveGallonsOneOff;
    this.keg_type = 'Five Gallons';
    this.flavor_id = defaultFlavor._id;
    this.flavor_icon = defaultFlavor.icon;
    this.flavor_name = defaultFlavor.name;

    this.user = function(){
        return Meteor.users.findOne(this.user_id);
    };

	this.subtotal = function() {
        console.log(this.quantity, this.rate);
		return this.quantity * this.rate;
	};
	
	this.name = function() {
        return this.flavor_name + ' keg' + (this.quantity > 1 ? 's' : '');
	};

	this.extend(doc);

    return this;
};
