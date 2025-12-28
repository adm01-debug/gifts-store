import { analytics, EventCategory } from '../analytics/event-tracker';

export interface Experiment {
  id: string;
  name: string;
  description?: string;
  variants: string[];
  weights?: number[];
  startDate?: Date;
  endDate?: Date;
  active: boolean;
}

interface ExperimentAssignment {
  experimentId: string;
  variant: string;
  timestamp: number;
}

export class ABTestingService {
  private static instance: ABTestingService;
  private assignments: Map<string, ExperimentAssignment> = new Map();
  private readonly STORAGE_KEY = 'ab_test_assignments';

  private constructor() {
    this.loadAssignments();
  }

  static getInstance(): ABTestingService {
    if (!this.instance) {
      this.instance = new ABTestingService();
    }
    return this.instance;
  }

  private loadAssignments(): void {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      try {
        const data = JSON.parse(stored);
        this.assignments = new Map(Object.entries(data));
      } catch (error) {
        console.error('Failed to load A/B test assignments:', error);
      }
    }
  }

  private saveAssignments(): void {
    const data = Object.fromEntries(this.assignments);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
  }

  assignVariant(experiment: Experiment, userId?: string): string {
    if (!experiment.active) {
      return experiment.variants[0]; // Return control variant if experiment is inactive
    }

    // Check if experiment has ended
    if (experiment.endDate && new Date() > experiment.endDate) {
      return experiment.variants[0];
    }

    // Check if experiment hasn't started
    if (experiment.startDate && new Date() < experiment.startDate) {
      return experiment.variants[0];
    }

    const key = userId ? `${experiment.id}_${userId}` : experiment.id;
    
    // Check existing assignment
    const existing = this.assignments.get(key);
    if (existing && existing.experimentId === experiment.id) {
      return existing.variant;
    }

    // Assign new variant
    const variant = this.selectVariant(experiment);
    
    const assignment: ExperimentAssignment = {
      experimentId: experiment.id,
      variant,
      timestamp: Date.now()
    };
    
    this.assignments.set(key, assignment);
    this.saveAssignments();
    
    // Track assignment
    analytics.track({
      category: EventCategory.USER,
      action: 'experiment_assigned',
      label: experiment.id,
      metadata: {
        experimentId: experiment.id,
        experimentName: experiment.name,
        variant,
        userId
      }
    });

    return variant;
  }

  private selectVariant(experiment: Experiment): string {
    const weights = experiment.weights || 
      new Array(experiment.variants.length).fill(1 / experiment.variants.length);
    
    // Normalize weights
    const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
    const normalizedWeights = weights.map(weight => weight / totalWeight);
    
    const random = Math.random();
    let cumulative = 0;
    
    for (let i = 0; i < normalizedWeights.length; i++) {
      cumulative += normalizedWeights[i];
      if (random < cumulative) {
        return experiment.variants[i];
      }
    }
    
    return experiment.variants[0];
  }

  getVariant(experimentId: string, userId?: string): string | null {
    const key = userId ? `${experimentId}_${userId}` : experimentId;
    return this.assignments.get(key)?.variant || null;
  }

  trackConversion(experimentId: string, userId?: string, value?: number): void {
    const variant = this.getVariant(experimentId, userId);
    
    if (variant) {
      analytics.track({
        category: EventCategory.CONVERSION,
        action: 'experiment_conversion',
        label: experimentId,
        value,
        metadata: {
          experimentId,
          variant,
          userId
        }
      });
    }
  }

  clearAssignments(): void {
    this.assignments.clear();
    localStorage.removeItem(this.STORAGE_KEY);
  }

  clearExperiment(experimentId: string): void {
    const keysToDelete: string[] = [];
    
    this.assignments.forEach((assignment, key) => {
      if (assignment.experimentId === experimentId) {
        keysToDelete.push(key);
      }
    });
    
    keysToDelete.forEach(key => this.assignments.delete(key));
    this.saveAssignments();
  }
}

export const abTesting = ABTestingService.getInstance();
