///<reference path="../app.js" />

app.directive('monthYearSelector', function () {
    function link(scope, element, attrs) {
        scope.selectedMonth = moment().format('MMMM');
        scope.selectedYear = moment().format('YYYY');

        scope.incrementMonth = function () {
            var nextMonth = moment(scope.selectedMonth + ' ' + scope.selectedYear, 'MMMM YYYY').add(1, 'month');
            scope.selectedMonth = nextMonth.format('MMMM');
            scope.selectedYear = nextMonth.format('YYYY');
            scope.onMonthYearChange({ month: scope.selectedMonth, year: scope.selectedYear });
        }

        scope.decrementMonth = function () {
            var prevMonth = moment(scope.selectedMonth + ' ' + scope.selectedYear, 'MMMM YYYY').subtract(1, 'm');
            scope.selectedMonth = prevMonth.format('MMMM');
            scope.selectedYear = prevMonth.format('YYYY');

            scope.onMonthYearChange({ month: scope.selectedMonth, year: scope.selectedYear });
        }
    }

    return {
        restrict: 'E',
        scope: {
            onMonthYearChange: '&'
        },
        template: '<div class="month-year-selector">' +
            '<button ng-click="decrementMonth()" class="month-year-btn">&lt;</button>' +
            '<span>{{ selectedMonth }} {{ selectedYear }}</span>' +
            '<button ng-click="incrementMonth()" class="month-year-btn">&gt;</button>' +
            '</div>',
        link: link
    }
})