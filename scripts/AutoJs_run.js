// 主运行脚本

// 导入应用控制模块
var appControl = require('./appControl.js');

// 检查必要权限
appControl.checkAndRequestPermissions();

// 启动企业微信
var isSuccess = appControl.startApp("com.tencent.wework");

if (isSuccess) {
    console.log("企业微信启动成功");
} else {
    console.error("企业微信启动失败");
}
