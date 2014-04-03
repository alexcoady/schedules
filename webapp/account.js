

function Account (vendorName, description) {
    this.vendorName = vendorName || "";
    this.description = description || "";
    this.paymentSchedules = [];
}

Account.prototype = {

    set: function (property, value) {
        this[property] = value;
    },

    get: function (property) {
        return this[property];
    },

    addPaymentSchedule: function () {

        var newSchedule = new PaymentSchedule();
        this.paymentSchedules.push(newSchedule);
        return newSchedule;
    }
};

function PaymentSchedule () {

    this.amount = 0;
    this.description = "";
    this.startDate;

    // Repetition
    this.daily; // Every day
    this.dailyGap = 0;

    this.weeklyDays = []; // 0 - 6
    this.weeklyGap = 0; // 1 to leave 1 week between weeks, 2 to leave 2 etc (for fortnightly, every 4 weeks etc)

    this.monthlyDates = []; // -1 - 30 (-1 = last)
    this.monthlyGap = 0;
    // this.specificMonthlyWeek; // 1st, 2nd ... last week in month
    // this.specificMonthlyWeekDays = []; // 0 - 6

    // Expiration
    this.forDays; // 10 days
    this.forWeeks; // 3 weeks
    this.forMonths; // 2 months
    this.forYears; // 10 years

    this.endDate;
}

PaymentSchedule.prototype = {

    set: function (property, value) {
        this[property] = value;
    },

    get: function (property) {
        return this[property];
    },

    getExpiryDate: function () {

        var self = this,
            exp = new Date( this.startDate.getTime() );

        // console.log('Start date', self.amount, self.startDate.toString());

        // If we have an end date, it's this
        if ( this.endDate ) {

            return new Date( this.endDate.getTime() );
        }

        // Repeats
        if ( this.forDays ) {


            exp.setDate( exp.getDate() + this.forDays );
            // console.log('End date (days)', self.amount, exp.toString());
            return exp;
        }

        if ( this.forWeeks ) {

            exp.setDate( exp.getDate() + this.forWeeks * 7 );
            // console.log('End date (weeks)', self.amount, exp.toString());
            return exp;
        }

        if ( this.forMonths ) {

            console.log('Current month', exp.getMonth(), 'Add', this.forMonths);
            exp.setMonth( exp.getMonth() + this.forMonths );

            // console.log('End date (months)', self.amount, exp.toString());
            return exp;
        }

        if ( this.forYears ) {

            exp.setFullYear( exp.getFullYear() + this.forYears );
            // console.log('End date (years)', self.amount, exp.toString());
            return exp;
        }

        return false;
    },

    getPayments: function (limit) {

        var self = this,
            payments = [],
            nextDate,
            currentDate = new Date( self.startDate.getTime() ),
            expDate = self.getExpiryDate();

        limit = limit || 1;

        // First payment is the start date
        // payments.push({
        //     date: currentDate,
        //     amount: self.amount
        // });

        // limit--;

        // Collect results

        // if ( self.daily ) {

        //     nextDate = new Date( currentDate.getTime() );
        //     nextDate.setDate( nextDate.getDate() + 1 + self.dailyGap );

        //     if ( expDate && nextDate > expDate ) return payments;

        //     currentDate = nextDate;

        //     payments.push({
        //         date: nextDate,
        //         amount: self.amount
        //     });
        // }

        if ( self.weeklyDays.length ) {

            var weekIterator = new Date( self.startDate.getTime() );

            // Set to sunday before start date
            weekIterator.setDate( weekIterator.getDate() - weekIterator.getDay() );

            // Loop through repetitions
            while (limit > 0) {

                if ( weekIterator > expDate ) {
                    limit = 0;
                    continue;
                }

                self.weeklyDays.forEach(function (day, index) {

                    if (limit > 0) {

                        console.log('limit now =', limit);

                        var sunday = new Date( weekIterator.getTime() );

                        var dayDate = new Date( sunday.getTime() );
                        dayDate.setDate( dayDate.getDate() + day );

                        if ( dayDate >= self.startDate ) {

                            payments.push({
                                date: dayDate,
                                amount: self.amount
                            });

                            limit--;
                        }
                    }
                });

                weekIterator.setDate( weekIterator.getDate() + 7 + ( self.weeklyGap * 7 ) );
                console.log('limit =', limit);
            }
            console.log('......');


        }


        return payments;
    },

    toString: function () {

        var info = "";

        info += "Amount: " + this.amount + ".";

        // Repetition
        if ( this.daily ) {

            info += " This schedule repeats daily.";

        } else if ( this.weeklyDays.length ) {

            info += " This schedule repeats every " + (this.weeklyGap ? (this.weeklyGap + 1) + " weeks" : "week") + " on ";
            info += this.weeklyDays.join(", ") + ". ";

        } else if ( this.monthlyDates.length ) {

            info += " This schedule repeats every " + (this.monthlyGap ? (this.monthlyGap + 1) + " months" : "month") + " on ";
            info += this.monthlyDates.join(", ") + ". ";

        } else {

            info += " This schedule does not repeat.";
        }

        if ( this.startDate ) {

            info += " Starts on " + this.startDate.getDate() + "/" + this.startDate.getMonth() + "/" + this.startDate.getFullYear() + ".";
        }

        if ( this.forDays ) {

            info += " This schedule expires after " + this.forDays + " days.";

        } else if ( this.forWeeks ) {

            info += " This schedule expires after " + this.forWeeks + " weeks.";

        } else if ( this.forMonths ) {

            info += " This schedule expires after " + this.forMonths + " months.";

        } else if ( this.endDate ) {

            info += " This schedule expires after " + this.endDate.getDate() + "/" + this.endDate.getMonth() + "/" + this.endDate.getFullYear() + ".";

        } else {

            info += " This schedule never expires.";
        }

        return info;
    }
};

