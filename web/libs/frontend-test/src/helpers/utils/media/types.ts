export interface ViewWithMedia {
  /**
   * View's container
   */
  get root(): Cypress.Chainable<JQuery<HTMLElement>>;

  /**
   * Get the main media element for this helper
   */
  get mediaElement(): Cypress.Chainable<JQuery<HTMLElement>>;
}

export interface MediaView {
  _bufferingIndicatorSelector: string;
  bufferingIndicator: Cypress.Chainable<JQuery<HTMLElement>>;
  hasBuffering(): void;
  hasNoBuffering(): void;
  hasMediaPlaying(): void;
  hasMediaPaused(): void;
  getCurrentTime(): Cypress.Chainable<number>;
  getDuration(): Cypress.Chainable<number>;
  getNetworkState(): Cypress.Chainable<number>;
  getReadyState(): Cypress.Chainable<number>;
  isPaused(): Cypress.Chainable<boolean>;
}
