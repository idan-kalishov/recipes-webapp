import axios from "axios";

const CLIENT_ID = "89e0730827f929b";

export const uploadImageToImgur = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("image", file);

  try {
    const response = await axios.post(
      "https://api.imgur.com/3/image",
      formData,
      {
        headers: {
          Authorization: `Client-ID ${CLIENT_ID}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    const imageUrl = response.data.data.link;
    return imageUrl;
  } catch (error) {
    console.error("Error uploading image to Imgur:", error);
    throw new Error("Failed to upload image.");
  }
};
