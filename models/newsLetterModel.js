import mongoose from 'mongoose'

const newsSchema  = mongoose.Schema(
    {
      email:{
          type: String,
          required: true,
      }  
    }
)

const NewsLetter = mongoose.model("NewsLetter",newsSchema)

export default NewsLetter;