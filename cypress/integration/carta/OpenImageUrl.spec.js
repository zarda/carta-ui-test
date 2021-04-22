const resizeObserverLoopErrRe = /^[^(ResizeObserver loop limit exceeded)]/
Cypress.on('uncaught:exception', (err) => {
    /* returning false here prevents Cypress from failing the test */
    if (resizeObserverLoopErrRe.test(err.message)) {
        return false
    }
})

describe('Open_file_browser', () => {
    it('Visits the carta demo server', () => {
        const t0 = performance.now()
        cy.visit('&folder=set_QA&file=M17_SWex.fits')
        // cy.get('[class="tag-image-ratio"]').should('have.css', 'opacity', '1')
        cy.get('[class="tag-image-ratio"]').should('have.css', 'opacity', '0')
        cy.get('[class="raster-canvas"]').should('be.visible').then(()=>{
            cy.wrap(performance.now()).then(t1 => {
                cy.log(`Image load took ${t1 - t0} milliseconds.`);
            })
        })
    })
})
