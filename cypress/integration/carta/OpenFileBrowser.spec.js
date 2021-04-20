const resizeObserverLoopErrRe = /^[^(ResizeObserver loop limit exceeded)]/
Cypress.on('uncaught:exception', (err) => {
    /* returning false here prevents Cypress from failing the test */
    if (resizeObserverLoopErrRe.test(err.message)) {
        return false
    }
})
describe('Open_file_browser', () => {
    it('Visits the carta demo server', () => {
        cy.visit('')
        cy.wait(2000)
    })
    it(`Close file browser`, ()=>{
        cy.get('[class="bp3-button-text"]').contains('Close').click()
    })
    it(`Open file browser`, ()=>{
        cy.get('[class="bp3-text-overflow-ellipsis bp3-fill"]').contains('File').click()
        cy.get('[class="bp3-text-overflow-ellipsis bp3-fill"]').contains('Open image').click()
    })
})
