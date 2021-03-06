Model = {
	errors: {},
	collection: function(){
        switch(this.collectionName){
            case 'Flavors':         return Flavors;
            case 'InvoiceItems':    return InvoiceItems;
            case 'Invoices':        return Invoices;
            case 'Kegerators':      return Kegerators;
            case 'Kegs':            return Kegs;
            case 'Messages':        return Messages;
            case 'OrderedFlavors':  return OrderedFlavors;
            case 'Users':           return Meteor.users;
            case 'Venues':          return Venues;
            case 'SignUpForms':     return SignUpForms;
        }
    },
	save: function(attributes){
        if(this._id) this.collection().update(this._id, {$set: attributes});
        else {
            var insertValues = this.prepareDefaults(attributes);
			this._id = this.collection().insert(insertValues);
				
            if(this._id) this.afterInsert();
        }
        return this._id;
    },
    refresh: function(){
        this.extend(this.collection().findOne(this._id));
    },
	afterInsert: function() {
		
	},
	prepareDefaults: function(attributes){
		var object = {};
		_.extend(object, this.defaultValues, attributes); 
		return object;
    },
	getMongoValues: function() {
		var mongoValues = {};
		for(var prop in this) {
			if(!_.isFunction(this[prop])) mongoValues[prop] = this[prop];
		}
		delete mongoValues.errors;
		return mongoValues;
	},
    remove: function(){
        var self = this;
        this.collection().remove(this._id, function(){ self.afterRemove(); });
    },
    afterRemove: function() {
        //it's called after the object removed from database
    },
	time: function(field) {
		return moment(this[field]).format("ddd, MMM Do, h:mm a");
	},
    timeVerify: function(field) {
        return (this[field] && this[field].getTime() > 0) ? this.time(field) : 'Not yet';
    },
	extend: function(doc) {
        //_.extend(this, this.defaultValues); //for some reason the doc isnt overwriting default values. we dont need this anyway. insert handles it
        _.extend(this, doc);
	}
};