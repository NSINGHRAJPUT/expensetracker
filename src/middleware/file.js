const cloudinary = require("cloudinary").v2;

// Upload file on cloudinary
exports.uploadOnCloudinary = async (bufferData) => {
  try {
    // Ensure Cloudinary is configured correctly
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    // Check if buffer data is available
    if (!bufferData) return null;
    // Return a promise to upload the file from buffer
    const uploadFromBuffer = (buffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { resource_type: "auto" }, // Optional: Adjust settings if needed
          (error, result) => {
            if (result) {
              resolve(result);
            } else {
              reject(error);
            }
          }
        );
        stream.end(buffer);
      });
    };

    // Upload the buffer and return the result
    const response = await uploadFromBuffer(bufferData);

    console.log("Cloudinary upload response:", response);

    return response;
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    return error;
  }
};

exports.deleteFromCloudinary = async (cloudinaryPath) => {
  try {
    // Check if file exists
    if (!cloudinaryPath) return null;

    // Delete file from cloudinary
    const response = await cloudinary.uploader.destroy(cloudinaryPath);
    console.log("cloudinary Delete File response : ", response);
    return response;
  } catch (error) {
    throw new Error(error.message || "Failed to delete file ");
  }
};
