Ext.define('Ext.ux.Calendar', {
    extend: 'Ext.Container',

    alias: 'widget.ux-calendar',

    config: {
        cls: 'x-ux-calendar',

        /**
         * @cfg {Date/String} startDate By default the calendar will render months starting from
         * 12 months ago. By setting this configuration you can alter this. Can be a Date instance
         * or a string that complies with the configured {@link #dateFormat}.
         */
        startDate: new Date((new Date()).getTime() - 365 * 24 * 60 * 60 * 1000),

        /**
         * @cfg {Date/String} endDate By default the calendar months up until 12 months from now.
         * By setting this configuration you can alter this. Can be a Date instance or a string that
         * complies with the configured {@link #dateFormat}.
         */
        endDate: new Date((new Date()).getTime() + 365 * 24 * 60 * 60 * 1000),

        /**
         * @cfg {Date/String} selectedDate The currently selected date in the calendar. Can be a Date
         * instance or a string that complies with the configured {@link #dateFormat}.
         */
        selectedDate: null,

        /**
         * @cfg {String} dateFormat The format that this component uses when dealing with string dates.
         * For example if you set the startDate to '23-05-1986' instead of a Date instance then you should
         * set this to 'm-d-Y'. Again this might be useful for localization purposes.
         */
        dateFormat: 'm-d-Y',

        /**
         * @cfg {Array} dayNames An array with the shorthands for the days in the week.
         * A reason to change this would be for localization.
         */
        dayNames: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],

        /**
         * @cfg {Boolean} pickOnHighlight Set this to true if you want the datepick event to be
         * fired whenever a day is highlighted. Note that setting this to true might cause the
         * event to be fired more often, so make sure that you don't perform very heavy operations
         * in the handler for the datepick event when you enable this confi.
         */
        pickOnHighlight: false,

        /**
         * @cfg {String} highlightedCls The CSS class set on the currently highlighted cell.
         */
        highlightedCls: 'x-ux-calendar-day-highlighted',

        /**
         * @cfg {String} highlightedCls The CSS class set on the currently highlighted cell.
         */
        selectedCls: 'x-ux-calendar-day-selected',

        /**
         * @cfg {String} tpl We create a template that renders all the months and days based
         * on the generated data property. This should not be changed unless you understand
         * how this works and have a good reason to change this.
         * @private
         */
        tpl: [
            '<tpl for=".">',
                '<div class="x-ux-calendar-month" data-month="{value:date("m-Y")}">',
                    '<h1>{value:date("M Y")}</h1>',
                    '<table>',
                        '<tr><tpl for="dayNames"><th>{.}</th></tpl></tr>',
                        '<tpl for="weeks"><tr><tpl for=".">',
                            '<td data-day="{value}" class="',
                                '<tpl if="outOfMonth">x-ux-calendar-day-special </tpl>',
                                '<tpl if="today">x-ux-calendar-day-today </tpl>',
                                '<tpl if="selected">x-ux-calendar-day-selected </tpl>',
                                '">{value}</td>',
                        '</tpl></tr></tpl>',
                    '</table>',
                '</div>',
            '</tpl>'
        ],

        /**
         * @cfg {Array} data We set this to undefined to ensure that the applyData method is being called
         * on instantiation. In applyData we generate the required datastructure for the tpl based on the
         * startDate, endDate and selectedDate. Like tpl, this configuration should never been set directly.
         * @private
         */
        data: undefined,

        /**
         * We set the ui of the scroller indicators to light because the component has a dark background by default.
         */
        scrollable: {
            indicatorsUi: 'light'
        }
    },

    applyStartDate: function(startDate) {
        if (Ext.isString(startDate)) {
            startDate = Ext.Date.parse(startDate, this.getDateFormat());
        }
        return startDate;
    },

    applyEndDate: function (endDate) {
        if (Ext.isString(endDate)) {
            endDate = Ext.Date.parse(endDate, this.getDateFormat());
        }
        return endDate;
    },

    applySelectedDate: function (selectedDate) {
        if (Ext.isString(selectedDate)) {
            selectedDate = Ext.Date.parse(selectedDate, this.getDateFormat());
        }
        return selectedDate;
    },

    applyData: function() {
        var startDate = this.getStartDate(),
            endDate = this.getEndDate(),
            dayNames = this.getDayNames(),
            selectedDate = this.getSelectedDate(),
            today = new Date(),
            todayMonth = Ext.Date.format(today, 'mY'),
            todayDay = today.getDate(),
            loopDate = startDate,
            months = [],
            lastMonthDate, weeks, i, ln, week,
            currentMonth, day, selectedMonth, selectedDay;

        if (selectedDate) {
            selectedMonth = Ext.Date.format(selectedDate, 'mY');
            selectedDay = selectedDate.getDate();
        }

        while (loopDate <= endDate) {
            week = [];
            weeks = [week];

            currentMonth = Ext.Date.format(loopDate, 'mY');

            // We get the last date in the previous month and add days to the days array until we get to
            // the last Sunday in that month
            lastMonthDate = Ext.Date.getLastDateOfMonth(Ext.Date.add(loopDate, Ext.Date.MONTH, -1));
            while (lastMonthDate.getDay() != 6) {
                week.unshift({
                    value: lastMonthDate.getDate(),
                    outOfMonth: true
                });
                lastMonthDate = Ext.Date.add(lastMonthDate, Ext.Date.DAY, -1);
                if (week.length == 7) {
                    week = [];
                    weeks.push(week);
                }
            }

            // Now we add all the days for the current month
            for (i = 1, ln = Ext.Date.getDaysInMonth(loopDate); i <= ln; i++) {
                day = {
                    value: i,
                    outOfMonth: false
                };
                if (todayMonth == currentMonth && todayDay == i) {
                    day.today = true;
                }
                if (selectedDate && (selectedMonth == currentMonth) && (selectedDay == i)) {
                    day.selected = true;
                }
                week.push(day);
                if (week.length == 7) {
                    week = [];
                    weeks.push(week);
                }
            }

            // Finally we fill up the array with the remaining days till Saturday
            if (week.length > 0) {
                for (i = 1, ln = 7 - week.length; i <= ln; i++) {
                    week.push({
                        value: i,
                        outOfMonth: true
                    });
                }
            }

            months.push({
                value: new Date(loopDate.getTime()),
                weeks: weeks,
                dayNames: dayNames
            });
            loopDate = Ext.Date.add(loopDate, Ext.Date.MONTH, 1);
        }

        return months;
    },

    initialize: function () {
        this.callParent(arguments);

        this.on({
            painted: 'onPainted'
        });

        this.on({
            element: 'innerElement',

            // Delegate to only fire these events when they happen on cells
            delegate: 'td',

            // On touchstart we highlight the cell
            touchstart: 'onDayTouchStart',

            // On tap we want to pick the day
            tap: 'onDayTap',

            // On longpress we want to set a flag to indicate we are dragpicking days
            // instead of scrolling
            longpress: 'onDayLongPress'
        });

        this.on({
            element: 'innerElement',

            // On touch end we want to remove the current highlight and clean up
            touchend: 'onTouchEnd',

            // On dragstart we want to prevent the scroller from scrolling if we have
            // longpressed a day before the drag
            dragstart: 'onDayDragStart'
        });
    },

    onDayTouchStart: function(e) {
        this.setHighlightedCell(e.getTarget('td'));
    },

    onDayLongPress: function () {
        this.isLongPressingDate = true;
        this.on({
            element: 'element',
            drag: 'onDayDrag'
        });
    },

    onDayDragStart: function(e) {
        if (this.isLongPressingDate) {
            e.stopPropagation();
        } else {
            this.setHighlightedCell(null);
        }
    },

    onDayDrag: function(e) {
        var target = e.event.target;
        if (target && target.tagName.toLowerCase() === 'td') {
            this.setHighlightedCell(target);
        }
    },

    onDayTap: function(e) {
        this.setSelectedCell(e.getTarget('td'));
    },

    onTouchEnd: function() {
        if (this.highlightedCell) {
            this.setSelectedCell(this.highlightedCell);
            this.setHighlightedCell(null);
        }

        if (this.isLongPressingDate) {
            this.un({
                element: 'innerElement',
                drag: 'onDayDrag'
            });
            this.isLongPressingDate = false;
        }
    },

    onPainted: function () {
        var currentDate = new Date(),
            currentMonthElement = this.getMonthElementByDate(currentDate),
            monthOffset = currentMonthElement.dom.offsetTop;
        this.getScrollable().getScroller().scrollTo(0, monthOffset);
    },

    pickDate: function (date) {
        this.fireEvent('datepick', this, date);
    },

    pickDateByCell: function (cell) {
        this.pickDate(this.getDateByCell(cell));
    },

    updateSelectedDate: function(newDate) {
        this.setSelectedCell(newDate ? this.getDayElementByDate(newDate) : null);
    },

    setSelectedCell: function(cell) {
        var selectedCls = this.getSelectedCls();
        cell = Ext.get(cell);
        if (cell && cell === this.selectedCell) {
            return;
        }

        if (this.selectedCell) {
            this.selectedCell.removeCls(selectedCls);
        }

        if (cell) {
            cell.addCls(selectedCls);
            if (!this.getPickOnHighlight()) {
                this.pickDateByCell(cell);
            }
        }
        this.selectedCell = cell;
    },

    setHighlightedCell: function(cell) {
        var highlightedCls = this.getHighlightedCls();
        cell = Ext.get(cell);
        if (cell === this.highlightedCell) {
            return;
        }
        if (this.highlightedCell) {
            this.highlightedCell.removeCls(highlightedCls);
        }
        if (cell) {
            cell.addCls(highlightedCls);
            if (this.getPickOnHighlight()) {
                this.pickDateByCell(cell);
            }
        }
        this.highlightedCell = cell;
    },

    getDateByCell: function(cell) {
        var day = cell.getAttribute('data-day'),
            month = cell.up('div.x-ux-calendar-month').getAttribute('data-month');

        return Ext.Date.parse(day + '-' + month, 'j-m-Y');
    },

    getMonthElementByDate: function (date) {
        return this.innerElement.down('div[data-month="' + Ext.Date.format(date, 'm-Y') + '"]');
    },

    getDayElementByDate: function(date) {
        return this.innerElement.down('div[data-month="' + Ext.Date.format(date, 'm-Y') + '"] td[data-day="' + date.getDate() + '"]');
    }
});