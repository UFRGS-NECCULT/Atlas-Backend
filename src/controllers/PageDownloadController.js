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
                '--disable-gpu',
                '--single-process',
                '--no-zygote',
            ],
        });

        this.downloadPNG = this.downloadPNG.bind(this);
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
        const height = 1210;

        await page.setViewport({
            width,
            height,
        });
        await page.goto('http://localhost:3000/resultado?' + qs.stringify(req.query));
        const buffer = await page.screenshot({
            clip: {
                width,
                height,
                y: 70,
                x: 0,
            }
        });


        res.header('Content-Type', 'image/png');
        res.send(buffer);

        await page.close();
    }
}