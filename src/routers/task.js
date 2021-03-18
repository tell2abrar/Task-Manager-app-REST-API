const Task = require("../models/task");
const express = require("express");
const User = require("../models/user");
const auth = require("../middlewares/auth");
const router = new express.Router();


router.post("/tasks",auth,async (req,res)=>{
    const task = new Task({
        ...req.body,
        owner:req.user._id
    });
    try{
        await task.save();
        res.status(201).send(task);
    }catch(e){
        res.status(500).send(e);
    }
});

// GET /tasks?completed=true||false
// GET /tasks?limit=2
router.get('/tasks',auth,async (req,res)=>{
    const match ={};
    const sort ={};

    if(req.query.completed){
        match.completed = req.query.completed == 'true';
    }
    if(req.query.sortBy){
        const sortBy = req.query.sortBy.split('_');
        sort[sortBy[0]] = sortBy[1] === 'desc'?1:-1; 
    }
    try{
        //const tasks = await Task.find({owner:req.user._id,completed:req.query.completed});
        const tasks = await req.user.populate({path:'tasks',match,
        options:{
            limit:parseInt(req.query.limit),
            skip:parseInt(req.query.skip),
            sort
        }
        }).execPopulate();
        if(!tasks){
            return res.status(404).send();
        }
        res.send(tasks.tasks);
    }catch(e){
        res.status(500).send();
    }

       
});


router.get('/tasks/:id',auth,async (req,res)=>{

    const _id = req.params.id;
    try{
        const task = await Task.findOne({_id,owner:req.user._id}).populate('owner');
        if(!task){
            return res.status(404).send();
        }
        res.send(task);
    }catch(e){
        res.status(500).send();
    }
});


router.patch('/tasks/:id',auth,async (req,res)=>{

    const updates = Object.keys(req.body);
    const validUpdates = ['description','completed'];
    const isValidUpdate = updates.every(update=>validUpdates.includes(update));

    if(!isValidUpdate){
        return res.status(400).send();
    }

    try{
        //const task = await Task.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true});
        const task = await Task.findOne({_id:req.params.id,owner:req.user._id}).populate('owner');
        if(!task){
            return res.status(404).send();
        }
        updates.forEach(update=>task[update]=req.body[update]);
        await task.save();
        res.send(task)
    }catch(e){
        res.status(400).send(e);
    }

});

router.delete('/tasks/:id',auth,async (req,res)=>{

    try{
        const task = await Task.findOneAndDelete({_id:req.params.id,owner:req.user._id}).populate('owner');
        if(!task){
           return  res.status(404).send();
        }
        res.send(task);
    }catch(e){
        res.send(500).send();
    }

});

module.exports = router;