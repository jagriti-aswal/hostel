import supabase from "../config/supabase.js";

export const uploadImage = async (req, res) => {
  try {
    const file = req.file;

    const fileName = Date.now() + "-" + file.originalname;

    const { data, error } = await supabase.storage
      .from("images")
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
      });

    if (error) throw error;

    const { data: publicUrl } = supabase.storage
      .from("images")
      .getPublicUrl(fileName);

    res.json({
      imageUrl: publicUrl.publicUrl,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Upload failed" });
  }
};