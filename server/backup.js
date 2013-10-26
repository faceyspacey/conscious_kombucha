

dropbox = {
    appConf: {
        "app_key": "74pi23fcizips88",
        "app_secret": "wxswws5iy3onxnl",
        "root": "sandbox"
    }
};


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

/*
Meteor.startup(function(){
    dropbox.dbox  = Npm.require("dbox");
    dropbox.app   = dropbox.dbox.app(dropbox.appConf);

    dropbox.app.requesttoken(function(status, request_token){
        if( status == 200 )
            dropbox.request_token = request_token;

        console.log(status, request_token);
        dropbox.app.accesstoken(request_token, function(status, access_token){
            if( status == 200 )
                dropbox.access_token = access_token;

            console.log(status, access_token);

            var client = dropbox.app.client(access_token);
            client.account(function(status, reply){
                console.log(reply)
            });

        });
    });
});

Meteor.methods({
    dboxTest: function(){
        var dbox  = Npm.require("dbox");
        var app   = dbox.app(appConf);
        var token = '';
        //var client = app.client({ "oauth_token_secret":"tSDzyDuoWeGu5v5t","oauth_token":"XqOHHIRqsz1TcgOp" });

        app.requesttoken(function(status, request_token){
            console.log(status, request_token);
            app.accesstoken(request_token, function(status, access_token){
                console.log(status, access_token);

                var client = app.client(access_token);

                client.put("hello.txt", "here is some text", function(status, reply){
                    console.log(reply)
                });

            });
        });




        return token;
    }
}); */