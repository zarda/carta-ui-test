const resizeObserverLoopErrRe = /^[^(ResizeObserver loop limit exceeded)]/
Cypress.on('uncaught:exception', (err) => {
    /* returning false here prevents Cypress from failing the test */
    if (resizeObserverLoopErrRe.test(err.message)) {
        return false
    }
})
const testFolder = 'set_QA'
const testImageName = 'M17_SWex.fits'
// const testImageName = 'hugeGaussian20k.fits'
describe('Open_file_browser', () => {
    it(`Visits the carta demo server and open image "${testFolder}/${testImageName}"`, () => {
        const t0 = performance.now()
        cy.visit(`&folder=${testFolder}&file=${testImageName}`)
        cy.get('[class="bp3-label"]').contains('Clip Min').then(()=>{
            cy.wrap(performance.now()).then(t1 => {
                cy.log(`Image load took ${t1 - t0} milliseconds.`);
            })
        })
    })

    it(`Re-do open image "${testFolder}/${testImageName}"`, () => {
        const t0 = performance.now()
        cy.visit(`&folder=${testFolder}&file=${testImageName}`)
        cy.get('[class="bp3-label"]').contains('Clip Max').then(()=>{
            cy.wrap(performance.now()).then(t1 => {
                cy.log(`Image load took ${t1 - t0} milliseconds.`);
            })
        })
    })
})
