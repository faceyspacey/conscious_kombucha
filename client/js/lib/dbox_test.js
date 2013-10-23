

testDbox = function(){


    Meteor.call('dboxTest', function(err, res){
        console.log(err, res);
    });
};