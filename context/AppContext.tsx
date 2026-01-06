
name: Build and Deploy

on:
  push:
    branches:
      - main # 當代碼推送到 main 分支時觸發

permissions:
  contents: write

jobs:
  build:
    name: Build Project
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          # 移除 cache: 'npm' 以免因為缺少 package-lock.json 而出錯

      - name: Install Dependencies
        run: npm install

      - name: Compile and Build
        env:
          API_KEY: ${{ secrets.API_KEY }}
          FIREBASE_CONFIG: ${{ secrets.FIREBASE_CONFIG }}
        run: npm run build

      - name: Upload Build Artifacts
        uses: actions/upload-artifact@v4
        with:
          name: dist-files
          path: dist

  deploy:
    name: Deploy to GitHub Pages
    needs: build
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4

      - name: Download Build Artifacts
        uses: actions/download-artifact@v4
        with:
          name: dist-files
          path: dist

      - name: Push to gh-pages Branch
        uses: JamesIves/github-pages-deploy-action@v4
        with:
          folder: dist
          branch: gh-pages
