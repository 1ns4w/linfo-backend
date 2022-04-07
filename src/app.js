import {} from 'dotenv/config'
import puppeteer from 'puppeteer'

const scrap = async (url) => {
    const typeOptions = { delay: 100 }
    const pageOptions = { timeout: 90000, waitUntil: 'networkidle2' }
    const browser = await puppeteer.launch({ headless: true })
    const page = await browser.newPage()
    await page.goto('https://www.linkedin.com/', pageOptions)
    await page.waitForXPath('//input[@autocomplete="username"]')
    const [usernameInput] = await page.$x('//input[@autocomplete="username"]')
    const [passwordInput] = await page.$x('//input[@autocomplete="current-password"]')
    console.log("a")
    await usernameInput.type(process.env.LINKEDIN_BOT_EMAIL, typeOptions)
    await passwordInput.type(process.env.LINKEDIN_BOT_PASSWORD, typeOptions)
    console.log("a")
    await passwordInput.press('Enter')
    await page.waitForNavigation({ timeout: 90000, waitUntil: 'domcontentloaded' })
    await page.goto(url, pageOptions)
    const people = await page.$x('//a[contains(@class, "app-aware-link") and ./span]')
    const tmpPage = await browser.newPage()

    let scrapedProfiles = []

    for (const person of people) {
        const personURL = await page.evaluate(a => a.href, person)
        await tmpPage.goto(personURL, { timeout: 200000, waitUntil: 'networkidle2' })
        const title = await tmpPage.title()
        console.log(title)
        scrapedProfiles.push(title)
    }

    await browser.close()
    console.log(scrapedProfiles)
}

scrap('https://www.linkedin.com/search/results/people/?keywords=fullstack')