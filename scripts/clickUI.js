// 界面点击操作相关函数

/**
 * 通过文本查找并点击元素
 * @param {string} text 要查找的文本
 * @param {number} timeout 查找超时时间，默认3000ms
 * @returns {boolean} 是否点击成功
 */
function clickByText(text, timeout = 3000) {
    try {
        let target = text(text).findOne(timeout);
        if (target) {
            return target.click();
        }
        return false;
    } catch (e) {
        console.error("点击失败：" + e);
        return false;
    }
}

/**
 * 通过ID查找并点击元素
 * @param {string} id 要查找的ID
 * @param {number} timeout 查找超时时间，默认3000ms
 * @returns {boolean} 是否点击成功
 */
function clickById(id, timeout = 3000) {
    try {
        let target = id(id).findOne(timeout);
        if (target) {
            return target.click();
        }
        return false;
    } catch (e) {
        console.error("点击失败：" + e);
        return false;
    }
}

/**
 * 通过坐标点击
 * @param {number} x X坐标
 * @param {number} y Y坐标
 * @returns {boolean} 是否点击成功
 */
function clickByCoord(x, y) {
    try {
        return click(x, y);
    } catch (e) {
        console.error("点击失败：" + e);
        return false;
    }
}

/**
 * 等待并点击指定元素
 * @param {string} selector 选择器类型：text/id/desc
 * @param {string} value 要查找的值
 * @param {number} timeout 超时时间（毫秒）
 * @returns {boolean} 是否成功
 */
function waitAndClick(selector, value, timeout = 5000) {
    try {
        let startTime = Date.now();
        while (Date.now() - startTime < timeout) {
            let element;
            switch (selector) {
                case "text":
                    element = text(value).findOne(1000);
                    break;
                case "id":
                    element = id(value).findOne(1000);
                    break;
                case "desc":
                    element = desc(value).findOne(1000);
                    break;
            }
            if (element && element.clickable()) {
                return element.click();
            }
            sleep(500);
        }
        return false;
    } catch (e) {
        console.error("等待点击失败：" + e);
        return false;
    }
}

// 导出所有函数
module.exports = {
    clickByText,
    clickById,
    clickByCoord,
    waitAndClick
};
