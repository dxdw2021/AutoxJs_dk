// 测试企业微信应用控制

// 直接复制 appControl.js 的内容到本文件，避免模块导入问题
// 应用程序控制相关函数

/**
 * 启动指定应用
 * @param {string} packageName 应用包名
 * @param {number} waitTime 等待时间（毫秒）
 * @returns {boolean} 是否启动成功
 */
function startApp(packageName, waitTime = 3000) {
    try {
        // 检查应用是否已经运行
        if (currentPackage() === packageName) {
            console.log("应用已在运行中");
            return true;
        }

        // 启动应用
        app.launch(packageName);

        // 等待应用启动
        sleep(waitTime);

        // 验证是否成功启动
        return currentPackage() === packageName;
    } catch (e) {
        console.error("启动应用失败：" + e);
        return false;
    }
}

/**
 * 关闭指定应用
 * @param {string} packageName 应用包名
 * @returns {boolean} 是否关闭成功
 */
function closeApp(packageName) {
    try {
        // 使用shell命令强制停止应用
        shell("am force-stop " + packageName, true);

        // 等待应用关闭
        sleep(1000);

        // 验证是否成功关闭
        return currentPackage() !== packageName;
    } catch (e) {
        console.error("关闭应用失败：" + e);
        return false;
    }
}

/**
 * 检查应用是否已安装
 * @param {string} packageName 应用包名
 * @returns {boolean} 是否已安装
 */
function isAppInstalled(packageName) {
    return app.getPackageName(packageName) != null;
}

/**
 * 重启应用
 * @param {string} packageName 应用包名
 * @param {number} waitTime 等待时间（毫秒）
 * @returns {boolean} 是否重启成功
 */
function restartApp(packageName, waitTime = 3000) {
    try {
        // 先关闭应用
        closeApp(packageName);
        sleep(1000);

        // 再启动应用
        return startApp(packageName, waitTime);
    } catch (e) {
        console.error("重启应用失败：" + e);
        return false;
    }
}

/**
 * 返回到应用首页
 * @param {number} times 返回次数
 */
function backToHome(times = 3) {
    for (let i = 0; i < times; i++) {
        back();
        sleep(500);
    }
}

/**
 * 检查并申请必要权限
 */
function checkAndRequestPermissions() {
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
}

// 企业微信包名
const WEWORK_PACKAGE = "com.tencent.wework";

// 测试函数
function testAppControl() {
    // 检查权限
    checkAndRequestPermissions();
    
    // 检查企业微信是否已安装
    console.log("检查企业微信是否已安装...");
    if (!isAppInstalled(WEWORK_PACKAGE)) {
        console.error("企业微信未安装！");
        return;
    }
    console.log("企业微信已安装");

    // 启动企业微信
    console.log("正在启动企业微信...");
    if (startApp(WEWORK_PACKAGE)) {
        console.log("企业微信启动成功");
    } else {
        console.error("企业微信启动失败");
        return;
    }

    // 等待5秒
    sleep(5000);

    // 重启企业微信
    console.log("正在重启企业微信...");
    if (restartApp(WEWORK_PACKAGE)) {
        console.log("企业微信重启成功");
    } else {
        console.error("企业微信重启失败");
    }

    // 等待5秒
    sleep(5000);

    // 关闭企业微信
    console.log("正在关闭企业微信...");
    if (closeApp(WEWORK_PACKAGE)) {
        console.log("企业微信关闭成功");
    } else {
        console.error("企业微信关闭失败");
    }
}

// 运行测试
testAppControl();
