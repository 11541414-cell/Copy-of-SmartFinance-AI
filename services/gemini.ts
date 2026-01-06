import { GoogleGenAI } from "@google/genai";
import { BankAccount, Transaction, Category } from "../types";

export const getFinancialAdvice = async (
  accounts: BankAccount[],
  transactions: Transaction[],
  categories: Category[]
): Promise<string> => {
  const apiKey = process.env.API_KEY;

  if (!apiKey || apiKey === "undefined" || apiKey.trim() === "") {
    return "### AI 建議無法生成\n目前尚未在 GitHub Secrets 中設定 `API_KEY`。請完成設定以啟用 gemini-3-pro-preview 的理財分析功能。";
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
  const recentTransactions = transactions.slice(-15).map(t => {
    const cat = categories.find(c => c.id === t.categoryId)?.name || '未知';
    return `${t.date}: ${cat} ${t.type === 'INCOME' ? '收入' : '支出'} NT$ ${t.amount} (${t.note || '無備註'})`;
  }).join('\n');

  const prompt = `
    你是一位專業的個人理財顧問。請根據以下用戶數據進行深度分析：
    
    1. 總資產：NT$ ${totalBalance.toLocaleString()}
    2. 帳戶分佈：${accounts.map(a => `${a.name}: NT$ ${a.balance.toLocaleString()}`).join(', ')}
    3. 最近交易：
    ${recentTransactions}
    
    請以 Markdown 格式給予 3-4 點繁體中文建議，包含消費趨勢分析與資產優化建議。
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
    });
    
    return response.text || "AI 暫時無法回應。";
  } catch (error: any) {
    console.error("Gemini Error:", error);
    return "AI 服務調用失敗，請檢查 API Key 權限。";
  }
};