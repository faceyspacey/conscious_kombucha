

Meteor.methods({
    dboxTest: function(){
        var dbox  = Npm.require("dbox");
        var app   = dbox.app({ "app_key": "74pi23fcizips88", "app_secret": "wxswws5iy3onxnl", "root": "sandbox" });
        var token = '';
        //var client = app.client({ "oauth_token_secret":"tSDzyDuoWeGu5v5t","oauth_token":"XqOHHIRqsz1TcgOp" });

        /*
        */

        app.requesttoken(function(status, request_token){
            console.log(request_token);
            app.accesstoken(request_token, function(status, access_token){
                console.log(access_token);

                var client = app.client(access_token);

                client.put("hello.txt", "here is some text", function(status, reply){
                    console.log(reply)
                });

            });
        });




        return token;
    }
});


Meteor.startup(function(){

    var Collections = {
        Flavors: Flavors,
        InvoiceItems: InvoiceItems,
        Invoices: Invoices,
        Kegs: Kegs,
        Messages: Messages,
        Users: Meteor.users,
        Venues: Venues
    };

    backUpDb = function(){
        var backUpData = {
            created_at: new Date,
            collections: {}
        };
        for(var i in Collections){
            backUpData.collections[i] = Collections[i].find().fetch();
        }
    };

    restoreDb = function(){


    };

});