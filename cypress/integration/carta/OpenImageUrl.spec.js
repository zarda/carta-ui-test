import config from '../../../cypress.json'
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
const repeatTimes = 5

describe('Open_file_browser', () => {
    it(`Visits the carta demo server and open image "${testFolder}/${testImageName}"`, () => {
        const t0 = performance.now()
        cy.log(config.baseUrl)
        cy.visit(`${config.baseUrl.includes('?')?'&':'?'}folder=${testFolder}&file=${testImageName}`)

        cy.get('[class="bp3-icon bp3-icon-cloud-download contour-loading-icon icon-visible"]')

        cy.get('[class="bp3-icon bp3-icon-cloud-download contour-loading-icon"]')

        cy.get('canvas#raster-canvas')
            .should('have.attr', 'width')
            .then(() => {
                cy.wrap(performance.now()).then(t1 => {
                    const duration = t1 - t0
                    cy.log(`Image load took ${duration} milliseconds.`);
                    timeLog.push(duration)
                })
            })

        cy.get('canvas#raster-canvas')
        // .screenshot()
        // .wait(200)
        // .screenshot()
        // .wait(40)
        // .screenshot()

    })

    let timeLog = [];
    for (let i = 0; i < repeatTimes; i++) {
        it(`Re-do open image "${testFolder}/${testImageName}"`, () => {
            const t0 = performance.now()
            cy.reload(true)

            cy.get('[class="bp3-icon bp3-icon-cloud-download contour-loading-icon icon-visible"]')

            cy.get('[class="bp3-icon bp3-icon-cloud-download contour-loading-icon"]')

            cy.get('canvas#raster-canvas')
                .should('have.attr', 'width')
                .then(() => {
                    cy.wrap(performance.now()).then(t1 => {
                        const duration = t1 - t0
                        cy.log(`Image load took ${duration} milliseconds.`);
                        timeLog.push(duration)
                    })
                })

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
