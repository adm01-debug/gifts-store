interface FeatureFlag {
  id: string;
  name: string;
  description?: string;
  enabled: boolean;
  rolloutPercentage?: number;
  userGroups?: string[];
  startDate?: Date;
  endDate?: Date;
}

export class FeatureFlagsService {
  private static instance: FeatureFlagsService;
  private flags: Map<string, FeatureFlag> = new Map();
  private readonly STORAGE_KEY = 'feature_flags';

  private constructor() {
    this.initializeDefaultFlags();
    this.loadFlags();
  }

  static getInstance(): FeatureFlagsService {
    if (!this.instance) {
      this.instance = new FeatureFlagsService();
    }
    return this.instance;
  }

  private initializeDefaultFlags(): void {
    const defaultFlags: FeatureFlag[] = [
      {
        id: 'ai_recommendations',
        name: 'AI Recommendations',
        description: 'Enable AI-powered product recommendations',
        enabled: import.meta.env.VITE_ENABLE_AI_RECOMMENDATIONS === 'true',
      },
      {
        id: 'offline_mode',
        name: 'Offline Mode',
        description: 'Enable offline functionality with service workers',
        enabled: import.meta.env.VITE_ENABLE_OFFLINE_MODE === 'true',
      },
      {
        id: 'a11y_features',
        name: 'Accessibility Features',
        description: 'Enable enhanced accessibility features',
        enabled: import.meta.env.VITE_ENABLE_A11Y_FEATURES === 'true',
      },
      {
        id: 'analytics',
        name: 'Analytics Tracking',
        description: 'Enable analytics and tracking',
        enabled: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
      },
      {
        id: 'debug_mode',
        name: 'Debug Mode',
        description: 'Enable debug mode with extra logging',
        enabled: import.meta.env.DEV,
      }
    ];

    defaultFlags.forEach(flag => {
      this.flags.set(flag.id, flag);
    });
  }

  private loadFlags(): void {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      try {
        const data: FeatureFlag[] = JSON.parse(stored);
        data.forEach(flag => {
          this.flags.set(flag.id, flag);
        });
      } catch (error) {
        console.error('Failed to load feature flags:', error);
      }
    }
  }

  private saveFlags(): void {
    const data = Array.from(this.flags.values());
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
  }

  isEnabled(flagId: string, userId?: string, userGroup?: string): boolean {
    const flag = this.flags.get(flagId);
    if (!flag) return false;

    // Check if flag is globally disabled
    if (!flag.enabled) return false;

    // Check date range
    if (flag.startDate && new Date() < flag.startDate) return false;
    if (flag.endDate && new Date() > flag.endDate) return false;

    // Check user groups
    if (flag.userGroups && flag.userGroups.length > 0) {
      if (!userGroup || !flag.userGroups.includes(userGroup)) {
        return false;
      }
    }

    // Check rollout percentage
    if (flag.rolloutPercentage !== undefined && userId) {
      const hash = this.hashUserId(userId, flagId);
      return hash < flag.rolloutPercentage;
    }

    return true;
  }

  private hashUserId(userId: string, flagId: string): number {
    const str = `${userId}_${flagId}`;
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash % 100);
  }

  setFlag(flag: FeatureFlag): void {
    this.flags.set(flag.id, flag);
    this.saveFlags();
  }

  enableFlag(flagId: string): void {
    const flag = this.flags.get(flagId);
    if (flag) {
      flag.enabled = true;
      this.saveFlags();
    }
  }

  disableFlag(flagId: string): void {
    const flag = this.flags.get(flagId);
    if (flag) {
      flag.enabled = false;
      this.saveFlags();
    }
  }

  getFlag(flagId: string): FeatureFlag | undefined {
    return this.flags.get(flagId);
  }

  getAllFlags(): FeatureFlag[] {
    return Array.from(this.flags.values());
  }

  resetToDefaults(): void {
    this.flags.clear();
    localStorage.removeItem(this.STORAGE_KEY);
    this.initializeDefaultFlags();
  }
}

export const featureFlags = FeatureFlagsService.getInstance();

// Helper hooks for React
export const useFeatureFlag = (flagId: string, userId?: string, userGroup?: string): boolean => {
  return featureFlags.isEnabled(flagId, userId, userGroup);
};
