import {} from 'dotenv/config'
import puppeteer from 'puppeteer'

const scrap = async (url) => {
    const typeOptions = { delay: 100 }
    const pageOptions = { waitUntil: 'networkidle2' }
    const browser = await puppeteer.launch({ headless: true })
    const page = await browser.newPage()
    await page.goto('https://www.linkedin.com/', { waitUntil: 'networkidle0' })
    const [usernameInput] = await page.$x('//input[@autocomplete="username"]')
    const [passwordInput] = await page.$x('//input[@autocomplete="current-password"]')
    await usernameInput.type(process.env.LINKEDIN_BOT_EMAIL, typeOptions)
    await passwordInput.type(process.env.LINKEDIN_BOT_PASSWORD, typeOptions)
    await passwordInput.press('Enter')
    await page.waitForNavigation({ waitUntil: 'domcontentloaded' })
    await page.goto(url, { timeout: 60000, ...pageOptions})
    const people = await page.$x('//a[contains(@class, "app-aware-link") and ./span]')
    const tmpPage = await browser.newPage()

    const test = () => document.documentElement.scrollHeight
    tmpPage.exposeFunction("test", test)

    let scrapedProfiles = []

    for (const person of people) {
        const personURL = await page.evaluate(a => a.href, person)
        await tmpPage.goto(personURL, {timeout: 300000, ...pageOptions})
        const scrapedProfile = await tmpPage.evaluate( () => test() )
        scrapedProfiles.push(scrapedProfile)
        console.log(scrapedProfile)
    }

    await browser.close()
    console.log(scrapedProfiles)
}

scrap('https://www.linkedin.com/search/results/people/?keywords=fullstack')