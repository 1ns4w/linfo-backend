import puppeteer from 'puppeteer'
import {} from 'dotenv/config'

const scrap = async (url) => {
    const typeOptions = { delay: 100 }
    const pageOptions = { timeout: 90000, waitUntil: 'networkidle2' }
    const browser = await puppeteer.launch({ headless: false })
    const page = await browser.newPage()
    await page.goto('https://www.linkedin.com/', pageOptions)
    await page.waitForXPath('//input[@autocomplete="username"]')
    const [usernameInput] = await page.$x('//input[@autocomplete="username"]')
    const [passwordInput] = await page.$x('//input[@autocomplete="current-password"]')
    await usernameInput.type(process.env.LINKEDIN_BOT_EMAIL, typeOptions)
    await passwordInput.type(process.env.LINKEDIN_BOT_PASSWORD, typeOptions)
    await passwordInput.press('Enter')
    await page.waitForNavigation({ timeout: 90000, waitUntil: 'domcontentloaded' })
    await page.goto(url, pageOptions)
    const people = await page.$x('//a[contains(@class, "app-aware-link") and ./span]')

    for (const person of people) {
        const personURL = await page.evaluate(a => a.href, person)
        const tmpPage = await browser.newPage()
        await tmpPage.goto(personURL, { timeout: 90000, waitUntil: 'domcontentloaded' })
        const title = await tmpPage.title()
        console.log(title)
    }

    await browser.close()
}

scrap('https://www.linkedin.com/search/results/people/?keywords=fullstack')