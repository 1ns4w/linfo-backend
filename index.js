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

fast.get("/scrap/:keyword", async(request, response) => {
    return request.params
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
