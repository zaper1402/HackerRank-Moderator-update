# HackerRank-Moderator-update

This is a automation script for automatic adding of moderators in challenges on HackerRank. It is available 

 - Using Node Puppeteer and chromium library
 - Using Selenium-webdriver framework and ChromeDriver

# Prerequisites

**For Selenium script**
	 install selenium `npm install selenium-webdriver`
	 Install chromeDriver `npm install chromedriver`


**For puppeteer Script**
Install puppeteer `npm i puppeteer`
Note: When you install Puppeteer, it downloads a recent version of Chromium

A version of Puppeteer that doesn't download Chromium by default.
 `npm i puppeteer-core`

# Command
To run the script 
`node Script-Name.js credentials.json "Moderator's HackerRank ID"`
or 
run the bat file with edits

## Note
**Do enter credentials in credentials.json file and update the moderator ID in .bat File before running**
