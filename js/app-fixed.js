// 主应用逻辑（修复版）

// 全局变量
let currentGeneratedImage = null;
let generationHistory = [];

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    loadHistory();
    setupEventListeners();
});

/**
 * 初始化应用
 */
function initializeApp() {
    // 检查是否有API密钥
    if (api.hasValidApiKey()) {
        document.getElementById('apiKey').value = api.apiKey;
        hideSection('api-key-section');
        showSection('inputSection');
        showSection('resultSection');
        showSection('historySection');
    }

    // 加载历史记录
    loadHistory();

    // 更新生成按钮状态
    updateGenerateButton();
}

/**
 * 设置事件监听器
 */
function setupEventListeners() {
    // API密钥保存按钮
    document.getElementById('saveApiKey').addEventListener('click', saveApiKeyHandler);

    // 主题选择
    document.getElementById('theme').addEventListener('change', handleThemeChange);

    // 标题输入
    document.getElementById('newspaperTitle').addEventListener('input', updateGenerateButton);

    // 自定义主题输入
    document.getElementById('customTheme').addEventListener('input', updateGenerateButton);

    // 生成按钮
    document.getElementById('generateBtn').addEventListener('click', generateNewspaperHandler);

    // 下载按钮
    document.getElementById('downloadBtn').addEventListener('click', downloadImageHandler);

    // 重新生成按钮
    document.getElementById('regenerateBtn').addEventListener('click', regenerateHandler);

    // 新建小报按钮
    document.getElementById('newspaperBtn').addEventListener('click', createNewHandler);

    // 输入框回车事件
    document.getElementById('apiKey').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            saveApiKeyHandler();
        }
    });

    document.getElementById('newspaperTitle').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            generateNewspaperHandler();
        }
    });

    // 图片加载事件
    const generatedImage = document.getElementById('generatedImage');
    generatedImage.addEventListener('load', () => {
        document.getElementById('imageOverlay').style.display = 'none';
    });

    generatedImage.addEventListener('error', () => {
        document.getElementById('imageOverlay').innerHTML =
            '<span class="error-text">图片加载失败</span>';
    });
}

/**
 * 保存API密钥处理函数
 */
function saveApiKeyHandler() {
    const apiKeyInput = document.getElementById('apiKey');
    const apiKey = apiKeyInput.value.trim();

    if (api.saveApiKey(apiKey)) {
        hideSection('api-key-section');
        showSection('inputSection');
        showSection('resultSection');
        showSection('historySection');
    }
}

/**
 * 主题选择处理函数（修复版）
 */
