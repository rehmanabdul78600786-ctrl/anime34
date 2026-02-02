const puppeteer = require('puppeteer');

module.exports = async (req, res) => {
    const { url } = req.query;
    if(!url) return res.status(400).json({ status:false, msg:"URL missing" });

    try {
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox','--disable-setuid-sandbox']
        });
        const page = await browser.newPage();

        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0 Safari/537.36');
        await page.goto(url, { waitUntil: 'networkidle2' });

        // ✅ codedew link nikalna
        const codedewLink = await page.evaluate(() => {
            const a = document.querySelector('a[href*="codedew.com/multiquality"]');
            return a ? a.href : null;
        });

        if(!codedewLink) {
            await browser.close();
            return res.json({ status:false, msg:"Codedew link not found" });
        }

        // codedew page open
        await page.goto(codedewLink, { waitUntil: 'networkidle2' });

        // final download links nikalna
        const downloads = await page.evaluate(() => {
            const arr = [];
            document.querySelectorAll('a').forEach(a => {
                if(/480|720|1080/i.test(a.innerText)) {
                    arr.push({ quality: a.innerText.trim(), link: a.href });
                }
            });
            return arr;
        });

        await browser.close();

        return res.json({
            status:true,
            source:codedewLink,
            downloads
        });

    } catch(e) {
        return res.status(500).json({ status:false, error:e.message });
    }
}
