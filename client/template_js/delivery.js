/** page_delivery HELPERS, EVENTS & CALLBACKS **/

Template.page_delivery.helpers({
    mondayObject: { payment_day: 'monday' },
    thursdayObject: { payment_day: 'thursday' },
});


/** delivery_table HELPERS, EVENTS & CALLBACKS **/

Template.delivery_table.helpers({
    venues: function(){
        var venue_ids = _.keys(_.groupBy(Kegs.find({$or: [
            {payment_day: this.payment_day, payment_cycle: 'bi-weekly', odd_even: oddEvenWeek(nextDateObj(new Date, this.payment_day))},
            {payment_day: this.payment_day, payment_cycle: 'weekly'},
        ]}).fetch(), 'venue_id'));

        return Venues.find({_id: {$in: venue_ids}}, {sort: {name: 1}});
    },
    kegsToDeliverByFlavor: function(dayObject){
        return this.kegsForSubscription(dayObject.payment_day);
    },
    canBeDelivered: function(payment_day){
        return Invoices.find({$and: [
            {requested_delivery_date: {$gte: nextDateObj(new Date(), payment_day, 'start')}},
            {requested_delivery_date: {$lte: nextDateObj(new Date(), payment_day, 'end')}},
            {payment_day: payment_day,
            venue_id: this._id,
            type: 'subscription'},
        ]}).count() == 0;
    }
});

Template.delivery_table.events({
    'click .delivered-venue-btn': function(e){
        var payment_day = $(e.target).data('pday');
        if(confirm('Are all ordered items delivered to this venue? ('+this.name+')'))
            this.placeSubscriptionOrder({payment_day: payment_day});
    }
});

