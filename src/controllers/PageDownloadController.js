import puppeteer from 'puppeteer';
import qs from "query-string";

export class PageDownloadController {
    constructor() {
        this.browser = puppeteer.launch({
            headless: true,
            executablePath: '/usr/bin/chromium-browser',
            args: [
                '--no-sandbox',
                '--disable-dev-shm-usage',
                // '--disable-gpu',
                // '--single-process',
                // '--no-zygote',
            ],
        });

        this.downloadPNG = this.downloadPNG.bind(this);
        this.downloadPDF = this.downloadPDF.bind(this);
    }

    // TODO: this.browser.close()

    /**
     * Responde com uma imagem da página
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     */
    async downloadPNG(req, res) {
        const page = await (await this.browser).newPage();

        const width = 1366;
        const height = 1340;

        await page.setViewport({
            width,
            height,
        });
        await page.goto('http://atlas-frontend-dev:3000/resultado?' + qs.stringify(req.query));
        const buffer = await page.screenshot({
            clip: {
                width,
                height,
                y: 70,
                x: 0,
            }
        });

        await page.close();

        res.set({ 'Content-Type': 'image/png', 'Content-Length': buffer.length })
        res.send(buffer);
    }

    async downloadPDF(req, res) {
        const page = await (await this.browser).newPage();

        const width = 1366;
        const height = 1340;

        await page.setViewport({
            width,
            height,
        });
        await page.goto('http://atlas-frontend-dev:3000/resultado?' + qs.stringify(req.query), { waitUntil: "networkidle0" });
        const pdf = await page.pdf({
            format: "A2"
        });
        await page.close();

        //TODO: use this to display none FOOTER 
        //await page.addStyleTag({ content: '.nav { display: none} .navbar { border: 0px} #print-button {display: none}' })

        res.set({ 'Content-Type': 'application/pdf', 'Content-Length': pdf.length })
        res.send(pdf);
    }
}