

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
    this.monthlySpecific = []; // 1st, 2nd ... last week in month
    this.monthlySpecificDays = []; // 0 - 6

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
            exp = new Date( self.startDate.getTime() );

        if ( self.endDate ) {

            return new Date( self.endDate.getTime() );
        }

        if ( self.forDays ) {

            exp.setDate( exp.getDate() + self.forDays );
            return exp;
        }

        if ( self.forWeeks ) {

            exp.setDate( exp.getDate() + self.forWeeks * 7 );
            return exp;
        }

        if ( self.forMonths ) {

            exp.setMonth( exp.getMonth() + self.forMonths );
            return exp;
        }

        if ( self.forYears ) {

            exp.setFullYear( exp.getFullYear() + self.forYears );
            return exp;
        }

        return false;
    },

    getDailyPayments: function (limit, startDate) {

        var self = this,
            expDate = self.getExpiryDate(),
            payments = [],
            dayIterator;

        startDate = startDate || self.startDate;

        // Define iterator to loop through days
        dayIterator = new Date( startDate.getTime() );

        while ( limit > 0 ) {

            if ( expDate && dayIterator > expDate ) {
                limit = 0;
                continue;
            }

            payments.push({
                date: new Date( dayIterator.getTime() ),
                amount: self.amount
            });

            limit--;

            dayIterator.setDate( dayIterator.getDate() + 1 );
        }

        return payments;
    },

    getWeeklyPayments: function (limit, startDate) {

        var self = this,
            expDate = self.getExpiryDate(),
            payments = [],
            weekIterator;

        startDate = startDate || self.startDate;

        weekIterator = new Date( startDate.getTime() );

        // Set to sunday before start date
        weekIterator.setDate( weekIterator.getDate() - weekIterator.getDay() );

        // Loop through repetitions
        while ( limit > 0 ) {

            if ( expDate && weekIterator > expDate ) {
                limit = 0;
                continue;
            }

            self.weeklyDays.forEach(function (day, index) {

                if (limit > 0) {

                    var dayDate = new Date( weekIterator.getTime() );
                    dayDate.setDate( dayDate.getDate() + day );

                    if ( dayDate >= startDate ) {

                        payments.push({
                            date: dayDate,
                            amount: self.amount
                        });

                        limit--;
                    }
                }
            });

            weekIterator.setDate( weekIterator.getDate() + 7 + ( self.weeklyGap * 7 ) );
        }

        return payments;
    },

    getMonthlyPayments: function (limit, startDate) {

        var self = this,
            expDate = self.getExpiryDate(),
            payments = [],
            monthIterator;

        startDate = startDate || self.startDate;

        monthIterator = new Date( startDate.getTime() );
        monthIterator.setDate( 0 );

        // Loop through repetitions
        while (limit > 0) {

            if ( expDate && monthIterator > expDate ) {
                limit = 0;
                continue;
            }

            self.monthlyDates.forEach(function (date, index) {

                if (limit > 0) {

                    var dateDate = new Date( monthIterator.getTime() );

                    if ( date === -1 ) {

                        // Jump to next month + remove 1 day
                        dateDate.setMonth( dateDate.getMonth() + 1 );
                        dateDate.setDate( 0 );

                    } else {

                        dateDate.setDate( dateDate.getDate() + date );
                    }

                    if ( dateDate >= startDate ) {

                        payments.push({
                            date: dateDate,
                            amount: self.amount
                        });

                        limit--;
                    }
                }
            });

            // Set to the 1st of this month
            monthIterator.setDate( 1 );

            // Increment month
            monthIterator.setMonth( monthIterator.getMonth() + 1 + self.monthlyGap );

            // Go extra month ahead and jump back 1 day end of correct month
            monthIterator.setMonth( monthIterator.getMonth() + 1 );
            monthIterator.setDate( 0 );
        }

        return payments;
    },

    getSpecificMonthlyPayments: function (limit, startDate) {

        var self = this,
            expDate = self.getExpiryDate(),
            payments = [],
            monthIterator,
            weekIterator,
            monthDatePool = {},
            sameMonth,
            potentialDay,
            payment;

        startDate = startDate || self.startDate;

        // Loop through months

        monthIterator = new Date( startDate.getTime() );

        while ( limit > 0 ) {

            // Go to start of whatever week we're in
            weekIterator = new Date( monthIterator.getTime() );
            weekIterator.setDate( weekIterator.getDate() - weekIterator.getDay() );

            sameMonth = true;

            while ( limit > 0 && sameMonth ) {

                // Loop through and add days
                self.monthlySpecificDays.forEach(function (day, index) {

                    monthDatePool[day] = monthDatePool[day] || [];

                    potentialDay = new Date( weekIterator.getTime() );
                    potentialDay.setDate( potentialDay.getDate() + day );

                    if ( potentialDay.getMonth() === monthIterator.getMonth() ) {

                        if ( potentialDay >= startDate ) {

                            monthDatePool[day].push({
                                date: potentialDay,
                                amount: self.amount
                            });
                        }

                    } else {

                        sameMonth = false;
                    }
                });

                // Increment iterator
                weekIterator.setDate( weekIterator.getDate() + 7 );
            }

            // Pick the dates we want using their index
            self.monthlySpecific.forEach(function (occurance) {

                self.monthlySpecificDays.forEach(function (day) {

                    if ( limit > 0 ) {

                        payment = null;

                        if (occurance === -1) {

                            payment = monthDatePool[day][monthDatePool[day].length -1];

                        } else if ([1,2,3,4].indexOf(occurance) !== -1) {

                            payment = monthDatePool[day][occurance-1];
                        }

                        if (payment) {

                            payments.push( payment );
                            limit--;
                        }
                    }
                });
            });

            // Increase iterator by 1
            monthIterator.setMonth( monthIterator.getMonth() + 1 );
        }

        return payments;
    },

    getOneOffPayment: function (startDate) {

        var self = this,
            payments = [];

        // Kick back before adding anything if custom start date
        // is after the date of this one off
        if ( self.startDate < startDate ) return payments;

        payments.push({
            date: new Date( self.startDate.getTime() ),
            amount: self.amount
        });

        return payments;
    },

    getPayments: function (limit, startDate) {

        var self = this,
            payments = [],
            expDate = self.getExpiryDate();

        limit = limit || 1;

        if ( self.daily ) {

            payments = self.getDailyPayments(limit, startDate);

        } else if ( self.weeklyDays.length ) {

            payments = self.getWeeklyPayments(limit, startDate);

        } else if ( self.monthlyDates.length ) {

            payments = self.getMonthlyPayments(limit, startDate);

        } else if ( self.monthlySpecific.length && self.monthlySpecificDays.length ) {

            payments = self.getSpecificMonthlyPayments(limit, startDate);

        } else {

            payments = self.getOneOffPayment(startDate);
        }

        return payments;
    }
};

var phone = new Account();

phone.set('vendorName', 'O2');
phone.set('description', 'Phone bill and that');

var internet = new Account("SKY", "Phone, broadband and TV");

var weeklyPayments = internet.addPaymentSchedule();
weeklyPayments.set('amount', 11.97);
weeklyPayments.set('startDate', new Date(2014, 3, 4));
weeklyPayments.set('description', 'Every week on tuesday');
weeklyPayments.set('weeklyDays', [2]);

var secondWeekPayments = internet.addPaymentSchedule();
secondWeekPayments.set('amount', 22.55);
secondWeekPayments.set('startDate', new Date(2014, 3, 4));
secondWeekPayments.set('description', 'Every 1st and last tues and thurs of the month');
secondWeekPayments.set('monthlySpecific', [1, -1]);
secondWeekPayments.set('monthlySpecificDays', [2, 4]);

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

    return [internet];
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

var getDerPayments = function (schedule, limit, startDate) {

    return schedule.getPayments(limit, startDate);
}

module.exports = {

    getDebug: getDebug,
    getDays: getDays,
    getMonths: getMonths,
    getDerPayments: getDerPayments
};
