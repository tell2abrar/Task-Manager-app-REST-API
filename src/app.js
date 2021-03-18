require("./db/mongoose");
const express = require("express");
const userRouter = require("./routers/user.js");
const taskRouter = require("./routers/task.js");

const app = express();

//Setting up a express middleware 
// app.use((req,res,next)=>{
//     res.status(503).send("site is under maintaince try soon...");
// })

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

const port = process.env.PORT;



app.listen(port,()=>{
    console.log('server is listening on port: ' + port);
});









