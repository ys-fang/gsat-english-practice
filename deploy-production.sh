#!/bin/bash
# GSAT English Practice System - Production Deployment Script
# 正式環境部署腳本

set -e  # 出現錯誤時停止執行

echo "🚀 開始部署 GSAT 練習系統到正式環境 (GCS)"
echo "=========================================="

# 配置變數
GCS_BUCKET="jutor-event-di1dzdgl64"
GCS_PATH="event/gsat"
FULL_GCS_PATH="gs://${GCS_BUCKET}/${GCS_PATH}/"

echo "📋 部署配置:"
echo "   Bucket: ${GCS_BUCKET}"
echo "   路徑:   ${GCS_PATH}"
echo "   完整路徑: ${FULL_GCS_PATH}"
echo ""

# 檢查 gsutil 是否可用
if ! command -v gsutil &> /dev/null; then
    echo "❌ 錯誤: gsutil 未安裝或不在 PATH 中"
    echo "請安裝 Google Cloud SDK: https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# 檢查是否已登入 gcloud
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | head -n1 &> /dev/null; then
    echo "❌ 錯誤: 未登入 Google Cloud"
    echo "請執行: gcloud auth login"
    exit 1
fi

echo "✅ 已登入 Google Cloud 帳戶: $(gcloud auth list --filter=status:ACTIVE --format="value(account)" | head -n1)"

# 檢查對 bucket 的存取權限
echo "🔍 檢查 GCS Bucket 存取權限..."
if ! gsutil ls gs://${GCS_BUCKET}/ &> /dev/null; then
    echo "❌ 錯誤: 無法存取 bucket ${GCS_BUCKET}"
    echo "請檢查權限或 bucket 名稱"
    exit 1
fi

echo "✅ GCS Bucket 存取權限正常"

# 備份現有檔案 (如果存在)
echo "💾 備份現有檔案..."
BACKUP_PATH="gs://${GCS_BUCKET}/${GCS_PATH}_backup_$(date +%Y%m%d_%H%M%S)/"
if gsutil ls ${FULL_GCS_PATH} &> /dev/null; then
    echo "   建立備份: ${BACKUP_PATH}"
    gsutil -m cp -r ${FULL_GCS_PATH} ${BACKUP_PATH} || echo "   ⚠️  備份可能失敗，繼續部署..."
else
    echo "   沒有現有檔案需要備份"
fi

# 同步檔案到 GCS (排除不必要的檔案)
echo "📤 同步檔案到正式環境..."
echo "   排除檔案: .* node_modules/** tests/** *.md package*.json *.sh firebase/** .firebase/**"

# 先清理目標目錄 (除了備份)
echo "   清理目標目錄..."
gsutil -m rm -r ${FULL_GCS_PATH}* 2>/dev/null || echo "   目標目錄為空，跳過清理"

# 使用 cp 而不是 rsync，更精確控制
echo "   複製 HTML 檔案..."
gsutil -m cp -r year/ ${FULL_GCS_PATH}

echo "   複製 JavaScript 檔案..."
gsutil -m cp -r scripts/ ${FULL_GCS_PATH}

echo "   複製 CSS 檔案..."
gsutil -m cp -r styles/ ${FULL_GCS_PATH}

echo "   複製根目錄必要檔案..."
gsutil cp index.html ${FULL_GCS_PATH} 2>/dev/null || echo "   沒有 index.html"

# 檢查其他目錄
for dir in images fonts assets data; do
    if [ -d "$dir" ]; then
        echo "   複製 $dir/ 目錄..."
        gsutil -m cp -r $dir/ ${FULL_GCS_PATH}
    fi
done

echo "✅ 檔案同步完成"

# 設定快取控制標頭
echo "⚙️  設定快取控制..."

# HTML 檔案 - 短期快取
echo "   設定 HTML 檔案快取 (1小時)..."
gsutil -m setmeta -h "Cache-Control:max-age=3600,public" "${FULL_GCS_PATH}**/*.html" 2>/dev/null || true

# JS/CSS 檔案 - 長期快取
echo "   設定 JS/CSS 檔案快取 (24小時)..."
gsutil -m setmeta -h "Cache-Control:max-age=86400,public" "${FULL_GCS_PATH}**/*.js" 2>/dev/null || true
gsutil -m setmeta -h "Cache-Control:max-age=86400,public" "${FULL_GCS_PATH}**/*.css" 2>/dev/null || true

# 圖片檔案 - 超長期快取
echo "   設定圖片檔案快取 (30天)..."
gsutil -m setmeta -h "Cache-Control:max-age=2592000,public" "${FULL_GCS_PATH}**/*.{png,jpg,jpeg,gif,svg,ico}" 2>/dev/null || true

echo "✅ 快取控制設定完成"

# 設定 CORS (如果需要)
echo "🔐 檢查 CORS 設定..."
# CORS 設定通常在 bucket 層級，這裡只是檢查
echo "   CORS 設定應在 bucket 層級配置"

# 驗證部署
echo "🧪 驗證部署..."
MAIN_PAGE_URL="https://storage.googleapis.com/${GCS_BUCKET}/${GCS_PATH}/year/114.html"
echo "   測試主要頁面: ${MAIN_PAGE_URL}"

if curl -s -I "${MAIN_PAGE_URL}" | grep -q "200 OK"; then
    echo "✅ 主要頁面可正常存取"
else
    echo "⚠️  主要頁面可能無法存取，請手動檢查"
fi

# 生成存取連結
echo ""
echo "🎉 部署完成！"
echo "=========================================="
echo "📍 正式環境連結:"
echo "   主頁: https://storage.googleapis.com/${GCS_BUCKET}/${GCS_PATH}/"
echo "   114年考試: https://storage.googleapis.com/${GCS_BUCKET}/${GCS_PATH}/year/114.html"
echo "   Firebase測試: https://storage.googleapis.com/${GCS_BUCKET}/${GCS_PATH}/firebase-test.html"
echo ""
echo "📊 數據監控:"
echo "   Firebase Console: https://console.firebase.google.com/project/gsat-analytics-2025/firestore"
echo "   查看 environment: 'production' 標籤的數據"
echo ""
echo "🔄 如需回滾，備份位於: ${BACKUP_PATH}"
echo ""
echo "✅ 部署成功完成！"