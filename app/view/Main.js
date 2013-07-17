Ext.define('Cal.view.Main', {
    extend: 'Ext.Container',

    config: {
        fullscreen: true,
        layout: 'card',
        items: [{
            xtype: 'ux-calendar',
            docked: 'left',
            pickOnHighlight: true
        }, {
            xtype: 'container',
            items: {
                docked: 'top',
                xtype: 'toolbar',
                role: 'datebar',
                title: 'Select a date...'
            },
            padding: 50,
            html: 'Appointments'
        }]
    }
});