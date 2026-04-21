// 初始化 Supabase 客户端
const supabaseUrl = 'https://yykqbhuzsnwdrlyhbwdu.supabase.co';
const supabaseKey = 'sb_publishable_cwKH3e5N24GE65spjuz8aQ_lQp78Hol';

if (!window.supabase) {
    window.supabase = window.supabase.createClient(supabaseUrl, supabaseKey);
}

// 数据管理模块 — 仅从 Supabase 加载
const DataManager = {
    categories: [],
    items: [],
    currentCategory: null,
    currentItem: null,

    // 加载所有数据（仅 Supabase）
    async loadData() {
        try {
            const [catRes, itemRes] = await Promise.all([
                window.supabase.from('categories').select('*'),
                window.supabase.from('items').select('*')
            ]);

            if (catRes.error) throw catRes.error;
            if (itemRes.error) throw itemRes.error;

            this.categories = catRes.data || [];
            this.items = itemRes.data || [];

            console.log('数据加载成功:', {
                categories: this.categories.length,
                items: this.items.length
            });

            return true;
        } catch (error) {
            console.error('从 Supabase 加载数据失败:', error);
            this.categories = [];
            this.items = [];
            return false;
        }
    },

    getCategories() {
        return this.categories;
    },

    getCategoryById(id) {
        return this.categories.find(c => c.id === id);
    },

    getItemsByCategory(categoryId) {
        return this.items.filter(item => item.category_id === categoryId);
    },

    getItemById(id) {
        return this.items.find(item => item.id === id);
    },

    searchItems(keyword, categoryId = 'all') {
        let results = this.items;
        if (categoryId !== 'all') {
            results = results.filter(item => item.category_id === categoryId);
        }
        if (keyword) {
            const kw = keyword.toLowerCase();
            results = results.filter(item =>
                item.name.toLowerCase().includes(kw) ||
                (item.description && item.description.toLowerCase().includes(kw)) ||
                (item.notes && item.notes.toLowerCase().includes(kw))
            );
        }
        return results;
    },

    getPopularItems(limit = 6) {
        return [...this.items]
            .sort((a, b) => (b.likes || 0) - (a.likes || 0))
            .slice(0, limit);
    },

    getLatestItems(limit = 6) {
        return [...this.items]
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, limit);
    },

    getItemsByType(type, limit = 6) {
        return this.items
            .filter(item => item.type === type)
            .slice(0, limit);
    },

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

window.DataManager = DataManager;
