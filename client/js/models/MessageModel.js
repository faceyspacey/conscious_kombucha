
/** MessageModel attributes:
 *
 *  collectionName              'Messages'
 *  _id                         Str
 *  user_id                     Str
 *  venue_id                    Str
 *  from                        Str => email address
 *  message_num                 Int
 *  type                        Int
 *  content                     Str
 *  created_at                  Date
 *  updated_at                  Date
 *
 */

MessageModel = function(doc){
    this.collectionName ='Messages';
    this.defaultValues = {
        type: 1
    };

    this.getType = function(){
        return App.messageTypes[this.type] || {};
    };
    this.getSubject = function(){
        return App.messageTypes[this.type] ? App.messageTypes[this.type].subject : '';
    };

    this.user = function(){
        return Meteor.users.findOne(this.user_id);
    };

    this.venue = function(){
        return Venues.findOne(this.venue_id);
    };

    this.send = function(){
        this.refresh();
        var venue = this.venue(),
            neededObjects = {message: this, venue: venue, user: this.user()};
        Meteor.call('sendAdminEmail', this.from, 'Client feedback: '+this.getType().subject, Template.admin_contact_message(neededObjects), function(err, res){ console.log(res)});
        Meteor.call('sendCustomerEmail', this.from, 'Message sent with subject: '+this.getType().subject, Template.client_contact_message(neededObjects), function(err, res){ console.log(res)});

    };

    _.extend(this, Model);
    this.extend(doc);

    return this;
};
