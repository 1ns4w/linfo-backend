import puppeteer from "puppeteer"
import Fastify from "fastify"
import fastifyCors from "fastify-cors"
import {} from "dotenv/config"
import { Queue, Worker } from "bullmq"

let queue = new Queue('foo')

let fast = Fastify({logger: true})

let state = {}

let scrapData


fast.register(fastifyCors, {
    origin: "*",
    methods: ["POST", "GET"]
})

fast.get("/", async(request, response) => {
    let browser = await puppeteer.launch({headless: true})
    let page = await browser.newPage()
    let pageDOM = await (await page.goto('https://example.com')).text()
    await browser.close()
    response.type("text/html").send(pageDOM)
})

fast.get('/redisqueue', async(req, res)=>{
    const job = await queue.add('job1',{foo: 'bar' })
    state[`${job.id}`]= false
    return {jobid: job.id}
})

fast.get('/scrap/:id', async(request, response) => {
    const {id} = request.params
    if (state[id]) {return {...scrapData, status:true}}
    return {status:false}
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


const worker = new Worker('foo', async job =>{
    
    const typeOptions = {delay: 100}
    const pageOptions = { waitUntil: 'networkidle2'}
    const browser = await puppeteer.launch({headless: true})
    const page = await browser.newPage()
    await page.goto('https://www.linkedin.com/', pageOptions)
    await page.waitForXPath('//input[@autocomplete="username"]')
    const [usernameInput] = await page.$x('//input[@autocomplete="username"]')
    const [passwordInput] = await page.$x('//input[@autocomplete="current-password"]')
    await usernameInput.type(process.env.LINKEDIN_BOT_EMAIL, typeOptions)
    await passwordInput.type(process.env.LINKEDIN_BOT_PASSWORD, typeOptions)
    await passwordInput.press('Enter')
    await page.waitForNavigation(pageOptions)
    const title = await page.title()
    await browser.close()
    scrapData = {title}

})

worker.on('completed', job => {
    state[`${job.id}`]= true
  });

start()
