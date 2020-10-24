const fs = require("fs");
let tasksFile = "database.json";

// create a new file when user type tasks.js filename.json
process.argv.forEach((val, index) => {
  if (index == 2) {
    tasksFile = val;
  }
})
/**
 * Add new task
 * @param {params} params new task text
 * @returns {void}
 */
function add(params) {
      try {
        if(!fs.existsSync(tasksFile)) {
          fs.writeFileSync(tasksFile, JSON.stringify([], null, 2), error => {
            if (error) throw error;
          })
        }
      } catch (err) {
          console.error(err);
      }
  if (params.length === 0) {
    console.log("Please insert task!");
  }
  else {
    let newTask = {
      name: "",
      done: false
    };
    let space = ' ';
    for(i=0;i<params.length;i++){
      if(i==params.length-1){
        space ='';
      }
      newTask.name += params[i]+space;
    }
    fs.readFile(tasksFile, function (err, data) {  
      if(data.length>0){
        var json = JSON.parse(data);
        json.push(newTask); 
      }else{
        json=[newTask];
      }
      fs.writeFileSync(tasksFile, JSON.stringify(json, null, 2), error => {
        if (error) throw error;
      })
  })
    console.log('Task '+newTask.name.trim()+' was added successfully');
  }
}
/**
 * Remove task by id
 * @param {params} params the task id
 * @returns {void}
 */
function remove(params) {
    fs.readFile(tasksFile, function (err, data) {  
      if(data.length>0){
        var json = JSON.parse(data);
      }else{
        var json=[];
      }
      if(params.length==0){
        let rmTask = json.pop();
        let name =rmTask.name.trim();
        fs.writeFileSync(tasksFile, JSON.stringify(json, null, 2), error => {
          if (error) throw error;
        });
        console.log(`Task '${name}' was removed`);
      }else{
        params = params-1;
        if(json[params]){
          let rmTask = json[params];
          let name =rmTask.name;
          json.splice(params,1);
          fs.writeFileSync(tasksFile, JSON.stringify(json, null, 2), error => {
            if (error) throw error;
          });
          console.log(`Task '${name}' was removed`);
        }else{
          console.log("Task doesn't exists");
        }
      }
       
  })  
}

/**
 * Update task by id
 * @param {params} params the task id
 * @returns {void}
 */
function edit(params) {
  fs.readFile(tasksFile, function (err, data) {  
    if(data.length>0){
      var json = JSON.parse(data);
    }else{
      var json=[];
    }
    if(isNaN(params[0])){
      let id = json.length - 1;
      let oldTask = json[id];
      if(oldTask){
        let oldName =oldTask.name;
        let space = ' ';
        let newText = "";
        for(i=0;i<params.length;i++){
          if(i==params.length-1){
            space ='';
          }
          newText += params[i]+space;
        }
        json[id].name = newText.trim();
        fs.writeFileSync(tasksFile, JSON.stringify(json, null, 2), error => {
          if (error) throw error;
        });
        console.log(`Task '${oldName}' was edited to --> '${newText}'`);
      } 
    }else{
        let id = params[0]-1;
        if (id < 0 || id > json.length) {
          console.log("Task doesn't exists");
          return
        }
        if(json[id]){
          let oldName = json[id].name;
          let space = ' ';
          let newText = "";
          for(i=1;i<params.length;i++){
            if(i==params.length-1){
              space ='';
            }
            newText += params[i]+space;
          }
          json[id].name = newText.trim();
          fs.writeFileSync(tasksFile, JSON.stringify(json, null, 2), error => {
            if (error) throw error;
          });
          console.log(`Task '${oldName}' new name '${newText}'`);
        }else{
          console.log("Task doesn't exists");
        } 
  
    }
     
})

    
}
function check(params){
  changeStatus(params,true)
  }
function uncheck(params){
changeStatus(params,false)
}
/**
 * Change status of task by id
 * @param {params} params the task id
 * @returns {void}
 */
