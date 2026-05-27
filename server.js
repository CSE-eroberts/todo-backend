const express = require("express"); //lib
const cors = require("cors"); //allows to go into mutiple domains 
const app = express(); //create an instance of express
app.use(cors()); //use cors

//create an array of todo items
const todos = [
    {"_id":"Buy groceries",
        "title": "Buy groceries",
        "completed": false
    }, {"_id":"Walk the dog",   
        "title": "Walk the dog",
        "completed": false
    }, {"_id":"Finish project",
        "title": "Finish project",
        "completed": false
    }, {"_id":"Clean room", 
        "title": "Clean room",
        "completed": false
    }, {"_id":"Cook dinner",
        "title": "Cook dinner",
        "completed": false
    }
];  

//get request
app.get("/api/todos", (req, res) => {
  res.json(todos);
});

const port = process.env.PORT || 3001; //set the port
app.listen(port, () => { //start the server
  console.log("Server is up and running!");
});