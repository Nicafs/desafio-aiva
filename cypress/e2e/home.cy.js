describe("Home Page", () => {
  it("should load products", () => {
    cy.visit("http://localhost:5173");
    cy.contains("Products");
    cy.get("a").should("have.length.greaterThan", 1);
  });
});
