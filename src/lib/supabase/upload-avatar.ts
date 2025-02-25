import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

// Use the environment variable with fallback
const STORAGE_BUCKET =
  process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET || "avatars";
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
];

/**
 * Uploads an avatar image to Supabase storage and returns the public URL
 * @param file The avatar file to upload
 * @param userId The user ID to associate with the avatar
 * @returns The public URL of the uploaded avatar
 */
export async function uploadAvatar(
  file: File,
  userId: string
): Promise<string> {
  try {
    // Validate file before upload
    if (!file) {
      throw new Error("No file provided");
    }

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      throw new Error(
        `Invalid file type: ${file.type}. Please upload a JPEG, PNG or GIF image.`
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      throw new Error(
        `File size too large: ${file.size} bytes. Maximum size is ${MAX_FILE_SIZE} bytes.`
      );
    }

    console.log("Creating Supabase client...");
    console.log(`Using storage bucket: ${STORAGE_BUCKET}`);
    const supabase = createClientComponentClient();

    if (!supabase || !supabase.storage) {
      throw new Error("Failed to initialize Supabase client");
    }

    // Generate a unique file name
    const fileExt = file.name.split(".").pop();
    const fileName = `${userId}-${Date.now()}.${fileExt}`;

    console.log(
      `Uploading avatar for user ${userId} with filename ${fileName}`
    );
    console.log(`File type: ${file.type}, size: ${file.size} bytes`);

    // Skip bucket check and directly try to upload
    // Upload the file to the specified bucket
    console.log(`Uploading to bucket: ${STORAGE_BUCKET}`);
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: true,
      });

    if (error) {
      console.error("Supabase storage upload error:", error);

      // If the error is about the bucket not existing, provide a helpful message
      if (
        error.message.includes("bucket") ||
        error.message.includes("not found")
      ) {
        throw new Error(
          `Storage bucket "${STORAGE_BUCKET}" not found. Please create this bucket in your Supabase dashboard.`
        );
      }

      throw new Error(`Failed to upload avatar: ${error.message}`);
    }

    console.log("Upload successful, getting public URL...");

    // Get the public URL
    const { data: urlData } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(fileName);

    if (!urlData || !urlData.publicUrl) {
      throw new Error("Failed to get public URL for uploaded avatar");
    }

    console.log(`Avatar uploaded successfully: ${urlData.publicUrl}`);
    return urlData.publicUrl;
  } catch (error) {
    console.error("Error in uploadAvatar function:", error);

    // Fallback to default avatar if upload fails
    return "/images/default-avatar.png";
  }
}
