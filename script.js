// 哆啦A梦道具大全 - JavaScript
// GitHub Gist 在线存储配置
const GIST_CONFIG = {
    token: window.GITHUB_CONFIG?.token || "", // 从配置文件读取Token
    gistId: window.GITHUB_CONFIG?.gistId || "" // 从配置文件读取Gist ID
};

// 哆啦A梦道具数据
let doraemonItems = [
    {
        id: 1,
        name: "时光机",
        description: "可以穿越时空的机器，能够前往过去和未来。",
        image: "https://c-ssl.duitang.com/uploads/item/201610/14/20161014172408_WkHMy.jpeg",
        category: "时空道具",
        appearances: [
            { type: "season", value: "第1季" },
            { type: "episode", value: "第1集" }
        ]
    },
    {
        id: 2,
        name: "任意门",
        description: "打开门就能到达任何想去的地方。",
        image: "https://c-ssl.duitang.com/uploads/item/201610/14/20161014172408_WkHMy.jpeg",
        category: "空间道具",
        appearances: [
            { type: "season", value: "第1季" },
            { type: "episode", value: "第2集" }
        ]
    },
    {
        id: 3,
        name: "竹蜻蜓",
        description: "戴在头上就能飞行的道具。",
        image: "https://c-ssl.duitang.com/uploads/item/201610/14/20161014172408_WkHMy.jpeg",
        category: "飞行道具",
        appearances: [
            { type: "season", value: "第1季" },
            { type: "episode", value: "第3集" }
        ]
    }
];

// 在线数据管理器
class OnlineDataManager {
    constructor() {
        this.isInitialized = false;
    }

    // 检查是否有在线存储配置
    hasOnlineConfig() {
        return GIST_CONFIG.token && GIST_CONFIG.token !== "你的GitHub Token";
    }

    // 从在线存储加载数据
    async loadFromOnline() {
        try {
            // 如果没有Gist ID，尝试从localStorage获取
            let gistId = GIST_CONFIG.gistId;
            if (!gistId) {
                gistId = localStorage.getItem('gist_id');
            }

            if (!gistId) {
                console.log("没有Gist ID，无法加载在线数据");
                return false;
            }

            // 公开Gist可以直接访问，无需Token
            const response = await fetch(`https://api.github.com/gists/${gistId}`);

            if (!response.ok) {
                throw new Error(`无法从Gist加载数据: ${response.status}`);
            }

            const result = await response.json();
            console.log("Gist返回的完整数据:", result);
            
            const file = result.files['doraemon-items.json'];
            if (file && file.content) {
                const data = JSON.parse(file.content);
                if (data.items && Array.isArray(data.items)) {
                    doraemonItems = data.items;
                    console.log("从Gist加载数据成功，道具数量:", doraemonItems.length);
                    console.log("道具列表:", doraemonItems);
                    console.log("OnlineDataManager.loadFromOnline 返回 true");
                    return true;
                }
            }
            
            console.log("Gist中没有有效数据");
            console.log("OnlineDataManager.loadFromOnline 返回 false");
            return false;
        } catch (error) {
            console.error("在线数据加载失败:", error);
            throw error;
        }
    }

