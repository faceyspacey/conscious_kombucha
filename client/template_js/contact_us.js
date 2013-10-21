
/** page_contact_us HELPERS, EVENTS & CALLBACKS **/

Template.page_contact_us.helpers({
    messages: function(){
        return Messages.find({}, {sort: {created_at: -1}}).fetch();
    }
});


/** contact_us_form HELPERS, EVENTS & CALLBACKS **/

Template.contact_us_form.helpers({
    message: function(){
        return new MessageModel();
    },
    messageTypes: function(){
        var types = App.messageTypes;
        delete types[2];
        return _.values(types);
    },
    venues: function(){
        return Venues.find({user_id: Meteor.userId()}).fetch();
    }
});

Template.contact_us_form.events({
    'click #send-message-btn': function(){
        var message_id = this.save({
            user_id: Meteor.userId(),
            from: Meteor.userId() ? Meteor.user().getEmail() : $('#contactForm_email').val(),
            venue_id: $('#contactForm_venue').val(),
            type: $('#contactForm_type').val(),
            content: $('#contactForm_content').val()
        });


        if( Messages.findOne(message_id) ){
            this.send(message_id);
            $('#contactForm_content').val('');
            Router.go('myProfile');
            alert('Thank you for your feedback. We will response as soon as possible.');
        }else
            alert('Message failed to send. Please, try again later.');
    }
});


/** recent_messages_grid HELPERS, EVENTS & CALLBACKS **/

Template.recent_messages_grid.helpers({
    messages: function(){
        return Messages.find({}, {sort: {created_at: -1}});
    },
});