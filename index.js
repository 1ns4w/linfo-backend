import puppeteer from "puppeteer"
import Fastify from "fastify"
import fastifyCors from "fastify-cors"

let fast = Fastify({logger: true})

fast.register(fastifyCors, {
    origin: "*",
    methods: ["POST"]
})

fast.get("/", async(request, response) => {
    let browser = await puppeteer.launch({headless: true, args: ["--no-sandbox"]})
    let page = await browser.newPage()
    let pageDOM = await (await page.goto('https://example.com')).text()
    await browser.close()
    response.type("text/html").send(pageDOM)
})

fast.get('/scrap/:keyword', async(request, response) => {
    const typeOptions = {delay: 100}
    const pageOptions = {timeout: 90000, waitUntil: 'networkidle2'}
    const browser = await puppeteer.launch({headless: true, args: ["--no-sandbox"]})
    const page = await browser.newPage()
    await page.goto('https://www.linkedin.com/', pageOptions)
    await page.waitForXPath('//input[@autocomplete="username"]')
    const usernameInput = (await page.$x('//input[@autocomplete="username"]'))[0]
    const passwordInput = (await page.$x('//input[@autocomplete="current-password"]'))[0]
    await usernameInput.type(process.env.LINKEDIN_BOT_EMAIL, typeOptions)
    await passwordInput.type(process.env.LINKEDIN_BOT_PASSWORD, typeOptions)
    await passwordInput.press('Enter')
    await page.waitForNavigation(pageOptions)
    const title = page.title()
    await browser.close()
    return title
})

const start = async () => {
    try {
        await fast.listen(process.env.PORT || 3000, '0.0.0.0')
    }
    catch (err) {
        fast.log.error(err)
        process.exit(1)
    }
}

start()
