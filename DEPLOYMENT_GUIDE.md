
# SmartFinance AI 佈署指南

本指南將協助您將此專案佈署到 GitHub Pages。

### 第一步：準備 Firebase
1. 前往 [Firebase Console](https://console.firebase.google.com/)。
2. 建立新專案。
3. 在專案中啟用 **Authentication**，並選擇「電子郵件/密碼」作為登入方式。
4. 建立 **Firestore Database**。
5. 前往「專案設定」，在下方「您的應用程式」中建立一個 Web 應用程式 (</>)。
6. 複製得到的 `firebaseConfig` 物件，格式如下：
   ```json
   {
     "apiKey": "...",
     "authDomain": "...",
     "projectId": "...",
     "storageBucket": "...",
     "messagingSenderId": "...",
     "appId": "..."
   }
   ```

### 第二步：準備 Gemini API KEY
1. 前往 [Google AI Studio](https://aistudio.google.com/)。
2. 點擊「Get API key」並建立一個新 Key。

### 第三步：設定 GitHub 儲存庫 Secrets
1. 在您的 GitHub Repository 中，前往 **Settings > Secrets and variables > Actions**。
2. 新增以下兩個 **Repository Secrets**：
   - `API_KEY`: 貼入您的 Gemini API Key。
   - `FIREBASE_CONFIG`: 貼入完整的 Firebase 設定物件 (JSON 格式)。

### 第四步：自動佈署流程 (GitHub Actions)
請將以下內容存為專案根目錄下的 `.github/workflows/deploy.yml` 檔案並提交到 main 分支。GitHub Actions 將會自動執行編譯並佈署到 `gh-pages` 分支。

---

## 佈署設定檔 (deploy.yml)

```yaml
name: Build and Deploy to GitHub Pages

on:
  push:
    branches:
      - main

permissions:
  contents: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Set up Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install dependencies
        run: npm install

      - name: Build
        env:
          API_KEY: ${{ secrets.API_KEY }}
          FIREBASE_CONFIG: ${{ secrets.FIREBASE_CONFIG }}
        run: npm run build

      - name: Upload production-ready build artifacts
        uses: actions/upload-artifact@v4
        with:
          name: dist
          path: dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Download build artifacts
        uses: actions/download-artifact@v4
        with:
          name: dist
          path: dist

      - name: Deploy to GitHub Pages
        uses: JamesIves/github-pages-deploy-action@v4
        with:
          folder: dist
          branch: gh-pages
```

### 注意事項
- 確保您的 `vite.config.ts` 中的 `base` 為 `'./'`。
- 佈署完成後，請在 GitHub Repository 的 **Settings > Pages** 中，確認 Source 選為 `gh-pages` 分支。
