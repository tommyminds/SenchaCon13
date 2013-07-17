Ext.Loader.setPath({
    'Ext.ux': 'app/ux'
});

Ext.application({
    name: 'Cal',

    path: {
        'Ext.ux': 'app/ux'
    },

    views: ['Main'],
    controllers: ['Main'],

    requires: ['Ext.ux.Calendar'],

    launch: function() {
        Ext.create('Cal.view.Main');
    }
});