
/** InvoiceModel attributes:
 *
 *  collectionName              'Invoices'
 *  _id                         Str
 *  user_id                     Str
 *  venue_id                    Str
 *  type                        Str     =>  "one_off", "subscription"
 *  order_num                   Int
 *  keg_quantity                Int
 *  requested_delivery_date     Date
 *
 *  total                       Int
 *  paid                        Bool
 *
 */

InvoiceModel = function(doc){
	this.collectionName ='Invoices';
    this.defaultValues = {
		order_num: 0,
		keg_quantity: 0, 
        total: 0, 
		paid: false
    };

    this.user = function(){
        return Meteor.users.findOne(this.user_id);
    };

	//only one_off invoices are guaranteed to have a single Venue model associated with it
	this.venue = function(){
        if( !this.venue_id )
            return false;

        return Venues.findOne(this.venue_id);
    };

	this.addReplyMessage = function(message) {
		Invoices.update(this._id, {$push: {messages: message}});
		Meteor.call('sendAdminEmail', this.user().getEmail(), 'Reply for Invoice: #'+this.order_num, message, function(err, res){});
		Meteor.call('sendCustomerEmail', this.user().getEmail(), 'Message sent in regards to Order #'+this.order_num, 'Your message: '+message, function(err, res){});
	};

    this.payItOff = function() {
        if( this.paid )
            return;

        this.save({paymentInProgress: true});
        this.venue().chargeCustomer(this._id);
    };

	this.invoiceItems = function(condition){
        var attributes = _.extend(_.extend({}, condition), {invoice_id: this._id});
        return InvoiceItems.find(attributes);
    };

	this.items = function(){
        return InvoiceItems.find({invoice_id: this._id});
    };

	this.paymentPeriodType = function() {
		if(this.type == 'one_off') return 'One Off Order';
		else return 'Weekly'; //this.payment_cycle.substr(0, 1).toUpperCase() + this.payment_cycle.substr(1)
	};
	
	this.deliveryDayOfWeek = function() {
		if(this.type == 'one_off') return this.requestedDeliveryDayOfWeek();
		else this.payment_day;
	};
	
	//for one off kegs
	this.requestedDeliveryDayOfWeek = function() {
		return moment(this.requested_delivery_date).format('ddd');
	};

    this.requestedDeliveryDate = function() {
        return moment(this.requested_delivery_date).format("ddd, MMM Do, h:mm a");
    };
	
	this.actualDeliveryDate = function() {
		return this.actual_delivery_date ? moment(this.actual_delivery_date).format("ddd, MMM Do, h:mm a") : 'Not Delivered Yet';
	};
	
	this.actualPaidDate = function() {
		return moment(this.actual_paid_date).format("ddd, MMM Do, h:mm a");
	};
	                                                                                       
	this.paidInfo = function() {
		if(this.paid) return 'PAID';
		if(this.payment_failed) return 'FAILED';
		if(!this.is_stripe_customer && !this.paid) return 'AWAITING CHECK';
	};

    this.formattedCreatedAt = function(){
        //date formatting comes here
    };

    this.paymentPeriod = function(){
        // payment period rendering comes here
    };

    this.renderInvoicePDF = function(){
        var self = this,
            venue = this.venue();

        // generation needs to be in callback to get the fully loaded logo
        getImageFromUrl('/images/invoice/top-logo.jpeg', function(imgData){
            var doc = new jsPDF('portrait', 'cm', 'a4');


            // frame for the invoice
            doc.setLineWidth(0.07);
            doc.setDrawColor(0, 105, 170);
            doc.rect(1, 1, 19, 27.7, 'stroke');


            // top-right: ConsciousKombucha logo
            doc.addImage(imgData, 'JPEG', 10.45, 1.07, 9.5, 2.68);


            // top-left: INVOICE #
            doc.setFont("helvetica");
            doc.setFontType('bold');
            doc.setFontSize(26);
            doc.setTextColor(0,105,170);
            doc.text(1.8, 2.8, "INVOICE #" + self.order_num);


            // top-left: CK info
            var box = {
                left: 1.8,
                top: 3.4,
                fontSize: 12,
                fontStyleData: 'normal'
            };
            doc.setFontType(box.fontStyleData);
            doc.setFontSize(box.fontSize);
            doc.setTextColor(0,105,170);
            doc.text(box.left, box.top+0.5, "sales@consciouskombucha.com");
            doc.setTextColor(0,0,0);
            doc.text(box.left, box.top+1.0, "Conscious Kombucha, Inc.");
            doc.text(box.left, box.top+1.5, "707 Cathedral Pointe LN");
            doc.text(box.left, box.top+2.0, "Santa Barbara, CA 93111");


            // top-right: invoice info
            box = {
                left: 11.3,
                top: box.top+0.4,
                fontSize: 12,
                fontStyleLabel: 'normal'
            };
            doc.setFontType(box.fontStyleLabel);
            doc.setFontSize(box.fontSize);
            doc.text(box.left, box.top+0.5, "Invoice Date:");
            doc.text(box.left, box.top+1.0, "Delivery Date:");
            doc.text(box.left, box.top+1.5, "Due:");

            doc.text(box.left+3.3, box.top+0.5, String(self.requestedDeliveryDate()));
            doc.text(box.left+3.3, box.top+1.0, String(self.actualDeliveryDate()));
            doc.text(box.left+3.3, box.top+=1.5, "$"+String(self.total));

            // top-right: invoice info
            box = {
                left: 1.8,
                top: box.top+1.5,
                fontSize: 12,
                fontStyleLabel: 'bold',
                fontStyleData: 'normal'
            };
            doc.setFontType(box.fontStyleLabel);
            doc.setFontSize(box.fontSize);
            doc.setTextColor(0,105,170);
            doc.text(box.left, box.top, "Client:");

            doc.setFontType(box.fontStyleData);
            doc.setTextColor(0,105,170);
            doc.text(box.left, box.top+0.5, String(venue.email) || 'no email address');
            doc.setTextColor(0,0,0);
            doc.text(box.left, box.top+1.0, String(venue.name));
            doc.text(box.left, box.top+=1.5, String(venue.address));



            // function for drawing table rows
            var drawRow = function(left, top, height){
                doc.rect(left, top, 1.3, height, 'stroke');
                doc.rect(left+1.3, top, 10, height, 'stroke');
                doc.rect(left+1.3+10, top, 2.5, height, 'stroke');
                doc.rect(left+1.3+10+2.5, top, 3.6, height, 'stroke');
            }

            box = {
                left: 1.8,
                top: box.top+0.5,
                fontSize: 12,
                fontStyleLabel: 'bold',
                fontStyleData: 'normal'
            };
            doc.setLineWidth(0.03);
            doc.setDrawColor(0, 105, 170);

            drawRow(box.left, box.top, 0.8);

            /*doc.table(box.left, box.top, 17.4, 6, {
                headers: ['one', 'two', 'three'],
                content: [
                    ['val', 'val', 'val'],
                    ['row 2', 'etc', 'etc']
                ]
            });*/



            // output the complete pdf invoice
            doc.output('dataurlnewwindow');
        });

    };

	_.extend(this, Model);
	this.extend(doc);

    return this;
};
