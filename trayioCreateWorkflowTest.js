var webdriver =  require ('selenium-webdriver'),
    By = webdriver.By,
    until  =  webdriver.until,
    config = require('./../config/config.json'),
    simulationSleepTime = 3000,
   

 chromeCapabilities = webdriver.Capabilities.chrome();
//setting chrome options to start the browser fully maximized
var chromeOptions = {
    'args': ['--start-fullscreen']
};
chromeCapabilities.set('chromeOptions', chromeOptions);
var driver = new webdriver.Builder().withCapabilities(chromeCapabilities).build();

driver.get(config.baseUrl).then(acceptCookie);

//accept cookie and navigate to login page
function acceptCookie (){
   
    var cookieButton = driver.wait(until.elementLocated(By.xpath("//a[contains(text(),'GOT IT')]")));
    cookieButton.click();

    var loginLink = driver.wait(until.elementLocated(By.xpath("//a[@href='https://app.tray.io']")));
    loginLink.click().then(login);
}
//login using valid credentials
function login(){
    var userName = driver.wait(until.elementLocated(By.name("username")));
    userName.sendKeys(config.userName).then(function(){
        var password = driver.wait(until.elementLocated(By.name("password")));
        password.sendKeys(config.password).then(function(){
            var loginButton = driver.wait(until.elementLocated(By.xpath("//button[contains(text(),'Login')]")));
            loginButton.click().then(createWorkflow);
  }
        });
    });
}
//create workflow
function createWorkflow(){
    var workFlow = driver.wait(until.elementLocated(By.xpath("//a[contains(text(),'Create New Workflow')]")));
        workFlow.click().then(simulate(workflowName));
}
//find input, and create workflow 
function workflowName(){
    var workFlowName = driver.wait(until.elementLocated(By.xpath("//input[contains(@name,'name')]")));
    workFlowName.sendKeys(config.workflowName).then(function(){
        var create= driver.wait(until.elementLocated(By.xpath("//div[contains(@title,'Create')]")));
        create.click().then(simulate(navigateToDashboard));
    }); 
}

//after creating workflow,navigate to dashboard
function navigateToDashboard(){
    // PS: The appearence of close button is intermittent after creating workflow
    
    /*driver.executeAsyncScript("document.getElementsByTagName('a')[0].click()");
    simulate(findWorkflow);*/
    
    //driver.wait(until.elementLocated(By.xpath("//a[@href='/']"))).click().then(findWorkflow);
    // driver.findElement(By.xpath("//a[@href='/']")).click().then(findWorkflow);
   
   driver.navigate().to('https://app.tray.io').then(assertWorflow);
}

//assert workflow creation
function assertWorflow(){
    var workflowItem = driver.wait(until.elementLocated(By.xpath("//ul[contains(@class,'ListItems')]/li[2]//header[contains(text(),'Test Work Flow')]")));
    workflowItem.getText().then(function(text){
       try{
        assert.equal(config.workflowName,text);
        findWorkflow();
       }
       catch(error)
       {
           console.log('correct workflow is not created, hence terminating test');
       }
    });
}

//find workflow menu item and click
function findWorkflow(){
        var menuItem= driver.wait(until.elementLocated(By.xpath("//ul[contains(@class,'ListItems')]/li[2]//div[contains(@class,'Options-menu')]")));
        menuItem.click().then(simulate(deleteWorkflow));
}
//find delete button and click
function deleteWorkflow(){
    var deleteMenuItem = driver.wait(until.elementLocated(By.xpath("//ul[contains(@class,'ListItems')]/li[2]//div[contains(@class,'Options-menu')]/ul//a[contains(text(),'Delete')]")));
    deleteMenuItem.click().then(simulate(confirmDelete));
}
//confirm delete
function confirmDelete(){
    var yesButton = driver.findElement(By.xpath("//div[@title='Yes']"));
        yesButton.click().then(simulate(logout));                          
}
//find avatar menu, click on it and then press on logout button
function logout(){
    var avatarButton = driver.wait(until.elementLocated(By.id("avatar")));
    avatarButton.click().then(simulate(function(){
        var logoutButton = driver.wait(until.elementLocated(By.xpath("//a[@href='/logout']")));
        logoutButton.click().then(simulate(quitBrowser)); 
    }));
}
//quit the browser
function quitBrowser(){
    console.log('test completed closing browser...');    
    driver.quit();
}

function simulate(callback){
    driver.sleep(simulationSleepTime).then(callback);
}