// 初始化 Supabase 客户端
const supabaseUrl = 'https://yykqbhuzsnwdrlyhbwdu.supabase.co';
const supabaseKey = 'sb_publishable_cwKH3e5N24GE65spjuz8aQ_lQp78Hol';
// 确保 supabase 客户端被正确初始化
if (!window.supabase) {
    window.supabase = window.supabase.createClient(supabaseUrl, supabaseKey);
}
// 直接使用全局的 supabase 变量

// 数据管理模块
const DataManager = {
    categories: [],
    items: [],
    currentCategory: null,
    currentItem: null,
    
    // 初始化数据库表
    async initDatabase() {
        try {
            // 尝试直接插入分类数据，如果表不存在，Supabase 会自动创建表结构
            const categoriesResponse = await fetch('assets/data/categories.json');
            const localCategories = await categoriesResponse.json();
            
            for (const category of localCategories) {
                const { error } = await window.supabase
                    .from('categories')
                    .upsert(category, { onConflict: 'id' });
                if (error) {
                    console.error('插入分类数据失败:', error);
                }
            }

            // 尝试直接插入藏品数据，如果表不存在，Supabase 会自动创建表结构
            const itemsResponse = await fetch('assets/data/items.json');
            const localItems = await itemsResponse.json();
            
            for (const item of localItems) {
                // 检查图片路径是否为本地路径，如果是则保持不变
                // 后续可以添加逻辑将本地图片上传到 Supabase Storage
                const { error } = await window.supabase
                    .from('items')
                    .upsert({
                        ...item,
                        images: item.images // Supabase 会自动处理 JSON 数据
                    }, { onConflict: 'id' });
                if (error) {
                    console.error('插入藏品数据失败:', error);
                }
            }
        } catch (error) {
            console.error('初始化数据库失败:', error);
        }
    },
    
    // 加载所有数据
    async loadData() {
        try {
            // 先尝试从本地存储加载缓存数据
            const cachedData = localStorage.getItem('dayuan-collection-data');
            if (cachedData) {
                try {
                    const parsedData = JSON.parse(cachedData);
                    this.categories = parsedData.categories;
                    this.items = parsedData.items;
                    console.log('从本地缓存加载数据成功');
                    // 异步更新数据，不阻塞页面加载
                    this.updateDataInBackground();
                    return true;
                } catch (e) {
                    console.error('解析缓存数据失败:', e);
                }
            }
            
            // 初始化数据库
            await this.initDatabase();
            
            // 并行加载数据
            const [categoriesResult, itemsResult] = await Promise.all([
                window.supabase.from('categories').select('*'),
                window.supabase.from('items').select('*')
            ]);

            if (categoriesResult.error || itemsResult.error) {
                console.error('从 Supabase 加载数据失败:', categoriesResult.error, itemsResult.error);
                // 失败时使用本地数据
                const [categoriesResponse, itemsResponse] = await Promise.all([
                    fetch('assets/data/categories.json'),
                    fetch('assets/data/items.json')
                ]);
                
                this.categories = await categoriesResponse.json();
                this.items = await itemsResponse.json();
            } else {
                this.categories = categoriesResult.data;
                this.items = itemsResult.data;
            }
            
            // 缓存数据到本地存储
            localStorage.setItem('dayuan-collection-data', JSON.stringify({
                categories: this.categories,
                items: this.items
            }));
            
            console.log('数据加载成功:', {
                categories: this.categories.length,
                items: this.items.length
            });
            
            return true;
        } catch (error) {
            console.error('数据加载失败:', error);
            // 失败时使用本地数据
            try {
                const [categoriesResponse, itemsResponse] = await Promise.all([
                    fetch('assets/data/categories.json'),
                    fetch('assets/data/items.json')
                ]);
                
                this.categories = await categoriesResponse.json();
                this.items = await itemsResponse.json();
                
                // 缓存数据到本地存储
                localStorage.setItem('dayuan-collection-data', JSON.stringify({
                    categories: this.categories,
                    items: this.items
                }));
                
                return true;
            } catch (localError) {
                console.error('本地数据加载失败:', localError);
                return false;
            }
        }
    },
    
    // 后台更新数据
    async updateDataInBackground() {
        try {
            const [categoriesResult, itemsResult] = await Promise.all([
                window.supabase.from('categories').select('*'),
                window.supabase.from('items').select('*')
            ]);

            if (!categoriesResult.error && !itemsResult.error) {
                this.categories = categoriesResult.data;
                this.items = itemsResult.data;
                
                // 更新缓存
                localStorage.setItem('dayuan-collection-data', JSON.stringify({
                    categories: this.categories,
                    items: this.items
                }));
                
                console.log('后台数据更新成功');
            }
        } catch (error) {
            console.error('后台数据更新失败:', error);
        }
    },
    
    // 获取所有分类
    getCategories() {
        return this.categories;
    },
    
    // 根据ID获取分类
    getCategoryById(id) {
        return this.categories.find(category => category.id === id);
    },
    
    // 获取分类下的藏品
    getItemsByCategory(categoryId) {
        return this.items.filter(item => item.category_id === categoryId);
    },
    
    // 根据ID获取藏品
    getItemById(id) {
        return this.items.find(item => item.id === id);
    },
    
    // 搜索藏品
    searchItems(keyword, categoryId = 'all') {
        let results = this.items;
        
        // 按分类过滤
        if (categoryId !== 'all') {
            results = results.filter(item => item.category_id === categoryId);
        }
        
        // 按关键词搜索
        if (keyword) {
            const lowerKeyword = keyword.toLowerCase();
            results = results.filter(item => 
                item.name.toLowerCase().includes(lowerKeyword) ||
                (item.description && item.description.toLowerCase().includes(lowerKeyword)) ||
                (item.notes && item.notes.toLowerCase().includes(lowerKeyword))
            );
        }
        
        return results;
    },
    
    // 获取热门藏品
    getPopularItems(limit = 6) {
        return [...this.items]
            .sort((a, b) => (b.likes || 0) - (a.likes || 0))
            .slice(0, limit);
    },
    
    // 获取最新藏品
    getLatestItems(limit = 6) {
        return [...this.items]
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, limit);
    },
    
    // 按类型获取藏品
    getItemsByType(type, limit = 6) {
        return this.items
            .filter(item => item.type === type)
            .slice(0, limit);
    },
    
    // 统计数据
    getStats() {
        return {
            totalCategories: this.categories.length,
            totalItems: this.items.length,
            totalLikes: this.items.reduce((sum, item) => sum + (item.likes || 0), 0),
            totalComments: this.items.reduce((sum, item) => sum + (item.comments || 0), 0),
            totalCollections: this.items.reduce((sum, item) => sum + (item.collections || 0), 0)
        };
    }
};

// 导出数据管理器
window.DataManager = DataManager;