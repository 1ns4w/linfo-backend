import puppeteer from "puppeteer"
import Fastify from "fastify"

let fast = Fastify({logger: true})

fast.get("/", async(request, response) => {
    let browser = await puppeteer.launch(headless: true, args: ["--no-sandbox"])
    let page = await browser.newPage()
    let pageDOM = await (await page.goto('https://example.com')).text()
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
