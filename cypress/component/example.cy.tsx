describe('Example Component Test', () => {
  it('renders a heading', () => {
    cy.mount(
      <div>
        <h1>Welcome to Cypress</h1>
        <p>Component testing is working!</p>
      </div>
    );
    cy.contains('h1', 'Welcome to Cypress').should('be.visible');
    cy.contains('p', 'Component testing is working!').should('be.visible');
  });
});
