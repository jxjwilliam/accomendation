/**
 * Gallery image list: all property images in public/images/ (image_001.jpg … image_078.jpg).
 * Used by marquee, carousel, and scroll-trigger gallery components.
 */

const BASE = "/images";
const COUNT = 78;

/** Paths for all 78 gallery images: /images/image_001.jpg … /images/image_078.jpg */
export const GALLERY_IMAGE_PATHS: string[] = Array.from(
  { length: COUNT },
  (_, i) => `${BASE}/image_${String(i + 1).padStart(3, "0")}.jpg`
);

/** Alt text factory for accessibility (e.g. "Property photo 1"). */
export function getGalleryImageAlt(index: number): string {
  return `Property photo ${index + 1}`;
}
