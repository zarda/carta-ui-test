const resizeObserverLoopErrRe = /^[^(ResizeObserver loop limit exceeded)]/
Cypress.on('uncaught:exception', (err) => {
    /* returning false here prevents Cypress from failing the test */
    if (resizeObserverLoopErrRe.test(err.message)) {
        return false
    }
})
const testImageName = 'M17_SWex.fits'
// const testImageName = 'hugeGaussian10k.fits'
const repeatTimes = 3

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
        cy.get('h4.bp3-heading').contains('Loading file info...').should('not.exist')

        const t0 = performance.now()
        cy.get('[class="bp3-button-text"]')
            .contains('Load')
            .click()

        // cy.get('[class="bp3-icon bp3-icon-cloud-download contour-loading-icon icon-visible"]')
        // cy.get('[class="bp3-icon bp3-icon-cloud-download contour-loading-icon"]')

        cy.get('canvas#raster-canvas')
            .should('have.attr', 'width')
            .then(() => {
                cy.wrap(performance.now()).then(t1 => {
                    const duration = t1 - t0
                    cy.log(`Image load took ${duration} milliseconds.`);
                    timeLog.push(duration)
                })
            })
        cy.wait(500)
        // .get('canvas#raster-canvas')
        // .screenshot()


        cy.get('[class="bp3-text-overflow-ellipsis bp3-fill"]').contains('File').click()
        cy.get('[class="bp3-text-overflow-ellipsis bp3-fill"]').contains('Close image').click()

    })

    let timeLog = [];
    for (let i = 0; i < repeatTimes; i++) {
        it(`Reopen image "${testImageName}"`, () => {
            cy.get('[class="bp3-text-overflow-ellipsis bp3-fill"]').contains('File').click()
            cy.get('[class="bp3-text-overflow-ellipsis bp3-fill"]').contains('Open image').click()

            cy.get('input').type(testImageName)
            cy.get(`[title="${testImageName}"]`).click()
            cy.get('h4.bp3-heading').contains('Loading file info...').should('not.exist')

            const t0 = performance.now()
            cy.get('[class="bp3-button-text"]')
                .contains('Load')
                .click()

            // cy.get('[class="bp3-icon bp3-icon-cloud-download contour-loading-icon icon-visible"]')
            // cy.get('[class="bp3-icon bp3-icon-cloud-download contour-loading-icon"]')

            cy.get('canvas#raster-canvas')
                .should('have.attr', 'width')
                .then(() => {
                    cy.wrap(performance.now()).then(t1 => {
                        const duration = t1 - t0
                        cy.log(`Image load took ${duration} milliseconds.`);
                        timeLog.push(duration)
                    })
                })

            cy.wait(500)
            cy.get('[class="bp3-text-overflow-ellipsis bp3-fill"]').contains('File').click()
            cy.get('[class="bp3-text-overflow-ellipsis bp3-fill"]').contains('Close image').click()
        })
    }

    it(`Report`, () => {
        timeLog.map(value => cy.log(value + ' ms'))
        const timeSum = timeLog.reduce((a, c) => a + c)
        const timeMean = timeSum / timeLog.length
        cy.log('Mean= ' + timeMean.toFixed(2) + ' ms')
        const timeDev = Math.sqrt(timeLog.reduce((a, c) => a + Math.pow(c - timeMean, 2))) / timeLog.length
        cy.log('Dev= ' + timeDev.toFixed(2) + ' ms')
    })
})
