import fs from "fs"
import imagekit from "../configs/imageKit.js";
import Blog from "../models/Blog.js";
import Comment from "../models/Comment.js";

export const addBlog = async (req, res) => {
    try {
        const { title, subTitle, description, category, isPublished } = JSON.parse(req.body.blog);
        const imageFile = req.file;

        //check if all file are present
        if (!title || !description || !category || !imageFile) {
            return res.json({success: false, message:"Missing required fields"})
        }

        //upload image to imagekit
        const fileBuffer = fs.readFileSync(imageFile.path)
        const response = await imagekit.upload({
            file: fileBuffer,
            fileName: imageFile.originalname,
            folder: "/blogs"
        })

        //optimization through imagekit URL transformation
        const optimizedImageUrl = imagekit.url({
            path: response.filePath,
            transformation: [
                { quality: 'auto' }, //auto compression
                { format: 'webp' },  //convert to modern format
                {width: '1280'}      //width resizing
            ]
        })

        const image = optimizedImageUrl;

        await Blog.create({ title, subTitle, description, category, image, isPublished })
        
        res.json({success: true, message:"Blog Added Successfully"})

    } catch (error) {
        res.json({success: false, message: error.message})
    }
}

//get all blogs
export const getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find({ isPublished: true }) 
        res.json({success: true, blogs})
    } catch (error) {
        res.json({success: false, message: error.message})
    }
}

//get indivisual blog data
export const getBlogById = async (req, res) => {
    try {
        const {blogId} = req.params;
        const blog = await Blog.findById(blogId);
        if (!blog) {
            return res.json({success: false, message: "Blog not found"})
        }
        res.json({success: true, blog})
    } catch (error) {
       res.json({success: false, message: error.message}) 
    }
}

//delete blog data by id
export const deleetBlogById = async (req, res) => {
    try {
        const {id} = req.body;
        await Blog.findByIdAndDelete(id)

        //delete all comment associated with this blog
        await Comment.deleteMany({blog: id})

        res.json({success: true, message: "Blog deleted successfully"})
    } catch (error) {
       res.json({success: false, message: error.message}) 
    }
}

//function for publish or unpublish blog
export const togglePublish = async (req, res) => {
    try {
        const { id } = req.body;
        const blog = await Blog.findById(id)
        blog.isPublished = !blog.isPublished
        await blog.save()
        res.json({success: true, message:"Blog Status Update"})
    } catch (error) {
       res.json({success: false, message: error.message}) 
    }
}

//add comment
export const addComment = async (req, res) => {
    try {
        const { blog, name, content } = req.body;
        await Comment.create({ blog, name, content })
        res.json({success: true, message: "Comment added for review"})
    } catch (error) {
        res.json({success: false, message: error.message})
    }
}

//get comment data for indivisual blog
export const getBlogComments = async (req, res) => {
    try {
        const { blogId } = req.body; 
        const comments = await Comment.find({ blog: blogId, isApproved: true }).sort({ createdAt: -1 })
         res.json({success: true, comments})
    } catch (error) {
        res.json({success: false, message: error.message})
    }
}