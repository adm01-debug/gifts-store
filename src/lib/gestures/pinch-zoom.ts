export class PinchZoom {
  private initialDistance = 0;
  
  enable(element: HTMLElement, onZoom: (scale: number) => void) {
    element.addEventListener('touchstart', (e) => {
      if (e.touches.length === 2) {
        this.initialDistance = this.getDistance(e.touches[0], e.touches[1]);
      }
    });
    
    element.addEventListener('touchmove', (e) => {
      if (e.touches.length === 2) {
        const currentDistance = this.getDistance(e.touches[0], e.touches[1]);
        const scale = currentDistance / this.initialDistance;
        onZoom(scale);
      }
    });
  }
  
  private getDistance(touch1: Touch, touch2: Touch): number {
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }
}
