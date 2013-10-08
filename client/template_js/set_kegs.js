/** page_set_kegs HELPERS, EVENTS & CALLBACKS **/

Template.page_set_kegs.helpers({
    venue: function() {
        return Venues.findOne(this.venue_id);
    },
    kegs: function(){
        return Venues.findOne(this.venue_id).getKegs();
    }
});

Template.page_set_kegs.events({
    'click .add-keg-btn' : function(e){
        Venues.findOne(this.venue_id).addKeg();
    }
});


/** subscription_keg_row HELPERS, EVENTS & CALLBACKS **/

Template.subscription_keg_row.helpers({
	flavors: function(flavorId){
        var flavors = Flavors.find({is_public: true}).fetch();
        flavors.unshift({_id: 'random', name: 'Random'});
        return flavors;
    },
	cycles: function(){
		return App.paymentCycles;
	},
	days: function(){
		return App.paymentDays;
	},
	flavorSelected: function(flavorId) {
		return flavorId == this._id ? 'selected' : '';
	},
	cycleSelected: function(cycleId) {
		return cycleId == this.id ? 'checked="checked"' : '';
	},
	daySelected: function(dayId) {
		return dayId == this.id ? 'checked="checked"' : '';
	}
});

Template.subscription_keg_row.events({
	'click .remove-keg-btn' : function(e, instance){
        if(confirm('Are you sure you want to drop this keg?')) Venues.findOne(instance.data.venue_id).removeKeg(this._id);
    },
    'change .keg-flavor-select' : function(e, instance){
        Venues.findOne(instance.data.venue_id).updateKeg(this._id, {flavor_id: e.target.value});
    },
    'change .radio-cycle' : function(e, instance){
        Venues.findOne(instance.data.venue_id).updateKeg(e.target.title, {paymentCycle: e.target.value}); //this refers to radio. weird
    },
    'change .radio-day' : function(e, instance){
        Venues.findOne(instance.data.venue_id).updateKeg(e.target.title, {paymentDay: e.target.value}); //this refers to radio. weird
    }
});


/** keg_charges_set_kegs HELPERS, EVENTS & CALLBACKS **/

Template.keg_charges_set_kegs.helpers({
	kegCharges: function(){
	    var venue = Venues.findOne(this.venue_id);
	    if( !venue )
	        return '';

	    var array = [];
	    var charges = venue.getKegCharges();
	    console.log( charges );
	    for(var i in charges){
	        var cyclesArray = [];
	        for(var c in charges[i].cycles){
	            var flavorsArray = [];
	            for(var d in charges[i].cycles[c].flavors){
	                flavorsArray.push(charges[i].cycles[c].flavors[d]);
	            }
	            charges[i].cycles[c].flavors = flavorsArray;
	            cyclesArray.push(charges[i].cycles[c]);
	        }
	        charges[i].cycles = cyclesArray;
	        array.push(charges[i]);
	    }
	    return array;
	}
});