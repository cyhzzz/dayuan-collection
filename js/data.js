// 数据管理模块 — 等待 Supabase SDK 加载后初始化
const DataManager = {
    categories: [],
    items: [],
    currentCategory: null,
    currentItem: null,
    _ready: false,

    // 等待 SDK 就绪
    async _waitForSDK() {
        if (window.supabase && window.supabase.createClient) return;
        return new Promise((resolve) => {
            window.addEventListener('supabase-ready', resolve, { once: true });
        });
    },

    // 加载所有数据（仅 Supabase）
    async loadData() {
        await this._waitForSDK();
        const { createClient } = window.supabase;

        const supabaseUrl = 'https://yykqbhuzsnwdrlyhbwdu.supabase.co';
        const supabaseKey = 'sb_publishable_cwKH3e5N24GE65spjuz8aQ_lQp78Hol';
        const client = createClient(supabaseUrl, supabaseKey);

        try {
            const [catRes, itemRes] = await Promise.all([
                client.from('categories').select('*'),
                client.from('items').select('*')
            ]);

            if (catRes.error) throw catRes.error;
            if (itemRes.error) throw itemRes.error;

            this.categories = catRes.data || [];
            this.items = itemRes.data || [];
            this._ready = true;

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
