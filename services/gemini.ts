
import { GoogleGenAI } from "@google/genai";
import { BankAccount, Transaction, Category } from "../types";

export const getFinancialAdvice = async (
  accounts: BankAccount[],
  transactions: Transaction[],
  categories: Category[]
): Promise<string> => {
  const API_KEY = process.env.API_KEY;

  if (!API_KEY || API_KEY === "undefined" || API_KEY.trim() === "") {
    return "### AI 建議無法生成\n目前尚未設定 API KEY。請前往專案設定中配置 `API_KEY` 以啟用完整的 AI 財務分析功能。";
  }

  // Create a new instance right before use to ensure the most up-to-date key
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
  const recentTransactions = transactions.slice(-15).map(t => {
    const cat = categories.find(c => c.id === t.categoryId)?.name || '未知';
    return `${t.date}: ${cat} ${t.type === 'INCOME' ? '收入' : '支出'} NT$ ${t.amount} (${t.note || '無備註'})`;
  }).join('\n');

  const prompt = `
    你是一位專業的個人理財顧問，擅長分析消費趨勢並給予具體建議。
    請根據以下用戶的財務數據進行分析，並給予 3-4 點繁體中文建議。
    
    【當前資產概況】
    總資產：NT$ ${totalBalance.toLocaleString()}
    分佈：${accounts.map(a => `${a.name}(${a.type}): NT$ ${a.balance.toLocaleString()}`).join(', ')}
    
    【最近交易活動】
    ${recentTransactions}
    
    請以 Markdown 格式回答，內容應包含：
    1. 消費習慣趨勢（針對近期支出的分析）。
    2. 資產配置或帳戶管理的優化建議。
    3. 針對具體分類的開支節流建議。
    
    請確保口吻專業、正向且具鼓勵性。使用 gemini-3-pro-preview 模型的高階推理能力來分析潛在的財務風險。
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
    });
    
    return response.text || "AI 暫時無法生成建議，請稍後再試。";
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    if (error?.message?.includes("API key not found")) {
      return "錯誤：找不到有效的 API Key。請確認您的 GitHub Secrets 設定正確。";
    }
    return "AI 諮詢服務發生非預期錯誤。這可能是由於模型配額限制或網路問題引起。";
  }
};
