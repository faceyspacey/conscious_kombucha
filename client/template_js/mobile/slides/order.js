Template.slide_order.helpers({
	order: function() {
		return Invoices.findOne(Session.get('current_invoice_id'));
	},
	invoiceItems: function() {
		return Invoices.findOne(Session.get('current_invoice_id')).invoiceItems();
	}
});

Template.slide_order.events({
	'mouseup .reply-button': function() {
		var message = prompt('Send us a quick message about the order. Anything wrong? All gravy?');
		currentInvoice().addReplyMessage(message);
	},
    'mouseup .pdf-button': function(){
        return Invoices.findOne(Session.get('current_invoice_id')).renderInvoicePDF();
    },
	'touchstart .reply-button, mousedown .reply-button, touchstart .pdf-button, mousedown .pdf-button': function(e) {
		$(e.currentTarget).addClass('touched');
	},
	'touchend .reply-button, mouseup .reply-button, touchend .pdf-button, mouseup .pdf-button': function(e) {
		$(e.currentTarget).removeClass('touched');
	}
});