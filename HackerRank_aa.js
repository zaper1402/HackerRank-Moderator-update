let fs = require('fs');
let path = require('path');
let cd = require('chromedriver');
let swd = require('selenium-webdriver');
let bldr = new swd.Builder();
let browser = bldr.forBrowser('chrome').build();

let cfile = process.argv[2];//credetials
let user = process.argv[3];//metadata
let quesHrefList = [];

(async function ReadCred() {
   try {
      //implicit waits 
      await browser.manage().setTimeouts({
         implicit: 10000,
         pageload: 10000
      });
      //read credentail file for login and user name 
      let CredObj = await fs.promises.readFile(cfile, 'utf-8');
      let credentials = JSON.parse(CredObj);
      let username = credentials.username;
      let pwd = credentials.pwd;
      let URL = credentials.url;

      //get URL
      let loginPage = await browser.get(URL);
      //enter username
      let LoginInput = await browser.findElement(swd.By.css('#input-1')).sendKeys(username);
      //enter pwd
      let PwdInput = await browser.findElement(swd.By.css('#input-2')).sendKeys(pwd);
      //click login
      let login = await browser.findElement(swd.By.css(".auth-button")).click();

      //Click profile method
      //let prfileMenu = await browser.findElement(swd.By.css(".pull-left.nav-wrap.mmL"));
      //let prfileClick = await (await browser.findElement(swd.By.css(".dropdown-auth"))).click();

      //Href Method to load admin page 
      let btnAdmin = await browser.findElement(swd.By.css("a[data-analytics=NavBarProfileDropDownAdministration]"));
      let adminHref = await btnAdmin.getAttribute("href");
      await browser.get(adminHref);

      //Click on manage tabs
      let tabs = await browser.findElements(swd.By.css("ul.nav-tabs li"));
      await tabs[1].click();

      //call to get question 
      await getQuestions();
      console.log(quesHrefList.length);
      for(let i=0;i<quesHrefList.length;i++)
      //loop for handle ques
      await handleQuestions(quesHrefList,i);
      
      await browser.close();





   } catch (err) {
      console.log(err);
   }
})();


async function getQuestions() {
   try {
      //get page buttons 
      let pageList = await browser.findElements(swd.By.css(".pagination li"));
      let NextPageBtn = pageList[pageList.length - 2];
      let BtnStatus = await NextPageBtn.getAttribute('class');
      //Method-1
      // while(true){

      //    await getQuestionsLink(quesHrefList);

      //    if (BtnStatus != 'disabled') {
      //       await NextPageBtn.click();
      //       pageList = await browser.findElements(swd.By.css(".pagination li"));
      //       NextPageBtn = pageList[pageList.length - 2];
      //       BtnStatus = await NextPageBtn.getAttribute('class')
      //    } else {
      //       break;
      //    }

      // }


      //Method-2
      await getQuestionsLink(quesHrefList);
      if (BtnStatus != 'disabled') {
         await NextPageBtn.click();
         await getQuestions();
      }


   } catch (err) {
      console.log(err);

   }
}

async function getQuestionsLink(quesHrefList) {
   try {
      //questions link
      let quesList = await browser.findElements(swd.By.css(".table-body.mlB a"));

      for (let i = 0; i < quesList.length; i++) {
         let Href = await quesList[i].getAttribute('href');
         quesHrefList.push(Href);
      }
      // console.log(quesHrefList);

   } catch (err) {
      console.log(err);
   }
}

async function handleQuestions(quesHrefList,idx) {
   //for each link open url
   await browser.get(quesHrefList[idx]);
   await browser.wait(swd.until.elementLocated(swd.By.css('span.tag')));
   //click moderator tab
   let moderatorTab = await browser.findElement(swd.By.css('li[data-tab=moderators]'));
   await moderatorTab.click();
   //enter profile name in moderator textbox
   let moderatorTextBox = await browser.findElement(swd.By.css('#moderator'));
   await moderatorTextBox.sendKeys(user);
   await moderatorTextBox.sendKeys(swd.Key.ENTER);
    //click save 
   let btnSave = await browser.findElement(swd.By.css('.save-challenge'));
   await btnSave.click();
   console.log(idx);
   

}






