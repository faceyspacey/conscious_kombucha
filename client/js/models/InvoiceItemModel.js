
/** InvoiceItemModel attributes:
 *
 *  collectionName              'InvoiceItems'
 *  _id                         Str
 *  user_id                     Str
 *  invoice_id                  Str
 *  name                        Str
 *  created_at                  Date
 *  flavor_icon                 Str
 *  flavor_id                   Str
 *  flavor_name                 Str
 *  quantity                    Int
 *  rate                        Int
 *  subtotal                    Int //get rid of this and use the method below instead
 *  updated_at                  Date
 *
 */


InvoiceItemModel = function(doc) {
    _.extend(this, Model);
	this.collectionName ='InvoiceItems';
    this.defaultValues = {};

    this.user = function(){
        if( !this.user_id )
            return false;

        return Meteor.users.findOne(this.user_id);
    }

    this.flavor = function(){
        var flavor = Flavors.findOne(this.flavor_id);
        if( !flavor )
            return {};

        return flavor;
    }

    this.flavor_icon_jpeg = function(){

    }

	this.subtotal = function() {
		return this.quantity * this.rate;
	};
    this.getSubtotal = function() {
        return this.quantity * this.rate;
    };

	this.extend(doc);

    return this;
};
