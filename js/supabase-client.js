// Supabase REST API 轻量客户端 — 无需外部 SDK
// 直接用 fetch 调用 Supabase REST API，避免 Tracking Prevention 拦截
class SupabaseClient {
  constructor(url, apiKey) {
    this.url = url;
    this.apiKey = apiKey;
    this.headers = {
      'apikey': apiKey,
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    };
  }

  from(table) {
    return new TableQuery(this.url, this.apiKey, table);
  }

  // Storage 上传
  async upload(bucket, path, file) {
    const formData = new FormData();
    formData.append('file', file);
    const resp = await fetch(
      `${this.url}/storage/v1/object/${bucket}/${path}`,
      {
        method: 'POST',
        headers: {
          'apikey': this.apiKey,
          'Authorization': `Bearer ${this.apiKey}`,
          'x-upsert': 'true'
        },
        body: formData
      }
    );
    if (!resp.ok) throw new Error(`Storage upload failed: ${resp.status}`);
    return resp.json();
  }

  // Storage 删除
  async remove(bucket, paths) {
    const resp = await fetch(
      `${this.url}/storage/v1/object/${bucket}`,
      {
        method: 'DELETE',
        headers: {
          'apikey': this.apiKey,
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prefixes: paths })
      }
    );
    return resp.json();
  }

  // Storage 公开 URL
  getPublicUrl(bucket, path) {
    return `${this.url}/storage/v1/object/public/${bucket}/${path}`;
  }
}

class TableQuery {
  constructor(baseUrl, apiKey, table) {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
    this.table = table;
    this.selectFields = '*';
    this.filters = [];
    this.orderField = null;
    this.orderAsc = true;
    this.limitVal = null;
    this.offsetVal = null;
    this.single = false;
    this._headOnly = false;
  }

  select(fields, options) {
    this.selectFields = fields;
    if (options && options.head) this._headOnly = true;
    return this;
  }

  eq(column, value) {
    this.filters.push(`${column}=eq.${encodeURIComponent(value)}`);
    return this;
  }

  neq(column, value) {
    this.filters.push(`${column}=neq.${encodeURIComponent(value)}`);
    return this;
  }

  order(field, { ascending = true } = {}) {
    this.orderField = field;
    this.orderAsc = ascending;
    return this;
  }

  limit(n) {
    this.limitVal = n;
    return this;
  }

  offset(n) {
    this.offsetVal = n;
    return this;
  }

  single() {
    this.single = true;
    return this;
  }

  _buildUrl() {
    let url = `${this.baseUrl}/rest/v1/${this.table}?select=${encodeURIComponent(this.selectFields)}`;
    if (this.filters.length > 0) {
      url += '&' + this.filters.join('&');
    }
    if (this.orderField) {
      url += `&order=${this.orderField}.${this.orderAsc ? 'asc' : 'desc'}`;
    }
    if (this.limitVal !== null) {
      url += `&limit=${this.limitVal}`;
    }
    if (this.offsetVal !== null) {
      url += `&offset=${this.offsetVal}`;
    }
    if (this.single) {
      url += '&single=true';
    }
    return url;
  }

  async _request(method, body = null) {
    const url = this._buildUrl();
    const headers = {
      'apikey': this.apiKey,
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json'
    };
    if (this.single || method === 'POST') {
      headers['Prefer'] = 'return=representation';
    }
    const options = { method, headers };
    if (body) options.body = JSON.stringify(body);

    const resp = await fetch(url, options);
    const data = await resp.json();

    if (!resp.ok) {
      return { data: null, error: { message: data.message || `HTTP ${resp.status}`, status: resp.status }, count: null };
    }

    // Supabase 返回的 count 在 Content-Range header 中
    let count = null;
    const contentRange = resp.headers.get('content-range');
    if (contentRange) {
      const parts = contentRange.split('/');
      if (parts[1] !== '*') count = parseInt(parts[1]);
    }

    if (this.single) {
      return { data: Array.isArray(data) ? data[0] : data, error: null, count };
    }
    return { data, error: null, count };
  }

  // 使 TableQuery 成为 thenable，支持 await
  then(resolve, reject) {
    if (this._headOnly) {
      this.selectCount().then(resolve).catch(reject);
    } else {
      this._request('GET').then(resolve).catch(reject);
    }
  }

  // 只获取数量
  async selectCount() {
    const url = `${this.baseUrl}/rest/v1/${this.table}?select=${encodeURIComponent(this.selectFields)}&${this.filters.join('&')}`;
    const resp = await fetch(url, {
      method: 'HEAD',
      headers: {
        'apikey': this.apiKey,
        'Authorization': `Bearer ${this.apiKey}`,
        'Prefer': 'count=exact'
      }
    });
    const contentRange = resp.headers.get('content-range');
    if (contentRange) {
      const parts = contentRange.split('/');
      if (parts[1] !== '*') return { count: parseInt(parts[1]) };
    }
    return { count: 0 };
  }

  async fetch() {
    return this._request('GET');
  }

  async insert(row) {
    return this._request('POST', row);
  }

  async upsert(row, { onConflict } = {}) {
    const headers = {
      'apikey': this.apiKey,
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
      'Prefer': `resolution=${onConflict ? 'merge-duplicates' : 'merge'},return=representation`
    };
    if (onConflict) headers['Prefer'] += `,on_conflict=${onConflict}`;

    const url = this._buildUrl().replace(/&single=true/, '');
    const resp = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(row)
    });
    const data = await resp.json();
    if (!resp.ok) {
      return { data: null, error: { message: data.message || `HTTP ${resp.status}`, status: resp.status } };
    }
    return { data, error: null };
  }

  async update(updates) {
    const url = this._buildUrl().replace(/&single=true/, '');
    const resp = await fetch(url, {
      method: 'PATCH',
      headers: {
        'apikey': this.apiKey,
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(updates)
    });
    const data = await resp.json();
    if (!resp.ok) {
      return { data: null, error: { message: data.message || `HTTP ${resp.status}`, status: resp.status } };
    }
    return { data, error: null };
  }

  async delete() {
    const url = this._buildUrl().replace(/&single=true/, '');
    const resp = await fetch(url, {
      method: 'DELETE',
      headers: {
        'apikey': this.apiKey,
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      }
    });
    const data = await resp.json();
    if (!resp.ok) {
      return { data: null, error: { message: data.message || `HTTP ${resp.status}`, status: resp.status } };
    }
    return { data, error: null };
  }
}

window.SupabaseClient = SupabaseClient;
