// 主应用逻辑
// 使用全局的DataManager变量

class App {
    constructor() {
        this.currentView = 'home';
        this.supabaseStorageUrl = 'https://yykqbhuzsnwdrlyhbwdu.supabase.co/storage/v1/object/public/images';
        this.init();
    }

    // 解析图片URL：Supabase Storage 路径转完整 URL
    resolveImageUrl(path) {
        if (!path) return this.getDefaultItemImage();
        if (path.startsWith('http')) return path;
        if (path.startsWith('items/') || path.startsWith('categories/')) {
            return `${this.supabaseStorageUrl}/${path}`;
        }
        // 本地路径兼容（含#等特殊字符时编码）
        if (path.startsWith('images/')) {
            const filename = path.replace('images/', '');
            return 'images/' + encodeURIComponent(filename);
        }
        return path;
    }
    
    // 初始化应用
    async init() {
        // 加载数据
        const dataLoaded = await DataManager.loadData();
        if (!dataLoaded) {
            console.error('数据加载失败，应用无法启动');
            return;
        }
        
        // 初始化导航
        this.initNavigation();
        
        // 初始化搜索功能
        this.initSearch();
        
        // 渲染首页
        this.renderHome();
        
        // 初始化分类下拉菜单
        this.initCategoryDropdown();
    }
    
