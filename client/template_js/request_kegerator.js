/** page_request_kegerator HELPERS, EVENTS & CALLBACKS **/

Template.page_request_kegerator.helpers({
    venue: function(){ return Venues.findOne(this.venue_id); }
});

Template.page_request_kegerator.events({
    'click .top-back-btn': function(){
        Router.go('setKegs', {id: this.venue_id});
    },
    'click .request-kegerator-btn': function(){
        if(confirm("Are you sure you'd like another (FREE!) kegerator for your venue?")) {
            Venues.findOne(this.venue_id).requestKegerator();
        }
    },
    'click .request-tap-btn': function(){
        if(confirm("Are you sure you'd like to replace your current tap tower with a {FREE!) double tower?")) {
            Venues.findOne(this.venue_id).requestDoubleTap();
        }
    }
});