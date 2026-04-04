export interface PlanLimits {
  maxAgentMessagesPerMonth: number;
  maxBulkScheduleViaAgent: number;
  maxAIGenerationsPerMonth: number;
}

export const PLAN_LIMITS: Record<string, PlanLimits> = {
  free: {
    maxAgentMessagesPerMonth: 5,
    maxBulkScheduleViaAgent: 0,
    maxAIGenerationsPerMonth: 2,
  },
  starter: {
    maxAgentMessagesPerMonth: 50,
    maxBulkScheduleViaAgent: 5,
    maxAIGenerationsPerMonth: 500,
  },
  growth: {
    maxAgentMessagesPerMonth: 200,
    maxBulkScheduleViaAgent: 20,
    maxAIGenerationsPerMonth: 1000,
  },
  pro: {
    maxAgentMessagesPerMonth: 10000,
    maxBulkScheduleViaAgent: 100,
    maxAIGenerationsPerMonth: 5000,
  },
};

export function getPlanLimits(plan: string): PlanLimits {
  const normalizedPlan = plan.toLowerCase();
  return PLAN_LIMITS[normalizedPlan] || PLAN_LIMITS.free;
}
