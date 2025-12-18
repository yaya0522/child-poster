// API调用模块

class NanoBananaAPI {
    constructor() {
        this.baseURL = 'https://api.kie.ai/api/v1/jobs';
        this.apiKey = '';
        this.loadApiKey();
    }

    /**
     * 从本地存储加载API密钥
     */
    loadApiKey() {
        this.apiKey = loadFromLocalStorage('apiKey', '');
    }

    /**
     * 保存API密钥到本地存储
     * @param {string} apiKey - API密钥
     */
    saveApiKey(apiKey) {
        if (validateApiKey(apiKey)) {
            this.apiKey = apiKey;
            saveToLocalStorage('apiKey', apiKey);
            showSuccess('API密钥已保存');
            return true;
        }
        return false;
    }

    /**
     * 创建生成任务
     * @param {string} prompt - 提示词
     * @param {Object} options - 可选参数
     * @returns {Promise} API响应
     */
    async createTask(prompt, options = {}) {
        const defaultOptions = {
            model: 'nano-banana-pro',
            input: {
                prompt: prompt,
                image_input: [],
                aspect_ratio: '3:4', // A4比例
                resolution: '2K',
                output_format: 'png'
            },
            callBackUrl: null
        };

        const requestData = { ...defaultOptions, ...options };

        try {
            const response = await fetch(`${this.baseURL}/createTask`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestData)
            });

            if (!response.ok) {
                await this.handleApiError(response);
                return null;
            }

