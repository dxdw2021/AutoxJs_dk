// 主程序入口

// 导入所需模块
const { clickByText, clickById, clickByCoord, waitAndClick } = require('./clickUI.js');
const { startApp, closeApp, checkAndRequestPermissions } = require('./appControl.js');
const { createExampleScheduler } = require('./scheduler.js');

// 示例配置
const CONFIG = {
    targetApp: {
        packageName: "com.example.app", // 替换为实际的应用包名
        mainActivityName: "com.example.app.MainActivity"
    },
    // 自定义配置项
    delay: {
        short: 1000,
        medium: 3000,
        long: 5000
    }
};

/**
 * 主程序
 */
function main() {
    // 检查权限
    checkAndRequestPermissions();

    // 显示欢迎信息
    toast("自动化脚本开始运行");
    console.show();
    console.log("脚本初始化中...");

    // 创建定时任务调度器
    const scheduler = createExampleScheduler();

    // 添加自定义任务示例
    scheduler.addTask(
        "自动签到任务",
        () => {
            performAutoSignIn();
        },
        24 * 60 * 60 * 1000 // 每24小时执行一次
    );

    // 启动调度器
    scheduler.start();

    // 设置退出监听
    events.on("exit", function () {
        console.log("脚本即将退出");
        scheduler.stop();
    });
}

/**
 * 自动签到流程示例
 */
function performAutoSignIn() {
    try {
        // 启动目标应用
        console.log("正在启动应用...");
        if (!startApp(CONFIG.targetApp.packageName)) {
            throw new Error("应用启动失败");
        }
        sleep(CONFIG.delay.medium);

        // 等待并点击"签到"按钮
        console.log("查找签到按钮...");
        if (!waitAndClick("text", "签到", CONFIG.delay.long)) {
            throw new Error("未找到签到按钮");
        }
        sleep(CONFIG.delay.short);

        // 确认签到结果
        if (textContains("签到成功").findOne(CONFIG.delay.medium)) {
            console.log("签到成功");
        } else {
            console.log("可能已经签到过了");
        }

        // 返回首页
        back();
        sleep(CONFIG.delay.short);

    } catch (e) {
        console.error("签到过程出错：" + e);
    } finally {
        // 关闭应用
        closeApp(CONFIG.targetApp.packageName);
    }
}

/**
 * 处理异常情况
 */
function handleException(e) {
    console.error("发生异常：" + e);
    // 截图保存异常现场
    const screenshot = images.captureScreen();
    const filename = `/sdcard/autojs/error_${Date.now()}.png`;
    images.save(screenshot, filename);
    console.log("异常现场已保存至：" + filename);
}

// 设置全局异常捕获
try {
    main();
} catch (e) {
    handleException(e);
} finally {
    // 清理工作
    console.hide();
}

// 使用说明
if (!engines.myEngine.source.match(/^ui/)) {
    toast("长按音量上键停止脚本");
}

// 注册音量键监听
events.observeKey();
events.onKeyDown("volume_up", function (event) {
    toast("脚本即将停止");
    engines.stopAll();
});
