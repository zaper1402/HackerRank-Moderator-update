const fs = require('fs');
const puppeteer = require('puppeteer');
const path = require("path");
let cfile = process.argv[2];//credetials
let user = process.argv[3];//metadata
let quesHrefList = [];
let hackerRankUrl = "https://www.hackerrank.com/";



(async function ReadCred() {
    try {
        //inplicit waits
        const browser = await puppeteer.launch({
            headless: false,
            defaultViewport: null,
            slowMo: 10,

            args: ['--start-maximized', '--disable-notifications']
        });

        //obtain credentials
        let CredObj = await fs.promises.readFile(cfile, 'utf-8');
        let credentials = JSON.parse(CredObj);
        let username = credentials.username;
        let pwd = credentials.pwd;
        let URL = credentials.url;

        
        let pages = await browser.pages();
        let page = pages[0];
        //load url
        page.goto(URL, {
            waitUntil: 'networkidle0'
        });
        //wait till auth button appear
        await page.waitForSelector(".auth-button", {
            visible: true
        });
        //login
        await page.type('#input-1', username);
        await page.type('#input-2', pwd);
        await page.click(".auth-button");

        //wait
        await page.waitForNavigation({ waitUntil: 'networkidle0' });
        await page.waitForSelector('.ui-icon-chevron-down.down-icon', {
            visible: true
        });

        //click on drop down menu and click admin
        await page.click(".ui-icon-chevron-down.down-icon");
        await page.click("a[data-analytics=NavBarProfileDropDownAdministration]");

        await page.waitForNavigation({ waitUntil: 'networkidle0' });
        await page.waitForSelector('.nav-tabs.nav.admin-tabbed-nav', {
            visible: true
        });

        //click manage tabs 
        let manageTabs = await page.$$("ul.nav-tabs li");
        await manageTabs[1].click();

        //call for getQuestions
        await getQuestions(page);
        // console.log(quesHrefList.length);
        for(let i=0;i<quesHrefList.length;i++)
        await handleQuestions(page,quesHrefList,i);

        await browser.close();
        
    } catch (err) {
        console.log(err);
    }

})();


async function getQuestions(page) {
    try {

        await page.waitForNavigation({ waitUntil: 'networkidle0' });
        await page.waitForSelector('.pagination li', {
            visible: true
        });
        
        //load page toogle buttons list
        let pageList = await page.$$(".pagination li");
        //select next pag button
        let NextPageBtn = pageList[pageList.length - 2];
        let btnStatus = await NextPageBtn.evaluate(el => el.getAttribute('class'));

        while (true) {
            //call for getQuesLink func
            await getQuestionsLink(page);

            //check for last page 
            if (btnStatus != 'disabled') {
                await NextPageBtn.click();
                await page.waitForNavigation({ waitUntil: 'networkidle0' });
                await page.waitForSelector('.pagination li', {
                    visible: true
                });

                pageList = await page.$$(".pagination li");
                NextPageBtn = pageList[pageList.length - 2];
                btnStatus = await NextPageBtn.evaluate(el => el.getAttribute('class'));
            } else {
                break;
            }

        }

    } catch (err) {
        console.log(err);
    }
}




async function getQuestionsLink(page) {
    try {
        //questions link
        let quesList = await page.$$(".table-body.mlB a");
        for (let i = 0; i < quesList.length; i++) {
            let Href = await quesList[i].evaluate(el => el.getAttribute('href'));
            quesHrefList.push(path.join(hackerRankUrl + Href));
        }
        // console.log(quesHrefList);



    } catch (err) {
        console.log(err);
    }
}


async function handleQuestions(page,quesHrefList, idx) {
    
        await page.goto(quesHrefList[idx], {
            waitUntil: 'networkidle0'
        });
        await page.waitForSelector('span.tag', {
            visible: true
        });
        
        //click moderator 
        await page.click("li[data-tab=moderators]");
        await page.waitForSelector('#moderator', {
            visible: true
        });
        //enter profile name 
        await page.type('#moderator',user);
        await page.keyboard.press('Enter');
        await page.click('.save-challenge');
        console.log(idx);
        // await handleQuestions(page,quesHrefList, idx + 1);
    

}