function changeStatus(params,status) {
  fs.readFile(tasksFile, function (err, data) {  
    if(data.length>0){
      var json = JSON.parse(data);
    }else{
      var json=[];
    }
    let id = params[0]-1;
    if(json[id]){
      let name = json[id].name;
      json[id].done = status;
      fs.writeFileSync(tasksFile, JSON.stringify(json, null, 2), error => {
        if (error) throw error;
      });
      if(status==true)
      console.log(`Task '${name}' was marked as done`);
      else
      console.log(`Task '${name}' was marked as pending`);
    }else{
      console.log("Task doesn't exists");
    } 
})  
}

/**
 * List of all commands
 *
 * @returns {void}
 */
function help() {
  const commandList = {
    "help": "Show available commands",
    "add": "Add a task",
    "edit": "Edit a task",
    "hello": "Display welcome message",
    "check": "Mark a task as done",
    "uncheck": "Mark a task as pending",
    "list": "List of tasks",
    "remove": "Remove a task",
    "quit": "Quit the application"
  }
  console.log('Please check the list of avilable commands: ');
  for (let arr in commandList) {
    console.log(`${arr} --> ${commandList[arr]}`);
  }
}

/**
 * List of tasks
 * @returns {void}
 */
function list() {
  fs.readFile(tasksFile, function (err, data) {  
    if(data.length>0){
      var json = JSON.parse(data);
      for(i=0;i<json.length; i++){
        if (json[i].done) {
          console.log(`${json[i].done} [✓]: ${json[i].name}`);
        }
        else {
          console.log(`${json[i].done} [x]: ${json[i].name}`);
        }
      }
    }
  else {
    console.log('Task list is empty!');
  }
})
}


/**
 * Starts the application
 * This is the function that is run when the app starts
 * 
 * It prints a welcome line, and then a line with "----",
 * then nothing.
 *  
 * @param  {string} name the name of the app
 * @returns {void}
 */
function startApp(name){
  process.stdin.resume();
  process.stdin.setEncoding('utf8');
  process.stdin.on('data', onDataReceived);
  console.log(`Welcome to ${name}'s application!`)
  console.log("--------------------")
}

/**
 * Decides what to do depending on the data that was received
 * This function receives the input sent by the user.
 * 
 * For example, if the user entered 
 * ```
 * node tasks.js batata
 * ```
 * 
 * The text received would be "batata"
 * This function  then directs to other functions
 * 
 * @param  {string} text data typed by the user
 * @returns {void}
 */
function onDataReceived(text) {
  let cmdText = text.trim();
  cmdText = cmdText.split(" ");
  const [frCmdText, ...params] = cmdText;
    switch (frCmdText) {
      case 'help':
       help();
    break;
      case 'list':
        list();
        break;
      case 'check':
        check(params);
        break;
      case 'uncheck':
        uncheck(params);
        break;
        case 'edit':
        edit(params);
        break;
      case 'add':
        add(params);
        break;
        case 'remove':
          remove(params);
        break;
        case 'quit':
          quit();
        break;
        case 'exit':
          quit();
        break;
        case 'hello':
        hello(params);
        break;
    default:
        console.log("Command doesn't exists!");
        help();
    }
}


/**
 * prints "unknown command"
 * This function is supposed to run when all other commands have failed
 *
 * @param  {string} c the text received
 * @returns {void}
 */
function unknownCommand(c){
  console.log('unknown command: "'+c.trim()+'"')
}


/**
 * Says hello
 * @param  {string} text the text typed by users
 * @returns {void}
 */
function hello(text) {
  if (text.length > 0) {
console.log("hello "+ text.trim());
  }
  else {
    console.log("hello");
  }
}


/**
 * Exits the application
 *
 * @returns {void}
 */
function quit(){
  console.log('Quitting now, goodbye!')
  process.exit();
}

// The following line starts the application
startApp("Nardine Fakhreddine")
