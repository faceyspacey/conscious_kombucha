UserModel = function(doc){
    this.collectionName = 'Users';

	this.getEmail = function() {
		return this.emails ? this.emails[0].address : '';
	};

    this.sendSingupEmails = function(venue){
        var content = Template.admin_signup_message(this);
        Meteor.call('sendAdminEmail', this.getEmail(), 'Order delivered: #'+invoice.order_num, adminMessage, function(err, res){});
    }

    this.getAvatar = function(){
        return this.profile && this.profile.avatar ? this.profile.avatar : '/images/default-avatar.jpg';
    }
	
    _.extend(this, Model);
	this.extend(doc);

    return this;
};