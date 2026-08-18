import imageCompression from 'browser-image-compression';

export async function compressImage(file: File, maxWidth: number = 1280, quality: number = 0.8): Promise<File> {
  const options = {
    maxSizeMB: 0.3,
    maxWidthOrHeight: maxWidth,
    useWebWorker: true,
    initialQuality: quality,
    fileType: file.type === "image/png" ? "image/png" : "image/jpeg",
  };

  try {
    const compressedFile = await imageCompression(file, options);
    // En caso de que browser-image-compression devuelva un Blob en vez de File en versiones antiguas,
    // nos aseguramos de que sea un File.
    return new File([compressedFile], file.name.replace(/\.[^/.]+$/, "") + (options.fileType === "image/jpeg" ? ".jpg" : ".png"), {
      type: options.fileType,
      lastModified: Date.now(),
    });
  } catch (error) {
    console.error("Error compressing image:", error);
    throw error;
  }
}
