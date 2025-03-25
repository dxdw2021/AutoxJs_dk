// 定时任务相关功能

/**
 * 定时任务调度器
 */
class Scheduler {
    constructor() {
        this.tasks = [];
        this.isRunning = false;
    }

    /**
     * 添加定时任务
     * @param {string} name 任务名称
     * @param {Function} task 任务函数
     * @param {number} interval 执行间隔（毫秒）
     * @param {boolean} runImmediately 是否立即执行一次
     */
    addTask(name, task, interval, runImmediately = false) {
        this.tasks.push({
            name: name,
            task: task,
            interval: interval,
            lastRun: runImmediately ? 0 : Date.now(),
            enabled: true
        });
        console.log(`添加任务: ${name}, 间隔: ${interval}ms`);
    }

    /**
     * 启动调度器
     */
    start() {
        if (this.isRunning) {
            console.log("调度器已在运行中");
            return;
        }

        this.isRunning = true;

        // 创建悬浮窗显示状态
        this.createFloaty();

        threads.start(() => {
            while (this.isRunning) {
                try {
                    this.checkAndRunTasks();
                    sleep(1000); // 每秒检查一次
                } catch (e) {
                    console.error("任务执行错误：" + e);
                }
            }
        });
    }

    /**
     * 停止调度器
     */
    stop() {
        this.isRunning = false;
        if (this.floatyWindow) {
            this.floatyWindow.close();
        }
        console.log("调度器已停止");
    }

    /**
     * 检查并执行到期的任务
     */
    checkAndRunTasks() {
        const now = Date.now();
        this.tasks.forEach(task => {
            if (!task.enabled) return;

            if (now - task.lastRun >= task.interval) {
                try {
                    console.log(`执行任务: ${task.name}`);
                    task.task();
                    task.lastRun = now;
                } catch (e) {
                    console.error(`任务 ${task.name} 执行失败: ${e}`);
                }
            }
        });
    }

    /**
     * 创建悬浮窗显示状态
     */
    createFloaty() {
        this.floatyWindow = floaty.window(
            <frame gravity="center">
                <text id="status" textSize="14sp" textColor="#ffffff" />
            </frame>
        );

        this.floatyWindow.setPosition(50, 100);
        this.floatyWindow.exitOnClose();

        setInterval(() => {
            if (this.floatyWindow && this.isRunning) {
                let activeCount = this.tasks.filter(t => t.enabled).length;
                ui.run(() => {
                    this.floatyWindow.status.setText(
                        `定时任务运行中\n活动任务: ${activeCount}`
                    );
                });
            }
        }, 1000);
    }

    /**
     * 启用任务
     * @param {string} name 任务名称
     */
    enableTask(name) {
        const task = this.tasks.find(t => t.name === name);
        if (task) {
            task.enabled = true;
            console.log(`已启用任务: ${name}`);
        }
    }

    /**
     * 禁用任务
     * @param {string} name 任务名称
     */
    disableTask(name) {
        const task = this.tasks.find(t => t.name === name);
        if (task) {
            task.enabled = false;
            console.log(`已禁用任务: ${name}`);
        }
    }
}

// 使用示例
function createExampleScheduler() {
    const scheduler = new Scheduler();

    // 示例任务1：每5分钟执行一次
    scheduler.addTask(
        "示例任务1",
        () => {
            console.log("执行示例任务1");
            // 在这里添加具体任务代码
        },
        5 * 60 * 1000
    );

    // 示例任务2：每小时执行一次
    scheduler.addTask(
        "示例任务2",
        () => {
            console.log("执行示例任务2");
            // 在这里添加具体任务代码
        },
        60 * 60 * 1000
    );

    return scheduler;
}

module.exports = {
    Scheduler,
    createExampleScheduler
};
