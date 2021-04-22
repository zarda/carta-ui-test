const resizeObserverLoopErrRe = /^[^(ResizeObserver loop limit exceeded)]/
Cypress.on('uncaught:exception', (err) => {
    /* returning false here prevents Cypress from failing the test */
    if (resizeObserverLoopErrRe.test(err.message)) {
        return false
    }
})
const testImageName = 'M17_SWex.fits'
// const testImageName = 'hugeGaussian10k.fits'
describe('Open_file_browser', () => {
    it('Visits the carta demo server', () => {
        cy.visit('')
        cy.get('[class="bp3-button-text"]').contains('Close')
    })
    it(`Open folder "set_QA"`, () => {
        cy.get('input').type('set_QA')
        cy.get(`[title="set_QA"]`).click()
    })
    it(`Open image "${testImageName}"`, () => {
        cy.get('input').type(testImageName)
        cy.get(`[title="${testImageName}"]`).click()
        const t0 = performance.now()
        cy.get('[class="bp3-button-text"]')
            .contains('Load')
            .click()

        cy.get('[class="bp3-button-text"]', { timeout: 20000 })
            .contains('Load', { timeout: 20000 })

        cy.get('[class="bp3-label"]', { timeout: 20000 })
            .contains('Clip Min', { timeout: 20000 })

        cy.get('input')
            .get('[type="text"]')
            .first()
            .should('have.value', 0) // Clip Min == 0

        cy.get('input')
            .get('[type="text"]')
            .first()
            .invoke('val')
            .should(text => {
                const value = parseFloat(text)
                expect(value).not.to.be.equal(0)
            }) // Clip Min != 0

        cy.get('canvas#raster-canvas')
            // .screenshot()
            .then(() => {
                cy.wrap(performance.now()).then(t1 => {
                    cy.log(`Image load took ${t1 - t0} milliseconds.`);
                })
            })

    })
})
