KegModel = function(doc){
	this.collectionName ='Kegs';
    this.defaultValues = {
        _id: '',
        flavor_id: '',
        user_id: '',
        venue_id: '',
        payment_cycle: 'weekly',
        payment_day: 'monday',
        oddEven: oddEvenWeek(),
        type_id: 1,
        price: 120,
        keg_num: 1
    };

	this.randomFlavor = function() {
		var flavors = Flavors.find({is_public: true, name: {$not: 'Random'}}),
			weekNum = getWeekNumber(new Date),
			flavorIndex = (weekNum + this.keg_num) % flavors.count();

		return flavors.fetch()[flavorIndex]; //different flavor from prev week; different kegs at same time ;)
	};
	
    this.flavor = function(){
		return Flavors.findOne(this.flavor_id);
    };

	this.randomCompensatedFlavor = function() {
		return this.flavor().name == 'Random' ? this.randomFlavor() : this.flavor();
	};
	
	this.user = function(){
        return Meteor.users.findOne(this.user_id);
    };

    this.venue = function(){
        return Venues.findOne(this.venue_id);
    };

    this.chargePeriod = function(){
        return this.payment_cycle + '-' + this.payment_day;
    };

    this.chargePeriodName = function(){
        return this.getPaymentCycle().name + ' on ' + this.getPaymentDay().name;
    };

    this.getPaymentCycle = function(){
        return _.findWhere(App.paymentCycles, {id: this.payment_cycle});
    };

    this.getPaymentDay = function(){
        return _.findWhere(App.paymentDays, {id: this.payment_day});
    };

	_.extend(this, Model);
	this.extend(doc);

    return this;
};
