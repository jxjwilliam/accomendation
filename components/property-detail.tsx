import Image from "next/image";
import type { BookingChannel, Property } from "@/lib/types";
import { BookingLinks } from "@/components/booking-links";

interface PropertyDetailProps {
  property: Property;
  bookingChannels?: BookingChannel[];
}

/**
 * Property description, amenities, and photo gallery (FR-002).
 */
export function PropertyDetail({ property, bookingChannels }: PropertyDetailProps) {
  return (
    <article className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">{property.name}</h1>
        <p className="mt-1 text-muted-foreground">
          {property.location.city}, {property.location.region}, {property.location.country}
        </p>
        <p className="mt-1 text-sm">{property.typeOfAccommodation}</p>
      </div>
      {property.description && (
        <section aria-label="Description">
          <p className="text-base">{property.description}</p>
        </section>
      )}
      {property.amenities?.length > 0 && (
        <section aria-label="Amenities">
          <h2 className="text-lg font-semibold">Amenities</h2>
          <ul className="mt-2 list-disc pl-6">
            {property.amenities.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ul>
        </section>
      )}
      {property.photos?.length > 0 && (
        <section aria-label="Photos">
          <h2 className="text-lg font-semibold">Photos</h2>
          <ul className="mt-2 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {property.photos.map((src, i) => (
              <li key={i}>
                <Image
                  src={src}
                  alt=""
                  width={400}
                  height={256}
                  className="h-48 w-full rounded-lg object-cover"
                  priority={i === 0}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </li>
            ))}
          </ul>
        </section>
      )}
      {bookingChannels?.length ? (
        <section aria-label="Book or contact">
          <BookingLinks channels={bookingChannels} />
        </section>
      ) : null}
    </article>
  );
}
