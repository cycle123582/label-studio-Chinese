/**
 * Interface for objects that can respond to user interactions
 */
export interface Interactive {
  /**
   * Check if the given coordinates are within the interactive area
   */
  hitTest(x: number, y: number): boolean;

  /**
   * Handle mouse enter events
   */
  onMouseEnter?(event: MouseEvent): void;

  /**
   * Handle mouse leave events
   */
  onMouseLeave?(event: MouseEvent): void;

  /**
   * Handle mouse move events
   */
  onMouseMove?(event: MouseEvent): void;

  /**
   * Handle mouse down events
   */
  onMouseDown?(event: MouseEvent): void;

  /**
   * Handle mouse up events
   */
  onMouseUp?(event: MouseEvent): void;

  /**
   * Handle click events
   */
  onClick?(event: MouseEvent): void;

  /**
   * Handle double click events
   */
  onDoubleClick?(event: MouseEvent): void;

  /**
   * Get the cursor type for this interactive element
   */
  getCursor?(): string;

  /**
   * Check if this interactive element is currently enabled
   */
  isEnabled?(): boolean;

  /**
   * Get the z-index for interaction priority
   */
  getZIndex?(): number;
}
