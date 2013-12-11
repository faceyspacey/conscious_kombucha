Template.slide_challenge_accepted.helpers({
    challenge: function(){
        return Session.get('accepted_challenge');
    },
    getType: function(type){
        var challengeTypes = {
            0: '',
            1: 'Bet u Lose!',
            2: 'Challenge Type 2',
            3: 'Challenge Type 3'
        };

        return challengeTypes[type];
    }
});