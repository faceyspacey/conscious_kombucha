UserModel = function(doc){
    this.collectionName = 'Users';

	this.getEmail = function() {
		return this.emails ? this.emails[0].address : '';
	};

    this.sendSignupEmails = function(venue_id){
        var venue = Venues.findOne(venue_id),
            content = Template.admin_signup_message(venue);
        Meteor.call('sendAdminEmail', this.getEmail(), 'Client Signup: '+this.profile.name, content, function(err, res){});
    }

    this.getAvatar = function(){
        return this.profile && this.profile.avatar ? this.profile.avatar : '/images/default-avatar.jpg';
    }
	
    _.extend(this, Model);
	this.extend(doc);

    return this;
};