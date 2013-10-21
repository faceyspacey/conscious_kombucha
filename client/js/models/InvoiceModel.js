
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
        payment_failed: false,
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
		Meteor.call('sendCustomerEmail', this.user().getEmail(), 'Message sent in regards to Order #'+this.order_num, 'Your message: <br/><br/>'+message, function(err, res){});
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

    this.typeName = function() {
        if(this.type == 'one_off') return 'One Off Order';
        else return 'Subscription ('+moment(this.requested_delivery_date).format('ddd')+')'; //this.payment_cycle.substr(0, 1).toUpperCase() + this.payment_cycle.substr(1)
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
            venue = this.venue(),
            imgs = {top: '/images/invoice/top-logo.jpeg'};

        /*
        _.each(this.invoiceItems().fetch(), function(item){
            imgs[item.flavor_id] = item.flavor_icon;
        });*/

        // generation needs to be in callback to get the fully loaded logo
        getImagesFromUrls(imgs, function(allImgData){
            var doc = new jsPDF('portrait', 'mm', 'a4');

            console.log(allImgData);

            // frame for the invoice
            doc.setLineWidth(0.7);
            doc.setDrawColor(0, 105, 170);
            doc.rect(10, 10, 190, 277, 'stroke');


            // top-right: ConsciousKombucha logo
            doc.addImage(allImgData.top, 'JPEG', 104.5, 10.7, 95, 26.8);


            // top-left: INVOICE #
            doc.setFont("helvetica");
            doc.setFontType('bold');
            doc.setFontSize(26);
            doc.setTextColor(0,105,170);
            doc.text(18, 28, "INVOICE #" + self.order_num);


            // top-left: CK info
            var box = {
                left: 18,
                top: 34,
                fontSize: 12,
                fontStyleData: 'normal'
            };
            doc.setFontType(box.fontStyleData);
            doc.setFontSize(box.fontSize);
            doc.setTextColor(0,105,170);
            doc.text(box.left, box.top+5, "sales@consciouskombucha.com");
            doc.setTextColor(0,0,0);
            doc.text(box.left, box.top+10, "Conscious Kombucha, Inc.");
            doc.text(box.left, box.top+15, "707 Cathedral Pointe LN");
            doc.text(box.left, box.top+20, "Santa Barbara, CA 93111");


            // top-right: invoice info
            box = {
                left: 113,
                top: box.top+4,
                fontSize: 12,
                fontStyleLabel: 'normal'
            };
            doc.setFontType(box.fontStyleLabel);
            doc.setFontSize(box.fontSize);
            doc.text(box.left, box.top+5, "Invoice Date:");
            doc.text(box.left, box.top+10, "Delivery Date:");
            doc.text(box.left, box.top+15, "Due:");

            doc.text(box.left+33, box.top+5, String(self.requestedDeliveryDate()));
            doc.text(box.left+33, box.top+10, String(self.actualDeliveryDate()));
            doc.text(box.left+33, box.top+=15, "$"+String(self.total));

            // top-right: invoice info
            box = {
                left: 18,
                top: box.top+15,
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
            doc.text(box.left, box.top+5, ['', 'undefined'].indexOf(String(venue.email)) == -1 ? String(venue.email) : 'No email address given.');
            doc.setTextColor(0,0,0);
            doc.text(box.left, box.top+10, String(venue.name));
            doc.text(box.left, box.top+=15, String(venue.address));



            // function for drawing table rows
            var drawRow = function(left, top, height){
                //doc.rect(left, top, 174, height, 'stroke');
                doc.rect(left, top, 13, height, 'stroke');
                doc.rect(left+13, top, 110, height, 'stroke');
                doc.rect(left+13+110, top, 25, height, 'stroke');
                doc.rect(left+13+110+25, top, 26, height, 'stroke');
            }

            box = {
                left: 18,
                top: box.top+5,
                fontSize: 12,
                fontSizeLabel: 13,
                fontStyleLabel: 'normal'
            };
            doc.setLineWidth(0.4);
            doc.setDrawColor(0, 105, 170);

            drawRow(box.left, box.top, 10);
            doc.setLineWidth(1);
            drawRow(box.left, box.top+10, 0.1);

            doc.setFontType(box.fontStyleLabel);
            doc.setFontSize(box.fontSizeLabel);
            doc.setTextColor(0,105,170);
            doc.text(box.left+1, box.top+7, "Units");
            doc.text(box.left+2+13, box.top+7, "Details");
            doc.text(box.left+7+13+110, box.top+7, "Rate");
            doc.text(box.left+4+13+110+25, box.top+7, "Subtotal");

            box.top+=2;
            doc.setFontSize(box.fontSize);
            doc.setTextColor(0,0,0);
            doc.setLineWidth(0.15);


            var items = self.invoiceItems().fetch();
            var pages = parseInt(items.length/22)+1;
            _.each(items, function(item){
                drawRow(box.left, box.top+=8, 8);
                doc.text(box.left+1, box.top+5.7, String(item.quantity));
                doc.text(box.left+2+13, box.top+5.7, String(item.name));
                /*doc.rect(box.left+2+13+60, box.top+1.6, 5, 5, 'stroke');
                doc.addImage(allImgData[item.flavor_id], 'PNG', box.left+2+13+60, box.top+1.6, 5, 5);*/
                /*getImageFromUrl(String(item.flavor_icon), function(imgData){
                    doc.addImage(imgData, 'JPEG', box.left+2+13+60, box.top, 16, 16);
                });*/
                var rateWidth = doc.getStringUnitWidth('$'+String(item.rate))*box.fontSize/(72/25.4);
                doc.text(box.left+2+13+62.5, box.top+5.7, String(item.flavor_name));
                doc.text(box.left+13+110+25-rateWidth-2, box.top+5.7, '$'+String(item.rate));
                var subtotalWidth = doc.getStringUnitWidth('$'+String(item.getSubtotal()))*box.fontSize/(72/25.4);
                doc.text(box.left+13+110+25+26-subtotalWidth-2, box.top+5.7, '$'+String(item.getSubtotal()));
            });


            doc.setLineWidth(0.5);
            drawRow(box.left, box.top+=8, 0.1);
            /*doc.setLineWidth(0.3);
            doc.rect(left+13+110, box.top, 25, height, 'stroke');
            doc.rect(left+13+110+25, box.top, 26, height, 'stroke');*/



            doc.setFontType('bold');
            doc.setFontSize('14');
            doc.setTextColor(0,105,170);
            doc.text(box.left+5+13+110, box.top+7, 'Total:');
            doc.setTextColor(0,0,0);
            var subtotalWidth = doc.getStringUnitWidth('$'+String(self.total))*box.fontSizeLabel/(72/25.4);
            doc.text(box.left+13+110+25+26-subtotalWidth-2, box.top+6.5, '$'+String(self.total));


            // output the complete pdf invoice
            doc.output('dataurlnewwindow');
        });

    };

	_.extend(this, Model);
	this.extend(doc);

    return this;
};
