
describe('My First Test pass/fail', () => {
    it('Does not do much!', () => {
        expect(true).to.equal(true)
    })
})
describe('My First Test link', () => {
    it('Visits the Kitchen Sink', () => {
        cy.visit('https://example.cypress.io')
    })
})