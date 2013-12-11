Template.slide_chubby_form.helpers({
    weightOptions: function(){
        return _.range(100, 501);
    },
    weightLossOptions: function(){
        return _.range(5, 501);
    },
    types: function(){
        var challengeTypes = [
            {id: 1, title: 'Bet u Lose!'},
            {id: 2, title: 'Challenge Type 2'},
            {id: 3, title: 'Challenge Type 3'}
        ];

        return challengeTypes;
    }
});

Template.slide_chubby_form.events({
    'click .accept-challenge': function(){
        var challenge = {
            title: $('#chubby_form_title').val(),
            type: $('#chubby_form_challenge_type').val(),
            weight: $('#chubby_form_weight').val(),
            weight_loss: $('#chubby_form_weight_loss').val(),
            end_date: $('#chubby_form_day').val() + '/' + $('#chubby_form_month').val() + '/' + $('#chubby_form_year').val()
        };

        Session.set('accepted_challenge', challenge);

        if(!mobileScrolling) nextPage();
    }
});