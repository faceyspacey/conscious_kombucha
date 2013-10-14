InvoiceModel = function(doc){
	this.collectionName ='Invoices';
    this.defaultValues = {
		order_num: 0,
		keg_quantity: 0, 
        total: 0, 
		paid: false
    };

    this.user = function(){
        return Meteor.users.findOne(this.user_id);
    };

	//only one_off invoices are guaranteed to have a single Venue model associated with it
	this.venue = function(){
        if( !this.venue_id )
            return false;

        return Venues.findOne(this.venue_id);
    };

	this.addReplyMessage = function(message) {
		Invoices.update(this._id, {$push: {messages: message}});
		Meteor.call('sendAdminEmail', this.user().getEmail(), message);
		Meteor.call('sendCustomerEmail', this.user().getEmail(), 'Message sent in regards to Order #'+this.order_num);
	};

	this.invoiceItems = function(){
        return InvoiceItems.find({invoice_id: this._id});
    };

	this.paymentPeriodType = function() {
		if(this.type == 'one_off') return 'One Off Order';
		else return this.payment_cycle.substr(0, 1).toUpperCase() + this.payment_cycle.substr(1);
	};
	
	this.deliveryDayOfWeek = function() {
		if(this.type == 'one_off') return this.requestedDeliveryDayOfWeek();
		else this.payment_day;
	};
	
	//for one off kegs
	this.requestedDeliveryDayOfWeek = function() {
		return moment(this.requested_delivery_date).format('ddd');
	};
	
	this.actualDeliveryDate = function() {
		return this.actual_delivery_date ? moment(this.actual_delivery_date).format("ddd, MMM Do, h:mm a") : 'Not Delivered Yet';
	};
	
	this.actualPaidDate = function() {
		return moment(this.actual_paid_date).format("ddd, MMM Do, h:mm a");
	};
	                                                                                       
	this.paidInfo = function() {
		if(this.paid) return 'PAID';
		if(this.payment_failed) return 'FAILED';
		if(!this.is_stripe_customer && !this.paid) return 'AWAITING CHECK';
	};

    this.LineItems = function(options){
        var option = {};
        _.extend(option, options);
        option.invoice_id = this._id;
        return LineItems.find(option);
    };

    this.formattedCreatedAt = function(){
        //date formatting comes here
    };

    this.paymentPeriod = function(){
        // payment period rendering comes here
    };

	_.extend(this, Model);
	this.extend(doc);

    return this;
};
