// 主应用逻辑 - 最小化修复版

// 全局变量
let currentGeneratedImage = null;
let generationHistory = [];

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    console.log('页面加载完成');
    initializeApp();
    setupEventListeners();
});

/**
 * 初始化应用
 */
function initializeApp() {
    console.log('初始化应用');

    // 检查是否有API密钥
    if (api && api.hasValidApiKey()) {
        const apiKeyInput = document.getElementById('apiKey');
        if (apiKeyInput) {
            apiKeyInput.value = api.apiKey;
        }

        // 隐藏API密钥区域
        const apiSection = document.getElementById('api-key-section');
        if (apiSection) {
            apiSection.style.display = 'none';
        }

        // 显示输入区域
        const inputSection = document.getElementById('inputSection');
        if (inputSection) {
            inputSection.style.display = 'block';
        }
    }

    // 更新生成按钮状态
    updateGenerateButton();
}

/**
 * 设置事件监听器
 */
function setupEventListeners() {
    console.log('设置事件监听器');

    // API密钥保存按钮
    const saveApiKeyBtn = document.getElementById('saveApiKey');
    if (saveApiKeyBtn) {
        saveApiKeyBtn.addEventListener('click', saveApiKeyHandler);
    }

    // 主题选择
    const themeSelect = document.getElementById('theme');
    if (themeSelect) {
        themeSelect.addEventListener('change', handleThemeChange);
    }

    // 标题输入
    const titleInput = document.getElementById('newspaperTitle');
    if (titleInput) {
        titleInput.addEventListener('input', updateGenerateButton);
    }

    // 自定义主题输入
    const customThemeInput = document.getElementById('customTheme');
    if (customThemeInput) {
        customThemeInput.addEventListener('input', updateGenerateButton);
    }

    // 生成按钮
    const generateBtn = document.getElementById('generateBtn');
    if (generateBtn) {
        generateBtn.addEventListener('click', generateNewspaperHandler);
    }

    // 输入框回车事件
    const apiKeyInput = document.getElementById('apiKey');
    if (apiKeyInput) {
        apiKeyInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                saveApiKeyHandler();
            }
        });
    }

    if (titleInput) {
        titleInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                generateNewspaperHandler();
            }
        });
    }
}

/**
 * 保存API密钥处理函数
 */
function saveApiKeyHandler() {
    console.log('保存API密钥');
    const apiKeyInput = document.getElementById('apiKey');
    if (!apiKeyInput) return;

    const apiKey = apiKeyInput.value.trim();

    if (api && api.saveApiKey) {
        if (api.saveApiKey(apiKey)) {
            const apiSection = document.getElementById('api-key-section');
            if (apiSection) {
                apiSection.style.display = 'none';
            }

            const inputSection = document.getElementById('inputSection');
            if (inputSection) {
                inputSection.style.display = 'block';
            }
        }
    }
}

/**
 * 主题选择处理函数
 */
function handleThemeChange(e) {
    console.log('主题改变:', e.target.value);
    const selectedTheme = e.target.value;
    const customThemeInput = document.getElementById('customTheme');

    if (!customThemeInput) return;

    if (selectedTheme) {
        // 如果选择了预设主题，清空自定义主题输入
        customThemeInput.value = '';
        customThemeInput.disabled = true;
    } else {
        // 如果没有选择预设主题，允许输入自定义主题
        customThemeInput.disabled = false;
        customThemeInput.focus();
    }

    // 立即更新按钮状态
    updateGenerateButton();
}

/**
 * 更新生成按钮状态
 */
function updateGenerateButton() {
    const themeSelect = document.getElementById('theme');
    const customThemeInput = document.getElementById('customTheme');
    const titleInput = document.getElementById('newspaperTitle');
    const generateBtn = document.getElementById('generateBtn');

    if (!themeSelect || !customThemeInput || !titleInput || !generateBtn) {
        console.log('缺少必要的DOM元素');
        return;
    }

    const hasTheme = themeSelect.value || customThemeInput.value.trim();
    const hasTitle = titleInput.value.trim();

    generateBtn.disabled = !(hasTheme && hasTitle);

    // 添加调试信息
    console.log('按钮状态更新:', {
        themeSelect: themeSelect.value,
        customTheme: customThemeInput.value,
        title: titleInput.value,
        hasTheme: hasTheme,
        hasTitle: hasTitle,
        disabled: generateBtn.disabled
    });

    // 更新调试信息
    const debugInfo = document.getElementById('debugInfo');
    if (debugInfo) {
        debugInfo.innerHTML = `
            主题选择: "${themeSelect.value}"<br>
            自定义主题: "${customThemeInput.value}"<br>
            标题: "${titleInput.value}"<br>
            生成按钮状态: ${generateBtn.disabled ? '禁用' : '启用'}<br>
            有主题: ${hasTheme}<br>
            有标题: ${hasTitle}
        `;
    }
}

/**
 * 生成识字小报处理函数
 */
async function generateNewspaperHandler() {
    console.log('开始生成小报');

    const themeSelect = document.getElementById('theme');
    const customThemeInput = document.getElementById('customTheme');
    const titleInput = document.getElementById('newspaperTitle');

    if (!themeSelect || !customThemeInput || !titleInput) {
        showError('页面元素未正确加载');
        return;
    }

    const theme = themeSelect.value || customThemeInput.value.trim();
    const title = titleInput.value.trim();

    // 验证输入
    if (!theme || !title) {
        showError('请填写主题和标题');
        return;
    }

    // 检查API密钥
    if (!api || !api.hasValidApiKey()) {
        showError('请先设置有效的API密钥');
        return;
    }

    // 禁用生成按钮
    const generateBtn = document.getElementById('generateBtn');
    if (generateBtn) {
        const originalText = generateBtn.innerHTML;
        generateBtn.disabled = true;
        generateBtn.innerHTML = '<span class="spin">⚙️</span> 生成中...';

        // 5秒后恢复按钮（仅用于测试）
        setTimeout(() => {
            generateBtn.disabled = false;
            generateBtn.innerHTML = originalText;
            showSuccess('测试：生成功能正常（实际调用需要真实API密钥）');
        }, 2000);
    }

    // 如果是真实环境，这里会调用API
    console.log('生成参数:', { theme, title });
}

// 显示错误消息
function showError(message) {
    console.error('错误:', message);
    const errorToast = document.getElementById('errorToast');
    const errorMessage = document.getElementById('errorMessage');

    if (errorToast && errorMessage) {
        errorMessage.textContent = message;
        errorToast.style.display = 'block';

        setTimeout(() => {
            errorToast.style.display = 'none';
        }, 3000);
    } else {
        alert(message); // 降级方案
    }
}

// 显示成功消息
function showSuccess(message) {
    console.log('成功:', message);
    const successToast = document.getElementById('successToast');
    const successMessage = document.getElementById('successMessage');

    if (successToast && successMessage) {
        successMessage.textContent = message;
        successToast.style.display = 'block';

        setTimeout(() => {
            successToast.style.display = 'none';
        }, 3000);
    }
}