    // 保存数据到在线存储
    async saveToOnline() {
        // 只有在有Token的情况下才尝试保存到在线存储
        if (!GIST_CONFIG.token) {
            console.log("未配置管理员Token，仅保存到本地");
            return false;
        }

        try {
            let gistId = GIST_CONFIG.gistId;
            if (!gistId) {
                gistId = localStorage.getItem('gist_id');
            }

            const dataToSave = {
                items: doraemonItems,
                lastUpdated: new Date().toISOString(),
                version: '1.0'
            };

            const gistData = {
                description: "哆啦A梦道具数据",
                public: true, // 设为公开，任何人都可以读取
                files: {
                    "doraemon-items.json": {
                        content: JSON.stringify(dataToSave, null, 2)
                    }
                }
            };

            console.log("准备保存数据到Gist:", dataToSave);
            
            const url = gistId ? 
                `https://api.github.com/gists/${gistId}` : 
                'https://api.github.com/gists';

            const response = await fetch(url, {
                method: gistId ? 'PATCH' : 'POST',
                headers: {
                    'Authorization': `token ${GIST_CONFIG.token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(gistData)
            });

            if (response.ok) {
                const result = await response.json();
                console.log("数据保存到Gist成功:", result);
                
                // 如果是新创建的Gist，保存ID
                if (!gistId) {
                    gistId = result.id;
                    localStorage.setItem('gist_id', gistId);
                    console.log("新Gist ID已保存:", gistId);
                }
                
                return true;
            } else {
                const errorText = await response.text();
                console.error("保存失败，状态码:", response.status, "错误信息:", errorText);
                throw new Error(`保存失败: ${response.status} ${errorText}`);
            }
        } catch (error) {
            console.error("在线数据保存失败:", error);
            throw error;
        }
    }

    // 显示同步状态
    showSyncStatus(message, isError = false) {
        const syncStatus = document.getElementById('syncStatus');
        if (syncStatus) {
            syncStatus.textContent = message;
            syncStatus.className = isError ? 'sync-error' : 'sync-success';
        }
    }
}

// 创建在线数据管理器实例
const onlineDataManager = new OnlineDataManager();

// 检查是否有在线存储配置
function hasOnlineConfig() {
    return onlineDataManager.hasOnlineConfig();
}

// 从在线存储加载数据
async function loadFromOnline() {
    if (!hasOnlineConfig()) {
        console.log("未配置在线存储，使用本地数据");
        return false;
    }

    try {
        const result = await onlineDataManager.loadFromOnline();
        console.log("loadFromOnline 返回结果:", result);
        if (result) {
            onlineDataManager.showSyncStatus("✅ 数据同步成功");
            console.log("在线数据加载成功，返回 true");
        } else {
            console.log("在线数据加载失败，返回 false");
        }
        return result;
    } catch (error) {
        console.error("在线数据加载失败:", error);
        onlineDataManager.showSyncStatus("⚠️ 在线数据加载失败，使用本地数据", true);
        return false;
    }
}

// 保存数据（本地 + 在线）
async function saveData() {
    console.log("saveData() 被调用");
    console.log("当前道具数量:", doraemonItems.length);
    
    // 尝试保存到在线存储
    if (hasOnlineConfig()) {
        console.log("检测到在线配置，准备保存到JSONBin");
        try {
            await onlineDataManager.saveToOnline();
            onlineDataManager.showSyncStatus("✅ 数据同步成功");
            console.log("在线保存成功");
            
            // 在线保存成功后，再保存到本地存储作为备份
            saveToLocalStorage();
            console.log("本地存储备份完成");
        } catch (error) {
            console.error("在线保存失败:", error);
            onlineDataManager.showSyncStatus("⚠️ 在线同步失败，仅保存到本地", true);
            
            // 在线保存失败时，保存到本地存储
            saveToLocalStorage();
            console.log("本地存储保存完成");
        }
    } else {
        console.log("未检测到在线配置，仅保存到本地");
        saveToLocalStorage();
        console.log("本地存储保存完成");
    }
}

// 初始化数据
async function initializeData() {
    console.log("开始初始化数据...");
    
    // 尝试从在线存储加载
    const onlineLoaded = await loadFromOnline();
    
    // 如果在线加载失败，从本地加载
    if (!onlineLoaded) {
        console.log("在线加载失败，使用本地数据");
        loadFromLocalStorage();
        
        // 如果本地也没有数据，使用默认数据但不保存到在线
        if (doraemonItems.length === 0) {
            console.log("本地也没有数据，使用默认数据");
            // 这里不调用 saveData()，避免覆盖在线数据
        }
    } else {
        console.log("在线加载成功，使用在线数据");
        // 在线数据加载成功时，更新本地存储作为备份
        saveToLocalStorage();
        console.log("本地存储备份完成");
    }
    
    // 更新当前显示的道具列表
    currentItems = [...doraemonItems];
    
    console.log("最终道具数量:", doraemonItems.length);
    console.log("最终道具列表:", doraemonItems);
    
    // 渲染数据
    renderItems(doraemonItems);
    updateStats();
}

// 管理员设置
const ADMIN_PASSWORD = "doraemon2024"; // 您可以修改这个密码
let isAdmin = false;

// 全局变量
let currentItems = [...doraemonItems];
let searchTerm = '';
let selectedCategory = '';

// DOM 元素
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const categoryFilter = document.getElementById('categoryFilter');
const clearFiltersBtn = document.getElementById('clearFilters');
const itemsGrid = document.getElementById('itemsGrid');
const itemCount = document.getElementById('itemCount');
const noResults = document.getElementById('noResults');
const modal = document.getElementById('itemModal');
const modalContent = document.getElementById('modalContent');
const closeModal = document.querySelector('.close');

// 初始化应用
async function initApp() {
    await initializeData();
    setupEventListeners();
    addAdminButton();
}

// 添加管理员按钮
function addAdminButton() {
    const header = document.querySelector('.header-content');
    const adminBtn = document.createElement('button');
    adminBtn.id = 'adminBtn';
    adminBtn.className = 'admin-btn';
    adminBtn.textContent = isAdmin ? '退出管理' : '管理员登录';
    adminBtn.onclick = toggleAdminMode;
    
    header.appendChild(adminBtn);
}

// 切换管理员模式
function toggleAdminMode() {
    if (isAdmin) {
        isAdmin = false;
        document.getElementById('adminBtn').textContent = '管理员登录';
        hideAdminControls();
        renderItems(currentItems);
    } else {
        const password = prompt('请输入管理员密码：');
        if (password === ADMIN_PASSWORD) {
            isAdmin = true;
            document.getElementById('adminBtn').textContent = '退出管理';
            showAdminControls();
            renderItems(currentItems);
        } else if (password !== null) {
            alert('密码错误！');
        }
    }
}

// 显示管理员控制按钮
function showAdminControls() {
    const searchSection = document.querySelector('.search-section');
    
    if (!document.getElementById('addItemBtn')) {
        const addBtn = document.createElement('button');
        addBtn.id = 'addItemBtn';
        addBtn.className = 'admin-control-btn add-btn';
        addBtn.textContent = '➕ 添加道具';
        addBtn.onclick = showAddItemForm;
        searchSection.appendChild(addBtn);
    }
}

// 隐藏管理员控制按钮
function hideAdminControls() {
    const addBtn = document.getElementById('addItemBtn');
    if (addBtn) addBtn.remove();
    
    const editForm = document.getElementById('editForm');
    if (editForm) editForm.remove();
}

// 显示添加道具表单
function showAddItemForm() {
    const form = document.createElement('div');
    form.id = 'editForm';
    form.className = 'edit-form';
    form.innerHTML = `
        <h3>添加新道具</h3>
        <form id="addItemForm">
            <div class="form-group">
                <label>道具名称：</label>
                <input type="text" id="itemName" required>
            </div>
            <div class="form-group">
                <label>分类：</label>
                <select id="itemCategory" required>
                    <option value="交通工具">交通工具</option>
                    <option value="生活用品">生活用品</option>
                    <option value="战斗道具">战斗道具</option>
                    <option value="娱乐道具">娱乐道具</option>
                    <option value="学习道具">学习道具</option>
                    <option value="医疗道具">医疗道具</option>
                    <option value="时空道具">时空道具</option>
                </select>
            </div>
            <div class="form-group">
                <label>描述：</label>
                <textarea id="itemDescription" required></textarea>
            </div>
            <div class="form-group">
                <label>图片链接：</label>
                <input type="url" id="itemImage" required>
            </div>
            <div class="form-group">
                <label>特性标签（用逗号分隔）：</label>
                <input type="text" id="itemFeatures" placeholder="飞行,便携,易用">
            </div>
            <div class="form-group">
                <label>出现位置信息：</label>
                <div id="appearancesContainer">
                    <!-- 出现位置将在这里动态添加 -->
                </div>
                <button type="button" class="add-appearance-btn" onclick="addAppearance()">+ 添加出现位置</button>
            </div>
            <div class="form-buttons">
                <button type="submit" class="save-btn">保存</button>
                <button type="button" class="cancel-btn" onclick="closeEditForm()">取消</button>
            </div>
        </form>
    `;
    
    document.body.appendChild(form);
    document.getElementById('addItemForm').addEventListener('submit', addNewItem);
}

// 添加新道具
async function addNewItem(e) {
    e.preventDefault();
    
    console.log("开始添加新道具...");
    
    // 收集出现位置信息
    const appearances = [];
    const appearanceItems = document.querySelectorAll('.appearance-item');
    appearanceItems.forEach(item => {
        const type = item.querySelector('.appearance-type').value;
        const value = item.querySelector('.appearance-value').value.trim();
        
        if (value) {
            if (type === 'season') {
                const episode = item.querySelector('.appearance-episode').value.trim();
                if (episode) {
                    appearances.push({ type, value, episode });
                }
            } else if (type === 'movie') {
                const year = item.querySelector('.appearance-year').value.trim();
                if (year) {
                    appearances.push({ type, value, year });
                }
            }
        }
    });
    
    const newItem = {
        id: Date.now(),
        name: document.getElementById('itemName').value,
        category: document.getElementById('itemCategory').value,
        description: document.getElementById('itemDescription').value,
        image: document.getElementById('itemImage').value,
        features: document.getElementById('itemFeatures').value.split(',').map(f => f.trim()).filter(f => f),
        appearances: appearances
    };
    
    console.log("新道具信息:", newItem);
    console.log("添加前道具数量:", doraemonItems.length);
    
    doraemonItems.push(newItem);
    currentItems = [...doraemonItems];
    
    console.log("添加后道具数量:", doraemonItems.length);
    console.log("准备保存数据...");
    
    await saveData();
    
    console.log("数据保存完成");
    
    closeEditForm();
    renderItems(currentItems);
    alert('道具添加成功！');
}

// 显示编辑道具表单
function showEditItemForm(itemId) {
    const item = doraemonItems.find(item => item.id === itemId);
    if (!item) return;
    
    const form = document.createElement('div');
    form.id = 'editForm';
    form.className = 'edit-form';
    form.innerHTML = `
        <h3>编辑道具</h3>
        <form id="editItemForm">
            <div class="form-group">
                <label>道具名称：</label>
                <input type="text" id="itemName" value="${item.name}" required>
            </div>
            <div class="form-group">
                <label>分类：</label>
                <select id="itemCategory" required>
                    <option value="交通工具" ${item.category === '交通工具' ? 'selected' : ''}>交通工具</option>
                    <option value="生活用品" ${item.category === '生活用品' ? 'selected' : ''}>生活用品</option>
                    <option value="战斗道具" ${item.category === '战斗道具' ? 'selected' : ''}>战斗道具</option>
                    <option value="娱乐道具" ${item.category === '娱乐道具' ? 'selected' : ''}>娱乐道具</option>
                    <option value="学习道具" ${item.category === '学习道具' ? 'selected' : ''}>学习道具</option>
                    <option value="医疗道具" ${item.category === '医疗道具' ? 'selected' : ''}>医疗道具</option>
                    <option value="时空道具" ${item.category === '时空道具' ? 'selected' : ''}>时空道具</option>
                </select>
            </div>
            <div class="form-group">
                <label>描述：</label>
                <textarea id="itemDescription" required>${item.description}</textarea>
            </div>
            <div class="form-group">
                <label>图片链接：</label>
                <input type="url" id="itemImage" value="${item.image}" required>
            </div>
            <div class="form-group">
                <label>特性标签（用逗号分隔）：</label>
                <input type="text" id="itemFeatures" value="${item.features.join(', ')}">
            </div>
            <div class="form-group">
                <label>出现位置信息：</label>
                <div id="appearancesContainer">
                    ${item.appearances ? item.appearances.map((appearance, index) => `
                        <div class="appearance-item">
                            <select class="appearance-type">
                                <option value="season" ${appearance.type === 'season' ? 'selected' : ''}>季数</option>
                                <option value="movie" ${appearance.type === 'movie' ? 'selected' : ''}>电影</option>
                            </select>
                            ${appearance.type === 'season' ? 
                                `<input type="text" class="appearance-value" placeholder="如：第1季" value="${appearance.value}">
                                 <input type="text" class="appearance-episode" placeholder="如：第1集" value="${appearance.episode}">` :
                                `<input type="text" class="appearance-value" placeholder="如：大雄的恐龙" value="${appearance.value}">
                                 <input type="text" class="appearance-year" placeholder="如：1980" value="${appearance.year}">`
                            }
                            <button type="button" class="remove-appearance" onclick="removeAppearance(${index})">删除</button>
                        </div>
                    `).join('') : ''}
                </div>
                <button type="button" class="add-appearance-btn" onclick="addAppearance()">+ 添加出现位置</button>
            </div>
            <div class="form-buttons">
                <button type="submit" class="save-btn">保存</button>
                <button type="button" class="cancel-btn" onclick="closeEditForm()">取消</button>
                <button type="button" class="delete-btn" onclick="deleteItem(${item.id})">删除道具</button>
            </div>
        </form>
    `;
    
    document.body.appendChild(form);
    document.getElementById('editItemForm').addEventListener('submit', (e) => updateItem(e, itemId));
}

// 更新道具
async function updateItem(e, itemId) {
    e.preventDefault();
    
    const itemIndex = doraemonItems.findIndex(item => item.id === itemId);
    if (itemIndex === -1) return;
    
    // 收集出现位置信息
    const appearances = [];
    const appearanceItems = document.querySelectorAll('.appearance-item');
    appearanceItems.forEach(item => {
        const type = item.querySelector('.appearance-type').value;
        const value = item.querySelector('.appearance-value').value.trim();
        
        if (value) {
            if (type === 'season') {
                const episode = item.querySelector('.appearance-episode').value.trim();
                if (episode) {
                    appearances.push({ type, value, episode });
                }
            } else if (type === 'movie') {
                const year = item.querySelector('.appearance-year').value.trim();
                if (year) {
                    appearances.push({ type, value, year });
                }
            }
        }
    });
    
    doraemonItems[itemIndex] = {
        id: itemId,
        name: document.getElementById('itemName').value,
        category: document.getElementById('itemCategory').value,
        description: document.getElementById('itemDescription').value,
        image: document.getElementById('itemImage').value,
        features: document.getElementById('itemFeatures').value.split(',').map(f => f.trim()).filter(f => f),
        appearances: appearances
    };
    
    currentItems = [...doraemonItems];
    await saveData();
    
    closeEditForm();
    renderItems(currentItems);
    alert('道具更新成功！');
}

// 删除道具
async function deleteItem(itemId) {
    if (confirm('确定要删除这个道具吗？')) {
        doraemonItems = doraemonItems.filter(item => item.id !== itemId);
        currentItems = [...doraemonItems];
        await saveData();
        
        closeEditForm();
        renderItems(currentItems);
        alert('道具删除成功！');
    }
}

// 添加出现位置
function addAppearance() {
    const container = document.getElementById('appearancesContainer');
    const index = container.children.length;
    const appearanceItem = document.createElement('div');
    appearanceItem.className = 'appearance-item';
    appearanceItem.innerHTML = `
        <select class="appearance-type" onchange="updateAppearanceFields(this)">
            <option value="season">季数</option>
            <option value="movie">电影</option>
        </select>
        <input type="text" class="appearance-value" placeholder="如：第1季">
        <input type="text" class="appearance-episode" placeholder="如：第1集">
        <button type="button" class="remove-appearance" onclick="removeAppearance(${index})">删除</button>
    `;
    container.appendChild(appearanceItem);
}

// 删除出现位置
function removeAppearance(index) {
    const container = document.getElementById('appearancesContainer');
    const items = container.querySelectorAll('.appearance-item');
    if (items[index]) {
        items[index].remove();
        // 重新编号删除按钮
        container.querySelectorAll('.remove-appearance').forEach((btn, i) => {
            btn.onclick = () => removeAppearance(i);
        });
    }
}

// 更新出现位置字段
function updateAppearanceFields(select) {
    const item = select.parentElement;
    const valueInput = item.querySelector('.appearance-value');
    const extraInput = item.querySelector('.appearance-episode') || item.querySelector('.appearance-year');
    
    if (select.value === 'season') {
        if (extraInput && extraInput.className === 'appearance-year') {
            extraInput.remove();
        }
        if (!item.querySelector('.appearance-episode')) {
            const episodeInput = document.createElement('input');
            episodeInput.type = 'text';
            episodeInput.className = 'appearance-episode';
            episodeInput.placeholder = '如：第1集';
            valueInput.after(episodeInput);
        }
    } else if (select.value === 'movie') {
        if (extraInput && extraInput.className === 'appearance-episode') {
            extraInput.remove();
        }
        if (!item.querySelector('.appearance-year')) {
            const yearInput = document.createElement('input');
            yearInput.type = 'text';
            yearInput.className = 'appearance-year';
            yearInput.placeholder = '如：1980';
            valueInput.after(yearInput);
        }
    }
}

// 关闭编辑表单
function closeEditForm() {
    const form = document.getElementById('editForm');
    if (form) form.remove();
}

// 保存到本地存储
function saveToLocalStorage() {
    localStorage.setItem('doraemonItems', JSON.stringify(doraemonItems));
}

// 从本地存储加载
function loadFromLocalStorage() {
    const saved = localStorage.getItem('doraemonItems');
    if (saved) {
        const localItems = JSON.parse(saved);
        console.log("从本地存储加载数据:", localItems);
        doraemonItems = localItems;
        currentItems = [...doraemonItems];
    } else {
        console.log("本地存储中没有数据");
    }
}

// 更新统计信息
function updateStats() {
    const totalItems = doraemonItems.length;
    const filteredItems = currentItems.length;
    
    if (filteredItems === totalItems) {
        itemCount.innerHTML = `共找到 <strong>${totalItems}</strong> 个道具`;
    } else {
        itemCount.innerHTML = `共找到 <strong>${filteredItems}</strong> 个道具 (总计 ${totalItems} 个)`;
    }
}

// 设置事件监听器
function setupEventListeners() {
    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') performSearch();
    });
    categoryFilter.addEventListener('change', performFilter);
    clearFiltersBtn.addEventListener('click', clearAllFilters);
    closeModal.addEventListener('click', closeModalWindow);
    window.addEventListener('click', (e) => {
        if (e.target === modal) closeModalWindow();
    });
}

// 渲染道具列表
function renderItems(items) {
    if (items.length === 0) {
        itemsGrid.style.display = 'none';
        noResults.style.display = 'block';
        itemCount.innerHTML = '共找到 <strong>0</strong> 个道具';
    } else {
        itemsGrid.style.display = 'grid';
        noResults.style.display = 'none';
        itemCount.innerHTML = `共找到 <strong>${items.length}</strong> 个道具`;
        
        itemsGrid.innerHTML = items.map(item => `
            <div class="item-card" onclick="openModal(${item.id})">
                <img src="${item.image}" alt="${item.name}" class="item-image">
                <h3 class="item-title">${item.name}</h3>
                <span class="item-category">${item.category}</span>
                <p class="item-description">${item.description}</p>
                <div class="item-features">
                    ${(item.features || []).map(feature => `<span class="feature-tag">${feature}</span>`).join('')}
                </div>
                <div class="item-appearances">
                    <h4>出现位置：</h4>
                    ${item.appearances ? item.appearances.map(appearance => {
                        if (appearance.type === 'season') {
                            return `<span class="appearance-tag season">${appearance.value} ${appearance.episode || ''}</span>`;
                        } else if (appearance.type === 'movie') {
                            return `<span class="appearance-tag movie">${appearance.value} (${appearance.year || ''})</span>`;
                        } else {
                            return `<span class="appearance-tag">${appearance.value}</span>`;
                        }
                    }).join('') : '<span class="appearance-tag">暂无信息</span>'}
                </div>
                ${isAdmin ? `<div class="admin-controls">
                    <button class="edit-btn" onclick="event.stopPropagation(); showEditItemForm(${item.id})">✏️ 编辑</button>
                </div>` : ''}
            </div>
        `).join('');
    }
}

// 执行搜索
function performSearch() {
    searchTerm = searchInput.value.trim().toLowerCase();
    filterItems();
}

// 执行筛选
function performFilter() {
    selectedCategory = categoryFilter.value;
    filterItems();
}

// 筛选道具
function filterItems() {
    let filteredItems = doraemonItems;
    if (selectedCategory) {
        filteredItems = filteredItems.filter(item => item.category === selectedCategory);
    }
    if (searchTerm) {
        filteredItems = filteredItems.filter(item => 
            item.name.toLowerCase().includes(searchTerm) ||
            item.description.toLowerCase().includes(searchTerm) ||
            (item.features || []).some(feature => feature.toLowerCase().includes(searchTerm))
        );
    }
    currentItems = filteredItems;
    renderItems(currentItems);
}

// 清除所有筛选
function clearAllFilters() {
    searchInput.value = '';
    categoryFilter.value = '';
    searchTerm = '';
    selectedCategory = '';
    currentItems = [...doraemonItems];
    renderItems(currentItems);
}

// 打开模态框
function openModal(itemId) {
    const item = doraemonItems.find(item => item.id === itemId);
    if (!item) return;

    modalContent.innerHTML = `
        <img src="${item.image}" alt="${item.name}" class="modal-item-image">
        <h2 class="modal-item-title">${item.name}</h2>
        <span class="modal-item-category">${item.category}</span>
        <p class="modal-item-description">${item.description}</p>
        <div class="modal-item-features">
            ${(item.features || []).map(feature => `<span class="modal-feature-tag">${feature}</span>`).join('')}
        </div>
        <div class="modal-item-appearances">
            <h3>出现位置：</h3>
            ${item.appearances ? item.appearances.map(appearance => {
                if (appearance.type === 'season') {
                    return `<span class="modal-appearance-tag season">${appearance.value} ${appearance.episode}</span>`;
                } else if (appearance.type === 'movie') {
                    return `<span class="modal-appearance-tag movie">${appearance.value} (${appearance.year})</span>`;
                }
            }).join('') : '<span class="modal-appearance-tag">暂无信息</span>'}
        </div>
        ${isAdmin ? `<div class="modal-admin-controls">
            <button class="edit-btn" onclick="showEditItemForm(${item.id}); closeModalWindow();">✏️ 编辑道具</button>
        </div>` : ''}
    `;

    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// 关闭模态框
function closeModalWindow() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// 防抖函数
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

// 实时搜索（防抖）
const debouncedSearch = debounce(() => {
    performSearch();
}, 300);

// 添加实时搜索监听
searchInput.addEventListener('input', debouncedSearch);

// 页面加载完成后初始化应用
document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

// 添加键盘快捷键
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.style.display === 'block') {
        closeModalWindow();
    }
    if (e.ctrlKey && e.key === 'f') {
        e.preventDefault();
        searchInput.focus();
    }
});
