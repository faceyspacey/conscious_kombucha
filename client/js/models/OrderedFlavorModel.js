
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
	this.collectionName ='OrderedFlavors';
	
	var defaultFlavor = Flavors.findOne({one_off_quantity_availible: {$gt: 0}});
		
    this.defaultValues = {
        user_id: Meteor.userId(),
        quantity: 1,
		rate: App.prices.fiveGallonsOneOff,
		keg_type: '5 Gallons',
		flavor_id: defaultFlavor._id,
		flavor_icon: defaultFlavor.icon,
		flavor_name: defaultFlavor.name
    };

    this.user = function(){
        return Meteor.users.findOne(this.user_id);
    };

	this.subtotal = function() {
		return this.quantity * this.rate;
	};
	
	this.name = function() {
		return this.keg_type + ' ' + this.flavor_name + 'keg(s)'
	};

	_.extend(this, Model);
	this.extend(doc);

    return this;
};
