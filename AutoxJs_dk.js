// 应用控制模块

// 检查并请求必要权限
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

// 启动指定应用
function startApp(packageName) {
    try {
        app.launch(packageName);
        sleep(3000); // 等待应用启动

        // 等待界面加载完成
        let maxWait = 10; // 最大等待10秒
        while (maxWait > 0) {
            if (packageName === "com.tencent.wework") {
                // 使用多个可能的元素来判断
                if (id("home_bottom_tab").exists() ||
                    text("消息").exists() ||
                    text("通讯录").exists() ||
                    text("工作台").exists()) {
                    console.log("企业微信界面加载完成");
                    return true;
                }
            }
            sleep(1000);
            maxWait--;
        }
        if (maxWait <= 0) {
            console.error("等待界面加载超时");
            return false;
        }
        return true;
    } catch (e) {
        console.error("启动应用失败：" + e);
        return false;
    }
}

// 启动企业微信
console.log("开始检查权限...");
checkAndRequestPermissions(); // 先检查必要权限

// 先结束企业微信进程
let packageName = "com.tencent.wework";
console.log("准备清理后台进程...");
// 确保返回到主菜单
for (let i = 0; i < 3; i++) {
    home();
    sleep(500);
}
// 下拉状态栏
swipe(device.width / 2, 0, device.width / 2, device.height * 0.8, 500);
sleep(1000);
console.log("点击一键清理按钮...");
click(414, 1801);
sleep(2000);
// 收起状态栏
swipe(device.width / 2, device.height * 0.8, device.width / 2, 0, 500);
sleep(1000);

// 重新启动企业微信
console.log("开始启动企业微信...");
if (startApp(packageName)) {
    console.log("企业微信启动成功，等待界面稳定...");
    toast("企业微信已成功启动");

    // 点击工作台
    sleep(2000);
    console.log("开始查找工作台按钮...");
    let workbench = className("android.widget.TextView")
        .text("工作台")
        .bounds(648, 2284, 864, 2321)
        .findOne(5000);
    if (workbench) {
        console.log("找到工作台按钮，准备点击...");
        let bounds = workbench.bounds();
        console.log("工作台按钮位置：", bounds);
        click(756, 2302); // 直接点击中心坐标
        console.log("已点击工作台按钮，等待界面切换...");
        sleep(2000);

        // 直接查找打卡按钮
        console.log("开始查找打卡按钮...");
        sleep(2000); // 等待工作台界面完全加载
        let clockIn = text("打卡").findOne(5000);
        if (clockIn) {
            console.log("找到打卡按钮：", clockIn.bounds());
            sleep(1000);
            // 尝试多种点击方式
            if (clockIn.clickable()) {
                console.log("使用直接点击");
                clockIn.click();
            } else {
                console.log("使用坐标点击");
                let b = clockIn.bounds();
                click(b.centerX(), b.centerY());
            }
            sleep(2000);

            // 最多检查5次定位状态
            let maxLocationCheck = 5;
            let locationSuccess = false;
            while (maxLocationCheck > 0) {
                console.log(`第${6 - maxLocationCheck}次检查定位状态...`);
                let locationFail = text("定位失败").bounds(210, 1028, 804, 1092).findOne(3000);
                if (locationFail) {
                    console.log("检测到定位失败，准备开启GPS...");
                    // 打开GPS设置
                    app.startActivity({
                        action: "android.settings.LOCATION_SOURCE_SETTINGS"
                    });
                    sleep(2000);

                    // 点击GPS开关
                    let screenWidth = device.width;
                    let screenHeight = device.height;
                    let x = screenWidth * 0.847666;
                    let y = screenHeight * 0.216799;
                    click(x, y);
                    sleep(2000);
                    back();
                    sleep(1000);

                    console.log("GPS已设置，重新开始打卡流程...");
                    // 重新运行脚本（从头开始）
                    let currentPath = engines.myEngine().source.toString();
                    console.log("当前脚本路径：" + currentPath);
                    engines.execScriptFile(currentPath);
                    exit();
                } else {
                    console.log("定位正常，继续打卡流程");
                    locationSuccess = true;
                    // 直接点击打卡位置
                    console.log("准备点击打卡位置...");
                    let screenWidth = device.width;
                    let screenHeight = device.height;
                    let x = screenWidth * 0.464373;
                    let y = screenHeight * 0.430193;
                    click(x, y);
                    console.log("打卡完成！");
                    exit(); // 结束脚本
                    break;
                }
                maxLocationCheck--;
                sleep(2000);
            }

            if (!locationSuccess) {
                console.log("多次尝试后定位仍然失败，退出脚本");
                exit();
            }

            // 再验证是否进入打卡界面
            if (text("考勤打卡").exists() || text("上班打卡").exists()) {
                console.log("成功进入打卡界面");
                toast("已进入打卡界面");

                // 点击打卡位置
                console.log("准备点击打卡位置...");
                let screenWidth = device.width;
                let screenHeight = device.height;
                let x = screenWidth * 0.496314;
                let y = screenHeight * 0.431328;
                click(x, y);
                console.log("打卡完成！");
                exit(); // 结束脚本
            } else {
                console.log("未能进入打卡界面，重试点击");
                click(clockIn.bounds().centerX(), clockIn.bounds().centerY());
                sleep(2000); // 等待重试后的界面加载
            }
        } else {
            console.log("未找到打卡按钮");
            toast("未找到打卡按钮");
        }
        // 删除这里的 break 语句
    } else {
        console.log("未找到工作台按钮");
        toast("未找到工作台按钮");
    }
} else {
    console.log("企业微信启动失败");
    toast("企业微信启动失败");
}