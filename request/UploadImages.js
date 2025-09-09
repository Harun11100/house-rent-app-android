import axios from "axios";

export const uploadImages = async (images) => {
  try {
    const formData = new FormData();

    images.forEach((img, index) => {
      formData.append("file", {
        uri: img.uri,
        type: img.mimeType || "image/jpeg",
        name: img.fileName || `image_${index}.jpg`,
      });
    });

    formData.append("path", "rooms"); // optional Cloudinary folder

    const response = await axios.post(
      "https://ptoja-update.vercel.app/api/cloudinary",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 60000, // prevent timeout
      }
    );

    if (!response?.data || !Array.isArray(response.data.urls)) {
      throw new Error("No Images returned from server");
    }

    return response.data.urls;
  } catch (err) {
    console.error("Images upload failed:", err.response?.data || err.message);
    throw err;
  }
};
