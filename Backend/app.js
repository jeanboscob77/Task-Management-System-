const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')

const Tasks = new mongoose.Schema({
    task: {type: String},
    completed: {type: Boolean,required: true}
},{timestamps: true})


const Task = mongoose.model('Task',Tasks)

mongoose.connect('mongodb://localhost:27017/Tasks')

const app = express()

app.use(express.json())
app.use(cors())
app.get('/api/tasks',async(req,res)=>{
    try {
        const tasks = await Task.find()
        if(tasks){
            res.json(tasks)
        }
    } catch (error) {
        console.log(error.message);
        
    }
})


app.post('/api/tasks',async(req,res)=>{
    try {
        const {task,completed} = req.body
        const newTask = new Task({task,completed})
        const saved = await  newTask.save()
        if(saved){
            res.json({message: 'created'})
        }
    } catch (error) {
        console.log(error.message);
        
    }
})

app.delete('/api/tasks/:id',async(req,res)=>{
    const {id} = req.params
    try {
        const removed = await Task.findByIdAndDelete(id)
        res.json({message: 'deleted'})
    } catch (error) {
        console.log(error.message);
        
    }
})

app.put('/api/tasks/:id',async(req,res)=>{
    const {id} = req.params
    try {
        const newData = req.body
        const updated = await Task.findByIdAndUpdate(id,newData,{new:true})
        res.json({message: updated})
    } catch (error) {
        console.log(error.message);
        
    }
})

app.listen(5000,console.log('hello')
)