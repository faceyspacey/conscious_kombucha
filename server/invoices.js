
Invoices = new Meteor.Collection('invoices');

Meteor.publish("invoices", function () {
    if( Roles.userIsInRole(this.userId, ['admin']) ){
        return Invoices.find({}); // everything
    } else {
        return Invoices.find({is_public: true}); // own invoices
    }
});


Invoices.allow({
    insert: function(userId, doc) {
        doc.createdAt = (new Date()).getTime();
        doc.updatedAt = (new Date()).getTime();

        return Roles.userIsInRole(userId, ['admin']);
    },
    update: function(userId, doc, fields, modifier) {
        doc.updatedAt = (new Date()).getTime();

        return Roles.userIsInRole(userId, ['admin']);
    },
    remove: function(userId, doc) {

        return Roles.userIsInRole(userId, ['admin']);
    },
    fetch: ['user_id, createdAt, updatedAt']
});