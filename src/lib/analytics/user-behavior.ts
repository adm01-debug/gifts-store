import { analytics } from './event-tracker';

interface UserSession {
  id: string;
  startTime: number;
  lastActivity: number;
  pageViews: number;
  events: string[];
}

export class UserBehaviorTracker {
  private static instance: UserBehaviorTracker;
  private session: UserSession | null = null;
  private idleTimeout: number = 30 * 60 * 1000; // 30 minutes
  private idleTimer: NodeJS.Timeout | null = null;

  private constructor() {
    this.initializeSession();
    this.trackUserActivity();
  }

  static getInstance(): UserBehaviorTracker {
    if (!this.instance) {
      this.instance = new UserBehaviorTracker();
    }
    return this.instance;
  }

  private initializeSession(): void {
    this.session = {
      id: this.generateSessionId(),
      startTime: Date.now(),
      lastActivity: Date.now(),
      pageViews: 0,
      events: []
    };
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private trackUserActivity(): void {
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    
    events.forEach(event => {
      document.addEventListener(event, () => {
        this.updateActivity();
      });
    });

    // Track page visibility
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.pauseSession();
      } else {
        this.resumeSession();
      }
    });
  }

  private updateActivity(): void {
    if (this.session) {
      this.session.lastActivity = Date.now();
      this.resetIdleTimer();
    }
  }

  private resetIdleTimer(): void {
    if (this.idleTimer) {
      clearTimeout(this.idleTimer);
    }

    this.idleTimer = setTimeout(() => {
      this.markSessionIdle();
    }, this.idleTimeout);
  }

  private markSessionIdle(): void {
    if (this.session) {
      analytics.trackCustomEvent('session_idle', {
        sessionId: this.session.id,
        duration: Date.now() - this.session.startTime
      });
    }
  }

  private pauseSession(): void {
    if (this.session) {
      analytics.trackCustomEvent('session_paused', {
        sessionId: this.session.id
      });
    }
  }

  private resumeSession(): void {
    if (this.session) {
      analytics.trackCustomEvent('session_resumed', {
        sessionId: this.session.id
      });
      this.updateActivity();
    }
  }

  trackPageView(path: string): void {
    if (this.session) {
      this.session.pageViews++;
      analytics.trackPageView(path);
    }
  }

  trackEvent(eventName: string): void {
    if (this.session) {
      this.session.events.push(eventName);
    }
  }

  getSessionDuration(): number {
    if (!this.session) return 0;
    return Date.now() - this.session.startTime;
  }

  getSessionData(): UserSession | null {
    return this.session;
  }

  endSession(): void {
    if (this.session) {
      analytics.trackCustomEvent('session_ended', {
        sessionId: this.session.id,
        duration: this.getSessionDuration(),
        pageViews: this.session.pageViews,
        eventsCount: this.session.events.length
      });
      
      this.session = null;
    }
  }
}

export const userBehavior = UserBehaviorTracker.getInstance();
