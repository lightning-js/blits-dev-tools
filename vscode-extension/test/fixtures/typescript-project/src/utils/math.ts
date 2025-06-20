export interface Point {
  x: number;
  y: number;
}

export class MathUtils {
  static distance(p1: Point, p2: Point): number {
    const dx = p1.x - p2.x;
    const dy = p1.y - p2.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  static async calculateAsync(value: number): Promise<number> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(Math.round(value * Math.PI));
      }, 100);
    });
  }

  static createPoint(x: number, y: number): Point {
    return { x, y };
  }
}