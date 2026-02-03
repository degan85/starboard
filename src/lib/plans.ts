export type Plan = "FREE" | "PRO" | "BUSINESS";

export const PLAN_LIMITS = {
  FREE: {
    maxProjects: 1,
    maxTestimonials: 10,
    customColors: false,
    removeBranding: false,
    videoTestimonials: false,
    customDomain: false,
  },
  PRO: {
    maxProjects: 3,
    maxTestimonials: Infinity,
    customColors: true,
    removeBranding: true,
    videoTestimonials: false,
    customDomain: false,
  },
  BUSINESS: {
    maxProjects: Infinity,
    maxTestimonials: Infinity,
    customColors: true,
    removeBranding: true,
    videoTestimonials: true,
    customDomain: true,
  },
};

export function getPlanLimits(plan: Plan) {
  return PLAN_LIMITS[plan] || PLAN_LIMITS.FREE;
}

export function canCreateProject(plan: Plan, currentCount: number): boolean {
  const limits = getPlanLimits(plan);
  return currentCount < limits.maxProjects;
}

export function canAddTestimonial(plan: Plan, currentCount: number): boolean {
  const limits = getPlanLimits(plan);
  return currentCount < limits.maxTestimonials;
}

export function canUseFeature(plan: Plan, feature: keyof typeof PLAN_LIMITS.FREE): boolean {
  const limits = getPlanLimits(plan);
  return !!limits[feature];
}
