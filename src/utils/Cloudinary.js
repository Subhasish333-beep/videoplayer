import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY
});

const uploadOnCloudinary = async (localFilePath) => {
  // console.log("funnction start ==>", localFilePath);
  try {
    if (!localFilePath) return null
    //upload the file on cloudnary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto"
    })
    fs.unlinkSync(localFilePath)
    //file has been uploaded successfully
    // console.log("uploaded", response);
    return response;
  }
  catch (error) {
    // console.log("local path====>", error);
    fs.unlinkSync(localFilePath) //remove thhe locally saved temporry file as the upload operation failed
    return null
  }
}

//   cloudinary.v2.uploader.upload("https://upload.wikimedia.org/wikipedia/commons/a/ae/Olympic_flag.jpg",
//   { public_id: "olympic_flag" }, 
//   function(error, result) {console.log(result); });


export { uploadOnCloudinary }