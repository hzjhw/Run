app.run(function ($route, $rootScope, $http, $timeout, $location, API_END_POINT,WEB_DESIGN_URL, WEBSITE_URL,MOBILE_DESIGN_URL, $q, $modal) {
    $rootScope.API_END_POINT = API_END_POINT;
    $rootScope.MOBILE_DESIGN_URL = MOBILE_DESIGN_URL;
    $rootScope.WEB_DESIGN = false; // 是否是设计模式
    $rootScope.WEB_DESIGN_URL = WEB_DESIGN_URL;
    $rootScope.WEBSITE_URL = WEBSITE_URL;


    $rootScope.alerts = [];
    $rootScope.search_key = '';
    $rootScope.closeAlert = function (index) {
        $rootScope.alerts.splice(index, 1);
    };

    /**
     * @description 提示信息
     * @method showMsg
     * @param msg
     * @param opts {String} opts.type ['danger' :红色, warning ：黄色] {Number} opts.time 关闭时间
     * @author wyj on 14/6/3
     * @example
     * $rootScope.showMsg("域名不能重复添加！", {
     *      type : 'warning',
     *      time : 2000
     *  });
     */
    $rootScope.showMsg = function (msg, opts) {
        var opts = opts || {};
        var time = opts.time || 3000;
        $rootScope.alerts.length = 0;
        $rootScope.alerts.push({
            type : opts.type || '',
            msg: msg
        });
        $timeout(function () {
            $rootScope.closeAlert(0);
        }, time);
    };
    // js跳转 url
    $rootScope.jumpUrl = function (url, target){
        if (typeof target !== 'undefined' && target){
            open(url);
        } else{
            location.href = url;
        }
    }
    // ng跳转url
    $rootScope.locationUrl = function(url,page){
        $rootScope.search_key = '';
        $rootScope.current_page = page;
        $location.path(url);
    }
    // 交换
    $rootScope.exchange = Zwt.arrayExchange;
    // 插序
    $rootScope.insert = Zwt.arrayInsert;
    // 字符填充
    $rootScope.pad = function(str){
        return Zwt.pad(str);
    };

    /**
     * @description 对话框
     * @method open
     * @param {String} msg 提示内容
     * @param {Function} action 回调函数
     * @param {Object} opts {String} opts.ok 确定按钮文字 {String} opts.cancel 取消按钮文字
     * @author wyj on 14/6/3
     * @example
     *  $rootScope.open('是否删除图片？', function(){
     *      $http.delete(API_END_POINT + 'album/' + $scope.albumId + 'attr/' + pic.attr_id)
     *      .success(function(){
     *          $scope.pic_list.splice(index, 1);
     *      });
     *  },{ok:'确定', cancel:'取消'});
     */
    $rootScope.open = function (msg, action, opts) {
        var modalInstance = $modal.open({
            templateUrl: 'views/msg.html',
            controller: MsgModelInit,
            resolve: {
                item: function () {
                    return {
                        msg: msg,
                        action: action,
                        opts: opts
                    };
                }
            }
        });
        modalInstance.result.then(function (msg) {
            if (typeof (action) === 'function') {
                action(msg);
            }
        }, function () {
        });
    };
    var MsgModelInit = function ($scope, $modalInstance, item) {
        $scope.ok_text = "确定";
        $scope.cancel_text = "关闭";
        $scope.msg = item.msg;
        if (item.opts) {
            if (item.opts.ok) {
                $scope.show_ok = true;
                $scope.ok_text = item.opts.ok;
            }
            if (item.opts.cancel) {
                $scope.show_cancel = true;
                $scope.cancel_text = item.opts.cancel;
            }
        } else {
            $scope.show_ok = true;
            $scope.show_cancel = true;
        }
        $scope.ok = function () {
            $modalInstance.close($scope.msg);
        };
        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
        if (typeof (item.action) !== 'undefined' && typeof (item.action) !== 'function') {
            $timeout(function () {
                $scope.cancel();
            }, item.action);
        }
    };
    /**
     * @description 通用搜索方法
     * @method search
     * @param {String} search_key 搜索关键词
     * @param {String} url 跳转URL
     * @authr wyj on 14/6/3
     * @example
     *    <input type="text" ng-model="search_key" ng-enter="search(search_key, '/product_list')" />
     */
    $rootScope.search = function(search_key, url){
        $rootScope.search_key = search_key;
        $location.path(url);
        $route.reload();
    }
});
