// 工具函数库

/**
 * 显示错误消息
 * @param {string} message - 错误消息内容
 */
function showError(message) {
    const errorToast = document.getElementById('errorToast');
    const errorMessage = document.getElementById('errorMessage');

    errorMessage.textContent = message;
    errorToast.style.display = 'block';

    // 5秒后自动隐藏
    setTimeout(() => {
        hideError();
    }, 5000);
}

/**
 * 隐藏错误消息
 */
function hideError() {
    const errorToast = document.getElementById('errorToast');
    errorToast.style.display = 'none';
}

/**
 * 显示成功消息
 * @param {string} message - 成功消息内容
 */
function showSuccess(message) {
    const successToast = document.getElementById('successToast');
    const successMessage = document.getElementById('successMessage');

    successMessage.textContent = message;
    successToast.style.display = 'block';

    // 3秒后自动隐藏
    setTimeout(() => {
        successToast.style.display = 'none';
    }, 3000);
}

/**
 * 格式化时间戳为可读格式
 * @param {number} timestamp - 时间戳
 * @returns {string} 格式化的时间字符串
 */
function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;

    // 小于1分钟
    if (diff < 60000) {
        return '刚刚';
    }

    // 小于1小时
    if (diff < 3600000) {
        const minutes = Math.floor(diff / 60000);
        return `${minutes}分钟前`;
    }

    // 小于1天
    if (diff < 86400000) {
        const hours = Math.floor(diff / 3600000);
        return `${hours}小时前`;
    }

    // 小于7天
    if (diff < 604800000) {
        const days = Math.floor(diff / 86400000);
        return `${days}天前`;
    }

    // 超过7天，显示具体日期
    return date.toLocaleDateString('zh-CN');
}

/**
 * 保存数据到localStorage
 * @param {string} key - 存储键
 * @param {*} data - 要存储的数据
 */
function saveToLocalStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
        console.error('保存数据到localStorage失败:', error);
    }
}

/**
 * 从localStorage读取数据
 * @param {string} key - 存储键
 * @param {*} defaultValue - 默认值
 * @returns {*} 读取的数据或默认值
 */
function loadFromLocalStorage(key, defaultValue = null) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : defaultValue;
    } catch (error) {
        console.error('从localStorage读取数据失败:', error);
        return defaultValue;
    }
}

/**
 * 从localStorage删除数据
 * @param {string} key - 存储键
 */
function removeFromLocalStorage(key) {
    try {
        localStorage.removeItem(key);
    } catch (error) {
        console.error('从localStorage删除数据失败:', error);
    }
}

/**
 * 生成唯一ID
 * @returns {string} 唯一ID字符串
 */
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * 下载图片到本地
 * @param {string} url - 图片URL
 * @param {string} filename - 文件名（可选）
 */
async function downloadImage(url, filename = null) {
    try {
        // 如果没有提供文件名，生成一个默认的
        if (!filename) {
            const timestamp = Date.now();
            filename = `识字小报_${timestamp}.png`;
        }

        // 创建下载链接
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        showSuccess('图片下载已开始');
    } catch (error) {
        console.error('下载图片失败:', error);
        showError('下载图片失败，请重试');
    }
}

/**
 * 转义HTML特殊字符
 * @param {string} text - 要转义的文本
 * @returns {string} 转义后的文本
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * 验证输入是否为空
 * @param {string} value - 输入值
 * @param {string} fieldName - 字段名称（用于错误提示）
 * @returns {boolean} 是否有效
 */
function validateNotEmpty(value, fieldName) {
    if (!value || value.trim() === '') {
        showError(`${fieldName}不能为空`);
        return false;
    }
    return true;
}

/**
 * 验证API密钥格式
 * @param {string} apiKey - API密钥
 * @returns {boolean} 是否有效
 */
function validateApiKey(apiKey) {
    if (!apiKey || apiKey.trim() === '') {
        showError('请输入API密钥');
        return false;
    }

    if (apiKey.length < 10) {
        showError('API密钥格式不正确');
        return false;
    }

    return true;
}

/**
 * 更新进度条
 * @param {number} percent - 进度百分比（0-100）
 * @param {string} text - 进度文本
 */
function updateProgress(percent, text) {
    const progressSection = document.getElementById('progressSection');
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');

    progressSection.style.display = 'block';
    progressFill.style.width = `${percent}%`;
    progressText.textContent = text;
}

/**
 * 隐藏进度条
 */
function hideProgress() {
    const progressSection = document.getElementById('progressSection');
    progressSection.style.display = 'none';
}

/**
 * 显示区域并添加动画
 * @param {string} elementId - 元素ID
 */
function showSection(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.style.display = 'block';
        element.classList.add('fade-in');
    }
}

/**
 * 隐藏区域
 * @param {string} elementId - 元素ID
 */
function hideSection(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.style.display = 'none';
        element.classList.remove('fade-in');
    }
}

/**
 * 防抖函数
 * @param {Function} func - 要防抖的函数
 * @param {number} wait - 等待时间（毫秒）
 * @returns {Function} 防抖后的函数
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * 节流函数
 * @param {Function} func - 要节流的函数
 * @param {number} limit - 限制时间（毫秒）
 * @returns {Function} 节流后的函数
 */
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * 检查设备类型
 * @returns {string} 设备类型：'mobile' | 'tablet' | 'desktop'
 */
function getDeviceType() {
    const width = window.innerWidth;

    if (width <= 768) {
        return 'mobile';
    } else if (width <= 1024) {
        return 'tablet';
    } else {
        return 'desktop';
    }
}

/**
 * 复制文本到剪贴板
 * @param {string} text - 要复制的文本
 * @returns {Promise<boolean>} 是否成功
 */
async function copyToClipboard(text) {
    try {
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(text);
            return true;
        } else {
            // 兼容旧浏览器
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            textArea.style.top = '-999999px';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            const result = document.execCommand('copy');
            textArea.remove();
            return result;
        }
    } catch (error) {
        console.error('复制到剪贴板失败:', error);
        return false;
    }
}

/**
 * 获取文件扩展名
 * @param {string} filename - 文件名
 * @returns {string} 文件扩展名
 */
function getFileExtension(filename) {
    return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
}

/**
 * 格式化文件大小
 * @param {number} bytes - 字节数
 * @returns {string} 格式化的文件大小
 */
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}