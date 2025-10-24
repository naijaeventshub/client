describe('Home Page', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000');
  });

  it('loads the home page', () => {
    cy.title().should('include', 'Konfera');
  });

  it('page should have content', () => {
    cy.get('body').should('exist');
  });
});
