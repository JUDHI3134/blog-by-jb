import fs from "fs"
import imagekit from "../configs/imageKit.js";
import Blog from "../models/Blog.js";

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