var phone = new Account();

phone.set('vendorName', 'O2');
phone.set('description', 'Phone bill and that');

// var phoneSchedule = phone.addPaymentSchedule();

// phoneSchedule.set('amount', 99.99);
// phoneSchedule.set('startDate', new Date(2014, 3, 11));
// phoneSchedule.set('description', 'This and next 2 months on the 12th');
// phoneSchedule.set('monthlyDates', [12]);
// phoneSchedule.set('forMonths', 2);

var paySchedule = phone.addPaymentSchedule();
paySchedule.set('amount', 22.15);
paySchedule.set('startDate', new Date(2014, 3, 2));
paySchedule.set('description', 'Every 2 weeks on Mon + Weds for the next 4 months');
paySchedule.set('weeklyDays', [1, 3]);
paySchedule.set('weeklyGap', 1); // 1 week gap between weeks
paySchedule.set('forMonths', 4);

var christmasBill = phone.addPaymentSchedule();
christmasBill.set('amount', 155);
christmasBill.set('startDate', new Date(2014, 11, 24));
christmasBill.set('description', 'On christmas day forever');
christmasBill.set('monthlyDates', [24]);
christmasBill.set('monthlyGap', 11); // Every 12 months

var monthlyBill = phone.addPaymentSchedule();
monthlyBill.set('amount', 40);
monthlyBill.set('startDate', new Date(2012, 1, 1));
monthlyBill.set('description', 'Last day of each month forever');
monthlyBill.set('monthlyDates', [-1]);

var newBill = phone.addPaymentSchedule();
newBill.set('amount', 30);
newBill.set('startDate', new Date(2012, 1, 1));
newBill.set('description', 'Every friday until date');
newBill.set('weeklyDays', [5]);
newBill.set('endDate', new Date(2014, 8, 8));






var internet = new Account("SKY", "Phone, broadband and TV");

var monthlyPayments = internet.addPaymentSchedule();
monthlyPayments.set('amount', 100);
monthlyPayments.set('startDate', new Date(2013, 9, 1));
monthlyPayments.set('description', '12th of every month for a year');
monthlyPayments.set('monthlyDates', [12]);
monthlyPayments.set('forMonths', 12);

var janOneOff = internet.addPaymentSchedule();
janOneOff.set('amount', 65);
janOneOff.set('startDate', new Date(2014, 1, 15));
janOneOff.set('description', 'One off payment');

var dailyCharge = internet.addPaymentSchedule();
dailyCharge.set('amount', 1.99);
dailyCharge.set('startDate', new Date(2014, 1, 15));
dailyCharge.set('description', 'Daily usage costs 15th until the 20th');
dailyCharge.set('daily', true);
dailyCharge.set('endDate', new Date(2014, 1, 20));




var getDebug = function () {

    return [phone];
}





var getMonths = function () {

    return [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sept",
        "Oct",
        "Nov",
        "Dec"
    ]
}


var getDays = function () {

    return [
        "Sun",
        "Mon",
        "Tues",
        "Weds",
        "Thurs",
        "Fri",
        "Sat"
    ]
}

var getDerPayments = function (schedule, limit) {

    return schedule.getPayments(limit);
}

module.exports = {

    getDebug: getDebug,
    getDays: getDays,
    getMonths: getMonths,
    getDerPayments: getDerPayments
};
