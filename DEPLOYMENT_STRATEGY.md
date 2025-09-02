# GSAT 雙環境部署策略
# Dual Environment Deployment Strategy

## 環境架構

### 🧪 測試環境 (Staging)
- **託管**: Firebase Hosting
- **網址**: https://gsat-analytics-2025.web.app
- **用途**: 開發測試、功能驗證
- **部署**: 自動化 (`firebase deploy`)
- **環境標籤**: `staging`

### 🚀 正式環境 (Production)  
- **託管**: GCS Bucket (jutor-event-di1dzdgl64) + Jutor 域名
- **GCS 路徑**: gs://jutor-event-di1dzdgl64/event/gsat/
- **正式網址**: https://www.jutor.ai/event/gsat/
- **直接連結**: https://storage.googleapis.com/jutor-event-di1dzdgl64/event/gsat/
- **用途**: 正式服務、品牌推廣
- **部署**: 自動化腳本 (`./deploy-production.sh`)
- **環境標籤**: `production`

### 🛠️ 本地開發環境 (Development)
- **託管**: 本地伺服器
- **網址**: http://localhost:* 或 http://127.0.0.1:*
- **用途**: 開發調試
- **環境標籤**: `development`

## 數據隔離策略

### 環境檢測邏輯
```javascript
// gsat-analytics.js 中的環境檢測
function getEnvironment() {
    const hostname = window.location.hostname;
    const pathname = window.location.pathname;
    
    // 檢測正式環境
    if ((hostname.includes('storage.googleapis.com') && pathname.includes('/event/gsat/')) ||
        (hostname.includes('www.jutor.ai') && pathname.includes('/event/gsat/'))) {
        return 'production';
    }
    
    // 檢測 Firebase 測試環境  
    if (hostname.includes('firebase') || hostname.includes('web.app')) {
        return 'staging';
    }
    
    // 本地開發環境
    if (hostname.includes('localhost') || hostname === '127.0.0.1') {
        return 'development';
    }
    
    // 預設為測試環境
    return 'staging';
}

// 數據結構包含環境標籤
const firestoreData = {
    userId: userId,
    environment: CURRENT_ENVIRONMENT,  // 'production', 'staging', 'development'
    year: examResult.year || 0,
    score: finalScore,
    deployment: {
        hostname: window.location.hostname,
        pathname: window.location.pathname,
        origin: window.location.origin,
        userAgent: navigator.userAgent.substring(0, 200)
    }
    // ... 其他欄位
};
```

## 部署流程

### 1. 本地開發
```bash
# 本地測試
python -m http.server 8080
# 或
live-server
```

### 2. 測試環境部署
```bash
# 部署到 Firebase
firebase deploy --only hosting

# 驗證功能
curl -I https://gsat-analytics-2025.web.app/year/114.html
```

### 3. 正式環境部署
```bash
# 使用自動化部署腳本
./deploy-production.sh

# 手動部署 (如需要)
gsutil -m cp -r year/ gs://jutor-event-di1dzdgl64/event/gsat/
gsutil -m cp -r scripts/ gs://jutor-event-di1dzdgl64/event/gsat/
gsutil -m cp -r styles/ gs://jutor-event-di1dzdgl64/event/gsat/

# 設定快取控制
gsutil -m setmeta -h "Cache-Control:max-age=3600,public" gs://jutor-event-di1dzdgl64/event/gsat/**/*.html
gsutil -m setmeta -h "Cache-Control:max-age=86400,public" gs://jutor-event-di1dzdgl64/event/gsat/**/*.{js,css}
gsutil -m setmeta -h "Cache-Control:max-age=2592000,public" gs://jutor-event-di1dzdgl64/event/gsat/**/*.{png,jpg,jpeg,gif,svg,ico}
```

## 網域配置

### 正式環境網址
- **主要網址**: https://www.jutor.ai/event/gsat/ (推薦)
- **直接連結**: https://storage.googleapis.com/jutor-event-di1dzdgl64/event/gsat/
- **考試頁面**: https://www.jutor.ai/event/gsat/year/114.html

### 環境自動識別
系統會根據訪問的網域自動識別環境：
- `www.jutor.ai/event/gsat/*` → `production`
- `storage.googleapis.com/.../event/gsat/*` → `production`
- `*.firebase*.com` 或 `*.web.app` → `staging`
- `localhost` 或 `127.0.0.1` → `development`

## 監控和測試

### 功能驗證清單
- [ ] 頁面載入正常
- [ ] Firebase 連線功能
- [ ] 答題數據收集
- [ ] 環境標籤正確
- [ ] 跨設備相容性

### 數據驗證
```javascript
// 在 Firebase Console 中檢查數據
// 應該可以看到 environment: 'staging' 和 'production' 的區分
```

## 優化建議

### 1. 自動化部署腳本
創建 `deploy.sh` 腳本來簡化流程

### 2. 環境變數配置
使用不同的 Firebase 設定檔案

### 3. CDN 優化
配置適當的快取策略

### 4. 監控告警
設定正式環境的錯誤監控

## 安全考量

- 確保 Firebase 規則適用於兩個環境
- GCS bucket 權限最小化原則
- HTTPS 強制重導向
- CORS 政策配置

---

*這個策略確保了開發效率和正式環境的穩定性，同時利用 Jutor 品牌優勢。*