Venues = new Meteor.Collection("venues");

Meteor.publish("venues", function (userId) {
	var userId = userId || this.userId;
	console.log('userId', userId);
	
    if(Roles.userIsInRole(userId, ['admin'])) return Venues.find();
    else return Venues.find({user_id: userId});
});


Venues.allow({
    insert: function(userId, doc) {
        doc.created_at = new Date;
        doc.updated_at = new Date;
        doc.kegerator_request_date = new Date;
        doc.user_id = userId;
        return userId;
    },
    update: function(userId, doc, fields, modifier) {
        doc.updated_at = new Date;
        return ((doc.user_id === userId) || Roles.userIsInRole(userId, ['admin']));
    },
    remove: function(userId, doc) {
        return ((doc.user_id === userId) || Roles.userIsInRole(userId, ['admin']));
    },
    fetch: ['user_id, created_at, updated_at']
});
