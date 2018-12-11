// angular.module('hrchatbotAdminApp')
//     .directive('draggable', function($document){
//         return function(scope, element, attr) {
//             var startX = 0, startY = 0, x = 0, y = 0;
//             var e = element.parent();
//             e.css('border-radius', '0');
//             element= element.parent().parent();
//             element.css({
//                 "position": 'absolute',
//                 "cursor": 'move',
//                 "width": '400px',
//                 "z-index": '1050',
//                 "right": "20px"
//             });
//             element.draggable();
//         };
//     });


angular.module('hrchatbotAdminApp').directive('onFinishRender',['$timeout', '$parse', function ($timeout, $parse) {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            if (scope.$last === true) {
                $timeout(function () {
                    scope.$emit('ngRepeatFinished'); //事件通知
                });
            }
        }
    }
}])