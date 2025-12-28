export interface SpringConfig {
  tension?: number;
  friction?: number;
  mass?: number;
}

export class SpringAnimation {
  private static readonly DEFAULT_CONFIG: SpringConfig = {
    tension: 170,
    friction: 26,
    mass: 1
  };

  static animate(
    from: number,
    to: number,
    config: SpringConfig = {},
    onUpdate: (value: number) => void
  ): () => void {
    const { tension, friction, mass } = { ...this.DEFAULT_CONFIG, ...config };
    
    let position = from;
    let velocity = 0;
    let animationFrame: number;
    
    const tick = () => {
      const springForce = -tension! * (position - to);
      const dampingForce = -friction! * velocity;
      const acceleration = (springForce + dampingForce) / mass!;
      
      velocity += acceleration * 0.016;
      position += velocity * 0.016;
      
      onUpdate(position);
      
      if (Math.abs(velocity) > 0.01 || Math.abs(position - to) > 0.01) {
        animationFrame = requestAnimationFrame(tick);
      } else {
        onUpdate(to);
      }
    };
    
    animationFrame = requestAnimationFrame(tick);
    
    return () => cancelAnimationFrame(animationFrame);
  }
}
