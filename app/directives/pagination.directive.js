///<reference path="../app.js" />

app.directive('pagination', function () {
    function link(scope) {
        scope.$watchGroup(['totalPages', 'currentPage'], function (newValues, oldValues) {
            var totalPages = newValues[0];
            var currentPage = newValues[1];

            
            var pages = [];
            var startPage = Math.max(currentPage - 2, 1);
            var endPage = Math.min(startPage + 4, totalPages);
            if (startPage > 1) {
                pages.push('...');
            }
            for (var i = startPage; i <= endPage; i++) {
                pages.push(i);
            }
            if (endPage < totalPages) {
                pages.push('...');
            }
            scope.pages = pages;
        })
    }

    return {
        restrict: 'E',
        scope: {
            currentPage: '=',
            totalPages: '=',
            onPageChange: '&'
        },
        templateUrl: 'directives/pagination.directive.html',
        link: link
    }
});
