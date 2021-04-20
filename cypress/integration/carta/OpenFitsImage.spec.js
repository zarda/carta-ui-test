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
    it(`Open folder "set_QA"`, ()=>{
        cy.get('input').type('set_QA')
        cy.get(`[title="set_QA"]`).click()
    })
    it(`Open image "M17_SWex.fits"`, ()=>{
        cy.get('input').type('M17_SWex.fits')
        cy.get(`[title="M17_SWex.fits"]`).click()
        cy.get('[class="bp3-button-text"]').contains('Load').click()
    })
})
