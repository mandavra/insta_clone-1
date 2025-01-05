import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config({});

cloudinary.config({
    cloud_name: "dpeborm0u",
    api_key: "919385826969783",
    api_secret: "iDfb0J4yFRAM243U1cKcWND40l4"
});
export default cloudinary;