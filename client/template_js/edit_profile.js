/** page_edit_profile HELPERS, EVENTS & CALLBACKS **/

Template.page_edit_profile.helpers({
    model : function() {
        return Meteor.users.findOne(this.user_id);
    }
});


/** user_form HELPERS, EVENTS & CALLBACKS **/

Template.user_form.events({
    'click #save-profile-btn' : function(){
        var user = {
            emails: [{address: $('#profile_email').val()}],
            profile: {
                name: $('#profile_name').val(),
                phone: $('#profile_phone').val(),
                avatar: $('#profile_avatar').val()
            }
        };

        if( !user.emails[0].address || !user.profile.name || !user.profile.phone ){
            FlashMessages.sendError('Please, fill all required fields');
            return;
        }

        Meteor.users.update(this._id, {$set: user});

        if(Meteor.userId() == this._id) Router.go('myProfile');
        else Router.go('profile', {id: this.user_id});
    }
});

