Ext.define('Cal.controller.Main', {
    extend: 'Ext.app.Controller',

    config: {
        refs: {
            calendar: 'ux-calendar',
            datebar: '[role=datebar]'
        },
        control: {
            calendar: {
                datepick: 'onDatePick'
            }
        }
    },

    onDatePick: function(calendar, date) {
        this.getDatebar().setTitle(Ext.Date.format(date, 'l, F jS'));
    }
});