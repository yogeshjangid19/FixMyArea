describe('Authentication Flow', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should navigate to landing page and show main features', () => {
    cy.contains('FixMyArea').should('be.visible');
  });

  it('should redirect to auth page for reporting when unauthenticated', () => {
    cy.visit('/report');
    cy.url().should('include', '/auth');
  });

  it('should display registration and login forms', () => {
    cy.visit('/auth');
    cy.contains('Sign In').should('be.visible');
    cy.get('input[type="email"]').should('be.visible');
    cy.get('input[type="password"]').should('be.visible');
  });
});
