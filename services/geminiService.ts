
import { GoogleGenAI } from "@google/genai";
import { Transaction, TransactionType, Subscription, Currency } from "../types";

// Initialize the client with the API key from the environment
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getFinancialAdvice = async (
  transactions: Transaction[], 
  subscriptions: Subscription[],
  currency: Currency
): Promise<string> => {
  try {
    // Prepare the data for the model
    const recentTransactions = transactions
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 50);

    const summary = recentTransactions.reduce((acc, curr) => {
      if (curr.type === TransactionType.INCOME) {
        acc.income += curr.amount;
      } else {
        acc.expenses += curr.amount;
      }
      return acc;
    }, { income: 0, expenses: 0 });

    const subscriptionSummary = subscriptions.map(s => ({
        name: s.name,
        cost: s.amount,
        cycle: s.billingCycle
    }));

    const dataPrompt = JSON.stringify({
      currency: currency.code,
      summary,
      activeSubscriptions: subscriptionSummary,
      transactions: recentTransactions.map(t => ({
        date: t.date,
        type: t.type,
        category: t.category,
        amount: t.amount,
        desc: t.description
      }))
    });

    const prompt = `
      Act as a personal financial advisor. Analyze the following financial data (summary, subscriptions, and last 50 transactions).
      The user's currency is ${currency.name} (${currency.code}).
      
      Data:
      ${dataPrompt}

      Provide 3 specific, actionable, and concise recommendations to improve the user's financial health. 
      Look for unused subscriptions, high spending categories, or budget adjustments.
      Format the output as a simple HTML unordered list (<ul><li>...</li></ul>) without any other markdown code blocks or wrapping text.
      Keep the tone encouraging but professional. Use the currency symbol ${currency.symbol} in your response where appropriate.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Unable to generate advice at this time.";
  } catch (error) {
    console.error("Error calling Gemini:", error);
    return "Sorry, I couldn't analyze your finances right now. Please check your connection and try again.";
  }
};
