import puppeteer from "puppeteer"
import Fastify from "fastify"
import fastifyCors from "fastify-cors"
import {} from "dotenv/config"

let fast = Fastify({logger: true})

fast.register(fastifyCors, {
    origin: "*",
    methods: ["POST"]
})

fast.get("/", async(request, response) => {
    let browser = await puppeteer.launch({headless: false})
    let page = await browser.newPage()
    let pageDOM = await (await page.goto('https://example.com')).text()
    await browser.close()
    response.type("text/html").send(pageDOM)
})

fast.get('/scrap/:keyword', async(request, response) => {
    const typeOptions = {delay: 100}
    const pageOptions = { waitUntil: 'networkidle2'}
    const browser = await puppeteer.launch({headless: false})
    const page = await browser.newPage()
    await page.goto('https://www.linkedin.com/', pageOptions)
    await page.waitForXPath('//input[@autocomplete="username"]')
    const [usernameInput] = await page.$x('//input[@autocomplete="username"]')
    const [passwordInput] = await page.$x('//input[@autocomplete="current-password"]')
    await usernameInput.type(process.env.LINKEDIN_BOT_EMAIL, typeOptions)
    await passwordInput.type(process.env.LINKEDIN_BOT_PASSWORD, typeOptions)
    await passwordInput.press('Enter')
    console.log("feed")
    await page.waitForNavigation(pageOptions)
   console.log("xd")
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
