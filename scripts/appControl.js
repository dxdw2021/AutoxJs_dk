// 应用控制模块

module.exports = {
    // 检查并请求必要权限
    checkAndRequestPermissions: function() {
        // 检查无障碍服务
        if (!auto.service) {
            toast("请开启无障碍服务");
            auto.waitFor();
        }
        
        // 检查悬浮窗权限
        if (!floaty.checkPermission()) {
            toast("请开启悬浮窗权限");
            floaty.requestPermission();
        }
    },

    // 启动指定应用
    startApp: function(packageName) {
        try {
            app.launch(packageName);
            sleep(3000); // 等待应用启动
            return true;
        } catch (e) {
            console.error("启动应用失败：" + e);
            return false;
        }
    }
};
