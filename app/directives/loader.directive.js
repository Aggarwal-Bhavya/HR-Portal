///<reference path="../app.js" />

app.directive('loader', function () {
    function link(scope, element, attrs) {
        scope.$watch(attrs.isLoading, function (value) {
            if (value) {
                element.show();
            }
            else {
                element.hide();
            }
        })
    }

    return {
        restrict: 'E',
        replace: true,
        template: '<div class="loader"><img src="./infinity-loader.gif"></div>',
        link: link
    }
})