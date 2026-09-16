/** Convierte un link de YouTube o Vimeo (o uno ya en formato embed) a la URL que se puede usar en un <iframe>. */
export function obtenerEmbedVideo(url: string): string {
  const valor = url.trim();
  const youtube = valor.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/);
  if (youtube) return `https://www.youtube.com/embed/${youtube[1]}`;
  const vimeo = valor.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`;
  return valor;
}
