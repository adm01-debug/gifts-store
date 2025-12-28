export class SwipeDetector {
  private startX = 0;
  private startY = 0;
  
  detectSwipe(
    element: HTMLElement,
    onSwipe: (direction: 'left' | 'right' | 'up' | 'down') => void
  ) {
    element.addEventListener('touchstart', (e) => {
      this.startX = e.touches[0].clientX;
      this.startY = e.touches[0].clientY;
    });
    
    element.addEventListener('touchend', (e) => {
      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;
      
      const diffX = endX - this.startX;
      const diffY = endY - this.startY;
      
      if (Math.abs(diffX) > Math.abs(diffY)) {
        onSwipe(diffX > 0 ? 'right' : 'left');
      } else {
        onSwipe(diffY > 0 ? 'down' : 'up');
      }
    });
  }
}
