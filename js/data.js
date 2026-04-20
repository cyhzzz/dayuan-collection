// 初始化 Supabase 客户端
const supabaseUrl = 'https://yykqbhuzsnwdrlyhbwdu.supabase.co';
const supabaseKey = 'sb_publishable_cwKH3e5N24GE65spjuz8aQ_lQp78Hol';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

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
                const { error } = await supabase
                    .from('categories')
                    .insert(category)
                    .onConflict('id')
                    .ignore();
                if (error) {
                    console.error('插入分类数据失败:', error);
                }
            }

            // 尝试直接插入藏品数据，如果表不存在，Supabase 会自动创建表结构
            const itemsResponse = await fetch('assets/data/items.json');
            const localItems = await itemsResponse.json();
            
            for (const item of localItems) {
                const { error } = await supabase
                    .from('items')
                    .insert({
                        ...item,
                        images: item.images // Supabase 会自动处理 JSON 数据
                    })
                    .onConflict('id')
                    .ignore();
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
            // 初始化数据库
            await this.initDatabase();
            
            // 从 Supabase 加载数据
            const { data: categories, error: categoriesError } = await supabase
                .from('categories')
                .select('*');

            const { data: items, error: itemsError } = await supabase
                .from('items')
                .select('*');

            if (categoriesError || itemsError) {
                console.error('从 Supabase 加载数据失败:', categoriesError, itemsError);
                // 失败时使用本地数据
                const categoriesResponse = await fetch('assets/data/categories.json');
                this.categories = await categoriesResponse.json();
                
                const itemsResponse = await fetch('assets/data/items.json');
                this.items = await itemsResponse.json();
            } else {
                this.categories = categories;
                this.items = items;
            }
            
            console.log('数据加载成功:', {
                categories: this.categories.length,
                items: this.items.length
            });
            
            return true;
        } catch (error) {
            console.error('数据加载失败:', error);
            // 失败时使用本地数据
            try {
                const categoriesResponse = await fetch('assets/data/categories.json');
                this.categories = await categoriesResponse.json();
                
                const itemsResponse = await fetch('assets/data/items.json');
                this.items = await itemsResponse.json();
                return true;
            } catch (localError) {
                console.error('本地数据加载失败:', localError);
                return false;
            }
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