function handleThemeChange(e) {
    const selectedTheme = e.target.value;
    const customThemeInput = document.getElementById('customTheme');

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
 * 更新生成按钮状态（修复版）
 */
function updateGenerateButton() {
    const themeSelect = document.getElementById('theme');
    const customThemeInput = document.getElementById('customTheme');
    const titleInput = document.getElementById('newspaperTitle');
    const generateBtn = document.getElementById('generateBtn');

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
}

/**
 * 生成识字小报处理函数
 */
async function generateNewspaperHandler() {
    const themeSelect = document.getElementById('theme');
    const customThemeInput = document.getElementById('customTheme');
    const titleInput = document.getElementById('newspaperTitle');

    const theme = themeSelect.value || customThemeInput.value.trim();
    const title = titleInput.value.trim();

    // 验证输入
    if (!promptGenerator.validateInput(theme, title)) {
        return;
    }

    // 显示进度条
    showSection('progressSection');
    hideSection('resultSection');

    // 禁用生成按钮
    const generateBtn = document.getElementById('generateBtn');
    const originalText = generateBtn.innerHTML;
    generateBtn.disabled = true;
    generateBtn.innerHTML = '<span class="spin">⚙️</span> 生成中...';

    try {
        await api.generateNewspaper(
            theme,
            title,
            (progress, text) => {
                updateProgress(progress, text);
            },
            (result) => {
                // 生成成功
                handleGenerationSuccess(result);
            },
            (error) => {
                // 生成失败
                handleGenerationError(error);
            }
        );
    } catch (error) {
        console.error('生成过程中的错误:', error);
        handleGenerationError('生成过程中发生未知错误');
    } finally {
        // 恢复按钮状态
        generateBtn.disabled = false;
        generateBtn.innerHTML = originalText;
    }
}

/**
 * 处理生成成功
 */
function handleGenerationSuccess(result) {
    hideProgress();
    showSection('resultSection');

    currentGeneratedImage = result;

    // 显示生成的图片
    const imageElement = document.getElementById('generatedImage');
    imageElement.src = result.imageUrl;

    // 添加到历史记录
    addToHistory(result);

    showSuccess('识字小报生成成功！');
}

/**
 * 处理生成错误
 */
function handleGenerationError(error) {
    hideProgress();
    showError(error || '生成失败，请重试');
}

/**
 * 下载图片处理函数
 */
function downloadImageHandler() {
    if (!currentGeneratedImage) {
        showError('没有可下载的图片');
        return;
    }

    const filename = `${currentGeneratedImage.title}_${Date.now()}.png`;
    api.downloadImage(currentGeneratedImage.imageUrl, filename);
}

/**
 * 重新生成处理函数
 */
function regenerateHandler() {
    if (!currentGeneratedImage) {
        showError('没有可重新生成的内容');
        return;
    }

    // 清空输入，使用之前的内容
    document.getElementById('theme').value = '';
    document.getElementById('customTheme').value = currentGeneratedImage.theme;
    document.getElementById('customTheme').disabled = false;
    document.getElementById('newspaperTitle').value = currentGeneratedImage.title;

    // 滚动到输入区域
    document.getElementById('inputSection').scrollIntoView({ behavior: 'smooth' });

    // 重新生成
    generateNewspaperHandler();
}

/**
 * 创建新的小报处理函数
 */
function createNewHandler() {
    // 重置所有输入
    document.getElementById('theme').value = '';
    document.getElementById('customTheme').value = '';
    document.getElementById('customTheme').disabled = false;
    document.getElementById('newspaperTitle').value = '';

    // 隐藏结果区域
    hideSection('resultSection');
    hideProgress();

    // 清空当前生成的图片
    currentGeneratedImage = null;

    // 滚动到输入区域
    document.getElementById('inputSection').scrollIntoView({ behavior: 'smooth' });

    // 更新按钮状态
    updateGenerateButton();
}

/**
 * 添加到历史记录
 */
function addToHistory(result) {
    // 创建历史记录项
    const historyItem = {
        id: result.taskId,
        theme: result.theme,
        title: result.title,
        imageUrl: result.imageUrl,
        createTime: result.createTime
    };

    // 添加到历史记录数组
    generationHistory.unshift(historyItem);

    // 限制历史记录数量
    if (generationHistory.length > 20) {
        generationHistory = generationHistory.slice(0, 20);
    }

    // 保存到本地存储
    saveToLocalStorage('generationHistory', generationHistory);

    // 更新历史记录显示
    displayHistory();
}

/**
 * 加载历史记录
 */
function loadHistory() {
    generationHistory = loadFromLocalStorage('generationHistory', []);
    displayHistory();
}

/**
 * 显示历史记录
 */
function displayHistory() {
    const historyGrid = document.getElementById('historyGrid');
    const historySection = document.getElementById('historySection');

    if (generationHistory.length === 0) {
        historySection.style.display = 'none';
        return;
    }

    historySection.style.display = 'block';
    historyGrid.innerHTML = '';

    generationHistory.forEach(item => {
        const historyElement = createHistoryElement(item);
        historyGrid.appendChild(historyElement);
    });
}

/**
 * 创建历史记录元素
 */
function createHistoryElement(item) {
    const div = document.createElement('div');
    div.className = 'history-item';
    div.onclick = () => loadHistoryItem(item);

    const img = document.createElement('img');
    img.src = item.imageUrl;
    img.alt = item.title;
    img.loading = 'lazy';

    const title = document.createElement('div');
    title.className = 'history-item-title';
    title.textContent = `${item.title} (${formatTimestamp(item.createTime)})`;

    div.appendChild(img);
    div.appendChild(title);

    return div;
}

/**
 * 加载历史记录项
 */
function loadHistoryItem(item) {
    currentGeneratedImage = item;

    // 填充输入框
    document.getElementById('theme').value = '';
    document.getElementById('customTheme').value = item.theme;
    document.getElementById('customTheme').disabled = false;
    document.getElementById('newspaperTitle').value = item.title;

    // 显示图片
    showSection('resultSection');
    const imageElement = document.getElementById('generatedImage');
    imageElement.src = item.imageUrl;

    // 滚动到结果区域
    document.getElementById('resultSection').scrollIntoView({ behavior: 'smooth' });

    showSuccess('已加载历史记录');
}

// 键盘快捷键
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + Enter 生成
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        const generateBtn = document.getElementById('generateBtn');
        if (!generateBtn.disabled) {
            generateNewspaperHandler();
        }
    }

    // Ctrl/Cmd + S 下载
    if ((e.ctrlKey || e.metaKey) && e.key === 's' && currentGeneratedImage) {
        e.preventDefault();
        downloadImageHandler();
    }

    // Ctrl/Cmd + N 新建
    if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        createNewHandler();
    }
});

// 页面卸载前保存状态
window.addEventListener('beforeunload', () => {
    // 保存当前输入的内容
    const currentInput = {
        theme: document.getElementById('theme').value,
        customTheme: document.getElementById('customTheme').value,
        title: document.getElementById('newspaperTitle').value
    };
    saveToLocalStorage('currentInput', currentInput);
});

// 页面加载时恢复输入状态
window.addEventListener('load', () => {
    const currentInput = loadFromLocalStorage('currentInput', {});
    if (currentInput.theme) {
        document.getElementById('theme').value = currentInput.theme;
    }
    if (currentInput.customTheme) {
        document.getElementById('customTheme').value = currentInput.customTheme;
    }
    if (currentInput.title) {
        document.getElementById('newspaperTitle').value = currentInput.title;
    }
    updateGenerateButton();
});