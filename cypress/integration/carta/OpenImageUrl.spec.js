const resizeObserverLoopErrRe = /^[^(ResizeObserver loop limit exceeded)]/
Cypress.on('uncaught:exception', (err) => {
    /* returning false here prevents Cypress from failing the test */
    if (resizeObserverLoopErrRe.test(err.message)) {
        return false
    }
})
const testFolder = 'set_QA'
const testImageName = 'M17_SWex.fits'
// const testImageName = 'hugeGaussian10k.fits'
describe('Open_file_browser', () => {
    it(`Visits the carta demo server and open image "${testFolder}/${testImageName}"`, () => {
        const t0 = performance.now()
        cy.visit(`&folder=${testFolder}&file=${testImageName}`)

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
            .then(() => {
                cy.wrap(performance.now()).then(t1 => {
                    cy.log(`Image load took ${t1 - t0} milliseconds.`);
                })
            })

        cy.get('canvas#raster-canvas')
        // .wait(500)
        // .screenshot()

    })

    it(`Re-do open image "${testFolder}/${testImageName}"`, () => {
        const t0 = performance.now()
        cy.visit(`&folder=${testFolder}&file=${testImageName}`)

        cy.get('[class="bp3-label"]', { timeout: 20000 })
            .contains('Clip Max', { timeout: 20000 })

        cy.get('input')
            .get('[type="text"]')
            .eq(1)
            .should('have.value', 1) // Clip Max == 0

        cy.get('input')
            .get('[type="text"]')
            .eq(1)
            .invoke('val')
            .should(text => {
                const value = parseFloat(text)
                expect(value).not.to.be.equal(1)
            }) // Clip Min != 0
            .then(() => {
                cy.wrap(performance.now()).then(t1 => {
                    cy.log(`Image load took ${t1 - t0} milliseconds.`);
                })
            })

    })
})
