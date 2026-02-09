/**
 * Gallery image list: all property images in public/images/ (image_001.jpg … image_078.jpg).
 * Curated first-class (hero) and second-class (box card / gallery) lists use specific image numbers.
 */

const BASE = "/images";
const COUNT = 78;

/** Image number to path helper (e.g. 46 → "/images/image_046.jpg"). */
function imagePath(num: number): string {
  return `${BASE}/image_${String(num).padStart(3, "0")}.jpg`;
}

/** First-class: hero section carousel, in display order. */
const HERO_IMAGE_NUMBERS = [46, 40, 19, 4, 7] as const;

/** Second-class: box card / gallery section (marquee + carousel), in display order. */
const CARD_IMAGE_NUMBERS = [1, 2, 42, 13, 68, 61, 77, 66] as const;

/** Hero carousel images (first-class). */
export const HERO_IMAGE_PATHS: string[] = HERO_IMAGE_NUMBERS.map(imagePath);

/** Gallery / box card images (second-class) for marquee and carousel. */
export const CARD_IMAGE_PATHS: string[] = CARD_IMAGE_NUMBERS.map(imagePath);

/** Paths for all 78 gallery images: /images/image_001.jpg … /images/image_078.jpg */
export const GALLERY_IMAGE_PATHS: string[] = Array.from(
  { length: COUNT },
  (_, i) => imagePath(i + 1)
);

/** Alt text for hero/gallery by index (e.g. "Property photo 1"). */
export function getGalleryImageAlt(index: number): string {
  return `Property photo ${index + 1}`;
}

/** Alt text for card/gallery curated list by index. */
export function getCardImageAlt(index: number): string {
  return `Property photo ${index + 1}`;
}
