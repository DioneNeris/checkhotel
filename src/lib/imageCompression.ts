import imageCompression from 'browser-image-compression';

export async function compressPhoto(file: File): Promise<File> {
  const options = {
    maxSizeMB: 0.7,
    maxWidthOrHeight: 1280,
    useWebWorker: true,
  };

  try {
    const compressedFile = await imageCompression(file, options);
    return compressedFile;
  } catch (error) {
    console.error('Erro na compressão da imagem:', error);
    return file; // Retorna original se falhar
  }
}
