import { useSupabaseClient } from '#imports'

export function useUpload() {
  const supabase = useSupabaseClient()

  /**
   * Uploads a file to the given bucket and folder, returns the public URL
   * @param file File to upload
   * @param bucket Storage bucket name (e.g. 'blog-images')
   * @param folder Optional folder path inside bucket (e.g. user id or 'static_pages')
   */
  async function uploadFile(
    file: File,
    bucket: string,
    folder?: string
  ): Promise<string> {
    const fileExt = file.name.split('.').pop()
    const timestamp = Date.now()
    // build filename like "folder/timestamp.ext" or "timestamp.ext" if no folder
    const fileName = folder
      ? `${folder}/${timestamp}.${fileExt}`
      : `${timestamp}.${fileExt}`

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(fileName, file)

    if (uploadError) {
      throw uploadError
    }

    const { data: { publicUrl }, error: urlError } = supabase.storage
      .from(bucket)
      .getPublicUrl(uploadData.path)

    if (urlError) {
      throw urlError
    }

    return publicUrl
  }


  async function deleteFile(image_url: string, folder?: string) {
    const urlParts = image_url.split('/')
    const fileName = urlParts[urlParts.length - 1]
    const oldPath = `${folder}/${fileName}`
    await supabase.storage.from('uploads').remove([oldPath])

  }

  return { uploadFile, deleteFile }
}