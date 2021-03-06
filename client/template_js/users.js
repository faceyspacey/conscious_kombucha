/** page_users HELPERS, EVENTS & CALLBACKS **/

Template.page_users.helpers({
	users:  function(){
	    var condition = this.role_id != 'all' ? {roles: {$in: [this.role_id]}} : {},
			users = Meteor.users.find(condition);
	    return users;
	},
    venues: function(){
        var venues = Venues.find({user_id: this._id});
        return venues.count()+' venues';
    }
});

Template.page_users.events({
    'click .user-profile-btn' : function(){
        if(Meteor.userId() == this._id) Router.go('myProfile');
        else Router.go('profile', {id: this._id});
    },
    'click .user-venues-btn' : function(){
        if(Meteor.userId() == this._id) Router.go('myVenues');
        else Router.go('clientVenues', {id: this._id});
    },
    'click .user-orders-btn' : function(){
        if(Meteor.userId() == this._id) Router.go('myInvoices');
        else Router.go('clientInvoices', {id: this._id});
    }
});


/** user_grid_row HELPERS, EVENTS & CALLBACKS **/

Template.user_grid_row.helpers({
    listRoles: function(roles){
        var rolesText = "";
        _.each(roles, function(role, index) {
            rolesText += role + (index < roles.length-1 ? ',' : '');
        });
        return rolesText;
    },
});