import puppeteer from "puppeteer"
import Fastify from "fastify"

const fast = Fastify()

fast.get("/", async(request, response) => {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    const pageDOM = await (await page.goto('https://example.com')).text()
    await browser.close()
    return pageDOM
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
