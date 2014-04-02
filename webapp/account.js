

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

    this.weeklyDays = []; // 0 - 6
    this.weeklyGap = 0; // 1 to leave 1 week between weeks, 2 to leave 2 etc (for fortnightly, every 4 weeks etc)

    this.monthlyDates = []; // -1 - 30 (-1 = last)
    this.monthlyGap = 0;
    this.specificMonthlyWeek; // 1st, 2nd ... last week in month
    this.specificMonthlyWeekDays = []; // 0 - 6

    // Expiration
    this.repeatDays; // 10 days
    this.repeatWeeks; // 3 weeks
    this.repeatMonths; // 2 months
    this.repeatYears; // 10 years

    this.endDate;
}

PaymentSchedule.prototype = {

    set: function (property, value) {
        this[property] = value;
    },

    get: function (property) {
        return this[property];
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

        if ( this.repeatDays ) {

            info += " This schedule expires after " + this.repeatDays + " days.";

        } else if ( this.repeatWeeks ) {

            info += " This schedule expires after " + this.repeatWeeks + " weeks.";

        } else if ( this.repeatMonths ) {

            info += " This schedule expires after " + this.repeatMonths + " months.";

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

var phoneSchedule = phone.addPaymentSchedule();

phoneSchedule.set('amount', 99.99);
phoneSchedule.set('startDate', new Date());
phoneSchedule.set('description', 'This and next 2 months on the 12th');
phoneSchedule.set('monthlyDates', [12]);
phoneSchedule.set('repeatMonths', 2);

var paySchedule = phone.addPaymentSchedule();
paySchedule.set('amount', 22.15);
paySchedule.set('startDate', new Date());
paySchedule.set('description', 'Every 2 weeks on Mon + Weds for the next 8 months');
paySchedule.set('weeklyDays', [1, 3]);
paySchedule.set('weeklyGap', 1); // 1 week gap between weeks
paySchedule.set('repeatMonths', 8);

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

console.log(monthlyBill.toString());

var getDebug = function () {

    return [phone];
}





var getDates = function () {

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


module.exports = {

    getDebug: getDebug,
    getDays: getDays
};
