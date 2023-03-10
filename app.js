const express = require("express");
const bodyParser = require("body-parser");
const _ = require("lodash")
const ejs = require("ejs");
const mongoose = require("mongoose")

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.set('strictQuery', false)
mongoose.connect("mongodb+srv://Mehul-Kumar-Dhusia:Test123@cluster0.iatihjz.mongodb.net/blogDB")
// mongoose.connect("mongodb://localhost:27017/blogDB")

const postSchema = {
  postTitle : String ,
  postBody : String
}

const postCollection = new mongoose.model("postCollection" , postSchema)

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

app.get("/" , function(req ,res){
  postCollection.find({} , function(err,data){
    if(!err){
      res.render("index" , {homedata : homeStartingContent , posts : data})
    }
  })
})

// app.get("/about" , function(req,res){
//   res.render("about" , {about : aboutContent})
// })

// app.get("/contact" , function(req,res){
//   res.render("contact" , {contact : contactContent})
// })

// app.get("/compose" , function(req,res){
//   res.render("compose")
// })

app.get("/posts/:topic" , function(req , res){
  const requestTopic = _.lowerCase(req.params.topic)
  var flag = false ;
  postCollection.find({} , function(err ,data){
    if(!err){
      for(let i = 0 ; i < data.length ; i++){
        let titleWeHave = _.lowerCase(data[i].postTitle)
        if(titleWeHave === requestTopic){
          flag = true 
          res.render("post" , {title : data[i].postTitle , data : data[i].postBody})
        }
      }
      if(flag === false){
        res.render("post" , {title : "Failure" , data : "No such post is there"})
      }
    }
  })
})

// app.post("/compose" , function(req , res){
//   const newPost = new postCollection({
//     postTitle : req.body.postTitle , 
//     postBody : req.body.postBody
//   })
//   newPost.save()
//   res.redirect("/")
// })

app.post("/delete" , function(req , res){
  let value = req.body.btn 
  postCollection.deleteOne({postTitle : value} , function(err){
    if(!err){
      console.log("Successfully deleted")
    }
  })
  res.redirect("/")
})

app.listen(process.env.PORT || 3000, function() {
  console.log("Server started on port 3000");
});