    // 初始化导航
    initNavigation() {
        const navButtons = document.querySelectorAll('.nav-btn');
        navButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const view = e.target.dataset.view;
                this.switchView(view);
            });
        });
        
        // 面包屑导航
        const breadcrumbLinks = document.querySelectorAll('.breadcrumb-link');
        breadcrumbLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const view = e.target.dataset.view;
                if (view) {
                    this.switchView(view);
                } else {
                    // 处理分类面包屑
                    const categoryId = e.target.dataset.categoryId;
                    if (categoryId) {
                        this.switchToCategory(categoryId);
                    }
                }
            });
        });
    }
    
    // 初始化搜索功能
    initSearch() {
        const searchBtn = document.getElementById('search-btn');
        const searchInput = document.getElementById('search-input');
        
        searchBtn.addEventListener('click', () => {
            this.performSearch();
        });
        
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.performSearch();
            }
        });
    }
    
    // 初始化分类下拉菜单
    initCategoryDropdown() {
        const dropdown = document.getElementById('search-category');
        const categories = DataManager.getCategories();
        
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.name;
            dropdown.appendChild(option);
        });
    }
    
    // 切换视图
    switchView(view) {
        // 隐藏所有视图
        document.querySelectorAll('.view').forEach(v => {
            v.style.display = 'none';
        });
        
        // 显示目标视图
        document.getElementById(`${view}-view`).style.display = 'block';
        
        // 更新导航按钮状态
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-view="${view}"]`).classList.add('active');
        
        // 记录当前视图
        this.currentView = view;
        
        // 渲染对应视图
        switch(view) {
            case 'home':
                this.renderHome();
                break;
            case 'search':
                this.renderSearch();
                break;
            case 'about':
                this.renderAbout();
                break;
        }
    }
    
    // 渲染首页
    renderHome() {
        const categoriesGrid = document.getElementById('categories-grid');
        const categories = DataManager.getCategories();
        
        categoriesGrid.innerHTML = '';
        
        categories.forEach(category => {
            const categoryCard = document.createElement('div');
            categoryCard.className = 'category-card fade-in-up';
            categoryCard.dataset.categoryId = category.id;
            
            // 生成图片路径
            const imagePath = this.resolveImageUrl(category.image || this.getDefaultCategoryImage(category.id));
            
            categoryCard.innerHTML = `
                <div class="corner-decor"></div>
                <div class="category-image">
                    <img src="${imagePath}" alt="${category.name}">
                </div>
                <div class="category-info">
                    <h3>${category.name}</h3>
                    <p>${category.description}</p>
                    <div class="category-meta">
                        <span class="tag">${category.items_count} 件藏品</span>
                        <span class="tag">${category.type}</span>
                    </div>
                </div>
            `;
            
            // 添加点击事件
            categoryCard.addEventListener('click', () => {
                this.switchToCategory(category.id);
            });
            
            categoriesGrid.appendChild(categoryCard);
        });
    }
    
    // 切换到分类详情
    switchToCategory(categoryId) {
        const category = DataManager.getCategoryById(categoryId);
        if (!category) return;
        
        // 显示分类视图
        document.querySelectorAll('.view').forEach(v => {
            v.style.display = 'none';
        });
        document.getElementById('category-view').style.display = 'block';
        
        // 更新面包屑
        document.getElementById('breadcrumb-current').textContent = category.name;
        
        // 渲染分类详情
        this.renderCategoryDetail(category);
        
        // 渲染藏品列表
        this.renderItemsByCategory(categoryId);
    }
    
    // 渲染分类详情
    renderCategoryDetail(category) {
        const categoryDetail = document.getElementById('category-detail');
        
        // 生成图片路径
        const imagePath = this.resolveImageUrl(category.image || this.getDefaultCategoryImage(category.id));

        categoryDetail.innerHTML = `
            <div class="category-detail-header">
                <div class="category-detail-image">
                    <img src="${imagePath}" alt="${category.name}">
                </div>
                <div class="category-detail-info">
                    <h2>${category.name}</h2>
                    <p>${category.description}</p>
                    <div class="chinese-divider"><span class="dot"></span></div>
                    <div class="category-meta">
                        <span class="tag">${category.items_count} 件藏品</span>
                        <span class="tag">${category.type}</span>
                        <span class="tag">${category.period}</span>
                    </div>
                </div>
            </div>
        `;
    }
    
    // 渲染分类下的藏品
    renderItemsByCategory(categoryId) {
        const itemsGrid = document.getElementById('items-grid');
        const items = DataManager.getItemsByCategory(categoryId);
        
        itemsGrid.innerHTML = '';
        
        items.forEach(item => {
            const itemCard = document.createElement('div');
            itemCard.className = 'item-card fade-in-up';
            itemCard.dataset.itemId = item.id;
            
            // 生成图片路径
            const imagePath = this.resolveImageUrl(
                item.images && item.images.length > 0
                    ? item.images[0]
                    : this.getDefaultItemImage()
            );

            itemCard.innerHTML = `
                <div class="corner-decor"></div>
                <div class="item-image">
                    <img src="${imagePath}" alt="${item.name}">
                </div>
                <div class="item-info">
                    <h4>${item.name}</h4>
                    <div class="item-meta">
                        <span class="meta-item">${item.date}</span>
                        <span class="meta-item">${item.period}</span>
                        <span class="meta-item">${item.likes || 0} 点赞</span>
                    </div>
                </div>
            `;

            // 添加点击事件
            itemCard.addEventListener('click', () => {
                this.switchToItem(item.id, categoryId);
            });

            itemsGrid.appendChild(itemCard);
        });
    }

    // 切换到藏品详情
    switchToItem(itemId, categoryId) {
        const item = DataManager.getItemById(itemId);
        const category = DataManager.getCategoryById(categoryId);
        if (!item || !category) return;
        
        // 显示藏品视图
        document.querySelectorAll('.view').forEach(v => {
            v.style.display = 'none';
        });
        document.getElementById('item-view').style.display = 'block';
        
        // 更新面包屑
        document.getElementById('breadcrumb-category').textContent = category.name;
        document.getElementById('breadcrumb-category').dataset.categoryId = categoryId;
        document.getElementById('breadcrumb-item').textContent = item.name;
        
        // 渲染藏品详情
        this.renderItemDetail(item);
    }
    
    // 渲染藏品详情
    renderItemDetail(item) {
        const itemDetail = document.getElementById('item-detail');
        
        // 生成图片路径
        const mainImage = this.resolveImageUrl(
            item.images && item.images.length > 0
                ? item.images[0]
                : this.getDefaultItemImage()
        );

        // 生成缩略图
        const thumbsHtml = item.images && item.images.length > 0
            ? item.images.map((img, index) => `
                <div class="gallery-thumb ${index === 0 ? 'active' : ''}" data-index="${index}">
                    <img src="${this.resolveImageUrl(img)}" alt="${item.name}">
                </div>
            `).join('')
            : '';

        itemDetail.innerHTML = `
            <div class="item-gallery">
                <div class="gallery-main">
                    <img src="${mainImage}" alt="${item.name}">
                    <div class="seal">藏</div>
                </div>
                ${thumbsHtml ? `
                    <div class="gallery-thumbs">
                        ${thumbsHtml}
                    </div>
                ` : ''}
            </div>
            <div class="item-info-detail">
                <h2>${item.name}</h2>
                <div class="item-properties">
                    <div class="property">
                        <span class="property-label">年代</span>
                        <span class="property-value">${item.period}</span>
                    </div>
                    <div class="property">
                        <span class="property-label">材质</span>
                        <span class="property-value">${item.material}</span>
                    </div>
                    <div class="property">
                        <span class="property-label">尺寸</span>
                        <span class="property-value">${item.size || '不详'}</span>
                    </div>
                    <div class="property">
                        <span class="property-label">来源</span>
                        <span class="property-value">${item.source || '私人收藏'}</span>
                    </div>
                    <div class="property">
                        <span class="property-label">发布日期</span>
                        <span class="property-value">${item.date}</span>
                    </div>
                    <div class="property">
                        <span class="property-label">收藏编号</span>
                        <span class="property-value">${item.id}</span>
                    </div>
                </div>
                ${item.description ? `
                    <div class="item-description">
                        <h3>藏品描述</h3>
                        <p>${item.description}</p>
                    </div>
                ` : ''}
                ${item.notes ? `
                    <div class="item-notes">
                        <h3>收藏笔记</h3>
                        <p>${item.notes}</p>
                    </div>
                ` : ''}
            </div>
        `;
        
        // 绑定缩略图点击事件
        const thumbs = itemDetail.querySelectorAll('.gallery-thumb');
        const mainImg = itemDetail.querySelector('.gallery-main img');
        
        thumbs.forEach(thumb => {
            thumb.addEventListener('click', () => {
                const index = parseInt(thumb.dataset.index);
                const image = item.images[index];
                mainImg.src = this.resolveImageUrl(image);
                
                // 更新活动状态
                thumbs.forEach(t => t.classList.remove('active'));
                thumb.classList.add('active');
            });
        });
    }
    
    // 渲染搜索页面
    renderSearch() {
        // 重置搜索状态
        document.getElementById('search-input').value = '';
        document.getElementById('search-category').value = 'all';
        document.getElementById('search-placeholder').style.display = 'block';
        document.getElementById('no-results').style.display = 'none';
        document.getElementById('search-results').innerHTML = '';
        document.getElementById('results-count').textContent = '';
    }
    
    // 执行搜索
    performSearch() {
        const keyword = document.getElementById('search-input').value.trim();
        const categoryId = document.getElementById('search-category').value;
        
        const results = DataManager.searchItems(keyword, categoryId);
        
        // 隐藏占位符
        document.getElementById('search-placeholder').style.display = 'none';
        
        // 显示结果数量
        document.getElementById('results-count').textContent = `找到 ${results.length} 件藏品`;
        
        // 渲染搜索结果
        const resultsContainer = document.getElementById('search-results');
        resultsContainer.innerHTML = '';
        
        if (results.length === 0) {
            document.getElementById('no-results').style.display = 'block';
            return;
        }
        
        document.getElementById('no-results').style.display = 'none';
        
        results.forEach(item => {
            const itemCard = document.createElement('div');
            itemCard.className = 'item-card fade-in-up';
            itemCard.dataset.itemId = item.id;
            
            // 生成图片路径
            const imagePath = this.resolveImageUrl(
                item.images && item.images.length > 0
                    ? item.images[0]
                    : this.getDefaultItemImage()
            );

            // 获取分类信息
            const category = DataManager.getCategoryById(item.category_id);

            itemCard.innerHTML = `
                <div class="corner-decor"></div>
                <div class="item-image">
                    <img src="${imagePath}" alt="${item.name}">
                </div>
                <div class="item-info">
                    <h4>${item.name}</h4>
                    <div class="item-meta">
                        <span class="meta-item">${category ? category.name : '未分类'}</span>
                        <span class="meta-item">${item.date}</span>
                        <span class="meta-item">${item.likes || 0} 点赞</span>
                    </div>
                </div>
            `;
            
            // 添加点击事件
            itemCard.addEventListener('click', () => {
                this.switchToItem(item.id, item.category_id);
            });
            
            resultsContainer.appendChild(itemCard);
        });
    }
    
    // 渲染关于页面
    renderAbout() {
        // 关于页面内容已在HTML中静态定义
    }
    
    // 获取默认分类图片
    getDefaultCategoryImage(categoryId) {
        const defaultImages = {
            'wood': 'images/284_朱红贴金花板_1.jpg',
            'jade': 'images/005_籽料白玉红沁藕片_1.jpg',
            'coin': 'images/256_6个版别大观折十_1.jpg',
            'porcelain': 'images/251_室无瓷不雅_1.jpg',
            'tiantai': 'images/247_一根藤。天台特产一根藤，古有东阳雕天台条之说，天台一根藤软条，由数百节弯曲小木条_1.jpg'
        };
        return defaultImages[categoryId] || 'images/252_济公_1.jpg';
    }
    
    // 获取默认藏品图片
    getDefaultItemImage() {
        return 'images/252_济公_1.jpg';
    }
}

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
    new App();
});