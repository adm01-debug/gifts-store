export class SessionManager {
  private static SESSION_KEY = 'user_session';
  
  static setSession(data: any) {
    sessionStorage.setItem(this.SESSION_KEY, JSON.stringify(data));
  }
  
  static getSession() {
    const data = sessionStorage.getItem(this.SESSION_KEY);
    return data ? JSON.parse(data) : null;
  }
  
  static clearSession() {
    sessionStorage.removeItem(this.SESSION_KEY);
  }
}
