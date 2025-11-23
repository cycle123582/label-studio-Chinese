export const Tooltip = {
  get root() {
    return cy.get('[data-testid="tooltip"]');
  },
  get body() {
    return this.root.find('[data-testid="tooltip-body"]');
  },
  hasText(text) {
    this.body.should("be.visible").contains(text);
  },
};