            const result = await response.json();
            return result;
        } catch (error) {
            console.error('创建任务失败:', error);
            showError('网络错误，请检查网络连接后重试');
            return null;
        }
    }

    /**
     * 查询任务状态
     * @param {string} taskId - 任务ID
     * @returns {Promise} 任务状态信息
     */
    async getTaskStatus(taskId) {
        try {
            const response = await fetch(`${this.baseURL}/recordInfo?taskId=${taskId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`
                }
            });

            if (!response.ok) {
                await this.handleApiError(response);
                return null;
            }

            const result = await response.json();
            return result;
        } catch (error) {
            console.error('查询任务状态失败:', error);
            showError('查询任务状态失败，请重试');
            return null;
        }
    }

    /**
     * 轮询任务状态直到完成
     * @param {string} taskId - 任务ID
     * @param {Function} onProgress - 进度回调函数
     * @param {Function} onComplete - 完成回调函数
     * @param {Function} onError - 错误回调函数
     */
    async pollTaskStatus(taskId, onProgress, onComplete, onError) {
        let pollCount = 0;
        const maxPolls = 150; // 最多轮询5分钟（150 * 2秒）

        const poll = async () => {
            try {
                const result = await this.getTaskStatus(taskId);

                if (!result) {
                    onError('获取任务状态失败');
                    return;
                }

                const state = result.data.state;
                pollCount++;

                // 更新进度
                let progressPercent = 0;
                let progressText = '';

                switch (state) {
                    case 'waiting':
                        progressPercent = Math.min(pollCount * 2, 30);
                        progressText = '任务排队中，请稍候...';
                        break;
                    case 'processing':
                        progressPercent = Math.min(30 + (pollCount * 3), 90);
                        progressText = '正在生成图片，请耐心等待...';
                        break;
                    case 'success':
                        progressPercent = 100;
                        progressText = '生成完成！';
                        onProgress(progressPercent, progressText);
                        onComplete(result);
                        return;
                    case 'fail':
                        progressPercent = 0;
                        progressText = '生成失败';
                        onProgress(progressPercent, progressText);
                        onError(result.data.failMsg || '任务失败');
                        return;
                    default:
                        progressPercent = Math.min(pollCount * 2, 80);
                        progressText = '处理中...';
                }

                onProgress(progressPercent, progressText);

                // 如果超过最大轮询次数，停止轮询
                if (pollCount >= maxPolls) {
                    onError('任务超时，请稍后重试');
                    return;
                }

                // 继续轮询
                setTimeout(poll, 2000);
            } catch (error) {
                console.error('轮询任务状态出错:', error);
                onError('轮询任务状态失败');
            }
        };

        // 开始轮询
        poll();
    }

    /**
     * 处理API错误
     * @param {Response} response - 响应对象
     */
    async handleApiError(response) {
        let errorMessage = '请求失败';

        try {
            const errorData = await response.json();

            switch (response.status) {
                case 400:
                    errorMessage = '请求参数错误';
                    break;
                case 401:
                    errorMessage = 'API密钥无效，请检查您的密钥';
                    break;
                case 402:
                    errorMessage = '账户余额不足，请充值后重试';
                    break;
                case 404:
                    errorMessage = '请求的资源不存在';
                    break;
                case 422:
                    errorMessage = errorData.msg || '参数验证失败';
                    break;
                case 429:
                    errorMessage = '请求频率过高，请稍后重试';
                    break;
                case 500:
                    errorMessage = '服务器内部错误，请稍后重试';
                    break;
                default:
                    errorMessage = `请求失败 (${response.status})`;
            }
        } catch (error) {
            errorMessage = `请求失败 (${response.status})`;
        }

        showError(errorMessage);
    }

    /**
     * 生成识字小报（完整的流程）
     * @param {string} theme - 主题
     * @param {string} title - 标题
     * @param {Function} onProgress - 进度回调
     * @param {Function} onComplete - 完成回调
     * @param {Function} onError - 错误回调
     */
    async generateNewspaper(theme, title, onProgress, onComplete, onError) {
        // 检查API密钥
        if (!this.apiKey) {
            onError('请先设置API密钥');
            return;
        }

        // 生成提示词
        onProgress(5, '正在生成提示词...');
        const prompt = promptGenerator.generatePrompt(theme, title);

        // 创建任务
        onProgress(10, '正在创建生成任务...');
        const createResult = await this.createTask(prompt);

        if (!createResult || createResult.code !== 200) {
            onError(createResult?.msg || '创建任务失败');
            return;
        }

        const taskId = createResult.data.taskId;
        onProgress(15, '任务创建成功，开始生成...');

        // 轮询任务状态
        this.pollTaskStatus(
            taskId,
            onProgress,
            (result) => {
                // 任务完成，解析结果
                try {
                    const resultJson = JSON.parse(result.data.resultJson);
                    const imageUrls = resultJson.resultUrls;

                    if (imageUrls && imageUrls.length > 0) {
                        onComplete({
                            taskId: taskId,
                            imageUrl: imageUrls[0],
                            theme: theme,
                            title: title,
                            prompt: prompt,
                            createTime: Date.now()
                        });
                    } else {
                        onError('生成结果中没有找到图片');
                    }
                } catch (error) {
                    console.error('解析结果失败:', error);
                    onError('解析生成结果失败');
                }
            },
            onError
        );
    }

    /**
     * 下载图片（通过创建下载链接）
     * @param {string} imageUrl - 图片URL
     * @param {string} filename - 文件名
     */
    downloadImage(imageUrl, filename) {
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = filename || `识字小报_${Date.now()}.png`;
        link.target = '_blank';

        // 添加到页面并点击
        document.body.appendChild(link);
        link.click();

        // 移除链接
        document.body.removeChild(link);

        showSuccess('图片下载已开始');
    }

    /**
     * 检查API密钥是否有效
     * @returns {boolean} 是否有效
     */
    hasValidApiKey() {
        return this.apiKey && this.apiKey.length >= 10;
    }

    /**
     * 清除API密钥
     */
    clearApiKey() {
        this.apiKey = '';
        removeFromLocalStorage('apiKey');
        showSuccess('API密钥已清除');
    }
}

// 创建全局API实例
const api = new NanoBananaAPI();

// 导出API实例（如果需要）
// window.api = api;