import { PortfolioHolding } from './storage';

export interface EnrichedHolding extends PortfolioHolding {
  avgCostBasis: number;
  currentPrice: number;
  currentValue: number;
  profitLoss: number;
  profitLossPct: number;
  change24h: number;
}
// takes raw holdings and adds current price and profit or loss for each coin
export function calculateHoldings(portfolio: PortfolioHolding[], prices: Record<string, any>): EnrichedHolding[] {
  return portfolio.map(h => {
    const p = prices[h.coinId] || {};
    const currentPrice = p.usd || 0;
    const currentValue = currentPrice * h.totalAmount;
    const avgCostBasis = h.totalAmount > 0 ? h.totalCost / h.totalAmount : 0;
    const profitLoss = currentValue - h.totalCost;
    const profitLossPct = h.totalCost > 0 ? (profitLoss / h.totalCost) * 100 : 0;
    const change24h = p.usd_24h_change || 0;
    return { ...h, avgCostBasis, currentPrice, currentValue, profitLoss, profitLossPct, change24h };
  });
}
// adds up the total value and total profit or loss across all holdings
export function getPortfolioTotals(holdings: EnrichedHolding[]) {
  const totalValue = holdings.reduce((s, h) => s + h.currentValue, 0);
  const totalCost = holdings.reduce((s, h) => s + h.totalCost, 0);
  const totalPL = totalValue - totalCost;
  const totalPLPct = totalCost > 0 ? (totalPL / totalCost) * 100 : 0;
  return { totalValue, totalCost, totalPL, totalPLPct };
}
// works out the average price change across all holdings over the last 24 hours
export function getPortfolioAvgChange(holdings: EnrichedHolding[]): number {
  if (!holdings.length) return 0;
  return holdings.reduce((s, h) => s + h.change24h, 0) / holdings.length;
}
