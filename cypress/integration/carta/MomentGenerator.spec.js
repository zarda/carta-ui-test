const resizeObserverLoopErrRe = /^[^(ResizeObserver loop limit exceeded)]/
Cypress.on('uncaught:exception', (err) => {
    /* returning false here prevents Cypress from failing the test */
    if (resizeObserverLoopErrRe.test(err.message)) {
        return false
    }
})
const testImageName = 'M17_SWex.fits'
const testRegionName = 'M17_SWex_test_world.crtf'
const repeatTrigger = 3
const repeatCancel = 4
describe('Open testing image', () => {
    it('Visits the carta demo server', () => {
        cy.visit('')
        cy.get('[class="bp3-text-overflow-ellipsis bp3-fill"]').contains('File').click()
        cy.get('[class="bp3-text-overflow-ellipsis bp3-fill"]').contains('Open image').click()
        cy.get('[class="bp3-button-text"]').contains('Close').should('be.exist')
    })
    it(`Open folder "set_QA"`, () => {
        cy.get('input:first').type('set_QA')
        cy.get(`[title="set_QA"]`).click()
    })

    it(`Open image "${testImageName}"`, () => {
        cy.get('input:first').type(testImageName)
        cy.get(`[title="${testImageName}"]`).dblclick()
        cy.get('h4.bp3-heading').contains('Loading file info...').should('not.exist')

        cy.get('[class="bp3-icon bp3-icon-cloud-download contour-loading-icon icon-visible"]')

        cy.get('[class="bp3-icon bp3-icon-cloud-download contour-loading-icon"]')

        cy.get('canvas#raster-canvas')
            .should('have.attr', 'width')

        // cy.wait(300)
        //     .get('canvas#overlay-canvas')
        //     .screenshot()
    })
})
describe('Import regions', () => {
    it('Open dialog', () => {
        cy.get('[class="bp3-text-overflow-ellipsis bp3-fill"]')
            .contains('File')
            .click()
        cy.get('[class="bp3-text-overflow-ellipsis bp3-fill"]')
            .contains('Import regions')
            .click()
        cy.get('[class="bp3-button-text"]')
            .contains('Close')
    })
    it('Open region file', () => {
        cy.get('input:first')
            .wait(100)
            .type('set_QA_regionTest')
        cy.get(`span`)
            .contains('set_QA_regionTest')
            .click({ force: true })
        cy.get('input:first')
            .type(testRegionName)
        cy.get(`[class="cell-text"]`)
            .contains(testRegionName)
            .click({ force: true })
        cy.get('[class="bp3-button-text"]')
            .contains('Load Region')
            .click()
    })
})
describe('Open dialog of moment', () => {
    it('Open spectral profile dialog', () => {
        cy.get('[class="bp3-text-overflow-ellipsis bp3-fill"]')
            .contains('Widgets')
            .click()
        cy.get('[class="bp3-text-overflow-ellipsis bp3-fill"]')
            .contains('Profiles')
            .trigger('mouseover')
            .wait(300)
        cy.get('[class="bp3-text-overflow-ellipsis bp3-fill"]')
            .contains('Spectral Profiler')
            .click()
    })
    it('Open moment generator dialog', () => {
        cy.get('[d="M 0.81609227,1.2562455 V 14.58427 H 3.5600972 V 5.2322526 h 0.037333 L 6.8641032,14.58427 H 9.1227739 L 12.389446,5.1389191 h 0.03733 V 14.58427 h 2.744005 V 1.2562455 H 11.045444 L 8.0961054,10.421595 H 8.058772 L 4.941433,1.2562455 Z"]')
            .click({ force: true })
    })
    it('Select on moment generator dialog', () => {
        cy.get('[class="bp3-html-select unlinked-to-selected"]>select')
            .eq(2)
            .select('0')
        cy.get('[class="bp3-input-ghost bp3-multi-select-tag-input-input"]')
            .click({ force: true })
        cy.get('[class="bp3-text-overflow-ellipsis bp3-fill"]')
            .contains(/^-1:/)
            .click()
        cy.get('[class="bp3-text-overflow-ellipsis bp3-fill"]')
            .contains(/^1:/)
            .click()
        cy.get('[class="bp3-text-overflow-ellipsis bp3-fill"]')
            .contains(/^2:/)
            .click()
        cy.get('[class="bp3-text-overflow-ellipsis bp3-fill"]')
            .contains(/^3:/)
            .click()
        cy.get('[class="bp3-text-overflow-ellipsis bp3-fill"]')
            .contains(/^4:/)
            .click()
        cy.get('[class="bp3-text-overflow-ellipsis bp3-fill"]')
            .contains(/^5:/)
            .click()
        cy.get('[class="bp3-text-overflow-ellipsis bp3-fill"]')
            .contains(/^6:/)
            .click()
        cy.get('[class="bp3-text-overflow-ellipsis bp3-fill"]')
            .contains(/^7:/)
            .click()
        cy.get('[class="bp3-text-overflow-ellipsis bp3-fill"]')
            .contains(/^8:/)
            .click()
        cy.get('[class="bp3-text-overflow-ellipsis bp3-fill"]')
            .contains(/^9:/)
            .click()
        cy.get('[class="bp3-text-overflow-ellipsis bp3-fill"]')
            .contains(/^10:/)
            .click()
        cy.get('[class="bp3-text-overflow-ellipsis bp3-fill"]')
            .contains(/^11:/)
            .click()
    })
})

describe('Test moment generator', () => {
    let timeLog = [];
    it('Trigger moment generator', () => {
        let t0 = performance.now()
        cy.get('[class="bp3-button bp3-intent-success"]')
            .contains('Generate', { timeout: 20000 })
            .click({ timeout: 20000 })
            .then(() => {
                cy.wrap(performance.now()).then(t1 => {
                    t0 = performance.now()
                })
            })
        for (let i = 1; i < repeatTrigger; i++) {
            cy.get('[class="bp3-button bp3-intent-success"]', { timeout: 20000 })
                .contains('Generate')
                .click({ timeout: 20000 })
                .then(() => {
                    cy.wrap(performance.now()).then(t1 => {
                        const duration = t1 - t0
                        cy.log(`Moment generator took ${duration} milliseconds.`);
                        timeLog.push(duration)
                        t0 = performance.now()
                    })
                })
        }
    })
    it(`Report`, () => {
        timeLog.map(value => cy.log(value + ' ms'))
        const timeSum = timeLog.reduce((a, c) => a + c)
        const timeMean = timeSum / timeLog.length
        cy.log('Mean= ' + timeMean.toFixed(2) + ' ms')
        const timeDev = Math.sqrt(timeLog.reduce((a, c) => a + Math.pow(c - timeMean, 2))) / timeLog.length
        cy.log('Dev= ' + timeDev.toFixed(2) + ' ms')
    })
})

describe('Cancel moment generator', () => {
    const waitTime = 800
    it(`Trigger, wait ${waitTime}ms and cancel moment generator`, () => {
        for (let i = 1; i < repeatCancel; i++) {
            cy.get('[class="bp3-button bp3-intent-success"]')
                .contains('Generate')
                .click()
                .wait(waitTime)
            cy.get('[class="bp3-button-text"]')
                .contains('Cancel')
                .click()
        }
    })

})