/** page_kegerator_installs HELPERS, EVENTS & CALLBACKS **/

Template.page_kegerator_installs.helpers({
	venues: function(){
	    return Venues.find({}, {sort: {kegerator_request_date: -1, tap_request_date: -1}});
	}
});

Template.page_kegerator_installs.events({
    'click .kegerator-installed-button': function() {
        this.setKegeratorInstalled();
    },
	'click .tap-installed-button': function() {
        this.setDoubleTapInstalled();
    }
});