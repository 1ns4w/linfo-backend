import puppeteer from "puppeteer"
import Fastify from "fastify"

const fast = Fastify({logger: true})

fast.get("/", async(request, response) => {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    const pageDOM = await (await page.goto('https://example.com')).text()
    await browser.close()
    response.type("text/html").send(pageDOM)
})

const start = async () => {
    try {
        await fast.listen(process.env.PORT, '0.0.0.0')
    }
    catch (err) {
        fast.log.error(err)
        process.exit(1)
    }
}

start()
