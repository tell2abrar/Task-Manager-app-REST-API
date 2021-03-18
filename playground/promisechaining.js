require("../src/db/mongoose");
const Task = require("../src/models/task");

// Task.findByIdAndDelete("604876f5383240163847a30a").then(task=>{
//     console.log(task);
//     return Task.countDocuments({completed:"false"});
// }).then(result=>{
//     console.log(result);
// }).catch(error=>console.log(error));

async function deleteTaskAndCount(_id){
    const task = await Task.findByIdAndDelete(_id);
    console.log(task);
    const count = await Task.countDocuments({completed:true});
    return count;
    
}
deleteTaskAndCount("6049d2c812d75081085629e3").then(result=>console.log(result)).catch(error=>console.log(error));