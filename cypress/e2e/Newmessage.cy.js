describe('NewMessage', () => {

  beforeEach(() => {
    cy.visit('http://localhost:5173/login');
  });

  it('megjeleníti a bejelentkezés gombot', () => {
    cy.contains('button', /bejelentkezés/i).should('be.visible');
  });


  it('sikeres bejelentkezés után a dashboard töltődik be és üzenet küldése', () => {
    cy.get('input[name="email"]').type('teszt@pelda.hu');
    cy.get('input[name="password"]').type('helyes123');
    cy.contains('button', /bejelentkezés/i).click();
    cy.contains(/Belépve:/i).should('be.visible');
    cy.contains('button', / Új üzenet/i).click();
    cy.get('input[name="MessageTitle"]').type('Ez egy új üzenet');
    cy.get('textarea[name="MessageBody"]').type('Ez egy új üzenet tartalma');
    cy.contains('button', /Küldés a kijelzőre/i).click();
    cy.contains('SIKERESEN ELKÜLDVE A SZERVERRE!').should('be.visible');
  });

  
});