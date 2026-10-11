interface UsageMetric {
  date: string; // YYYY-MM-DD
  requestsCount: number;
  tokensEstimated: number;
  errorsCount: number;
  averageLatencyMs: number;
}

export class BudgetTracker {
  private dailyLimit: number;
  private monthlyLimit: number;
  private dailyCounts: Map<string, number> = new Map();
  private monthlyCounts: Map<string, number> = new Map();
  private usageHistory: UsageMetric[] = [];

  constructor(
    dailyLimit = Number(process.env.DAILY_REQUEST_BUDGET || 100),
    monthlyLimit = Number(process.env.MONTHLY_REQUEST_BUDGET || 2500)
  ) {
    this.dailyLimit = dailyLimit;
    this.monthlyLimit = monthlyLimit;
  }

  public canProceed(): { allowed: boolean; reason?: string } {
    const today = new Date().toISOString().slice(0, 10);
    const month = today.slice(0, 7);

    const todayCount = this.dailyCounts.get(today) || 0;
    const monthCount = this.monthlyCounts.get(month) || 0;

    if (todayCount >= this.dailyLimit) {
      return {
        allowed: false,
        reason: `Daily AI request budget reached (${todayCount}/${this.dailyLimit}). Operating in offline heuristic mode.`
      };
    }

    if (monthCount >= this.monthlyLimit) {
      return {
        allowed: false,
        reason: `Monthly AI request budget reached (${monthCount}/${this.monthlyLimit}). Operating in offline heuristic mode.`
      };
    }

    return { allowed: true };
  }

  public recordRequest(tokens: number, latencyMs: number, isError = false) {
    const today = new Date().toISOString().slice(0, 10);
    const month = today.slice(0, 7);

    this.dailyCounts.set(today, (this.dailyCounts.get(today) || 0) + 1);
    this.monthlyCounts.set(month, (this.monthlyCounts.get(month) || 0) + 1);

    const existingIndex = this.usageHistory.findIndex(u => u.date === today);
    if (existingIndex >= 0) {
      const u = this.usageHistory[existingIndex];
      u.requestsCount += 1;
      u.tokensEstimated += tokens;
      if (isError) u.errorsCount += 1;
      u.averageLatencyMs = Math.round((u.averageLatencyMs + latencyMs) / 2);
    } else {
      this.usageHistory.push({
        date: today,
        requestsCount: 1,
        tokensEstimated: tokens,
        errorsCount: isError ? 1 : 0,
        averageLatencyMs: latencyMs
      });
    }
  }

  public getStats() {
    const today = new Date().toISOString().slice(0, 10);
    const month = today.slice(0, 7);
    return {
      todayRequests: this.dailyCounts.get(today) || 0,
      dailyLimit: this.dailyLimit,
      monthRequests: this.monthlyCounts.get(month) || 0,
      monthlyLimit: this.monthlyLimit,
      usageHistory: this.usageHistory.slice(-7)
    };
  }
}

export const budgetTracker = new BudgetTracker();
