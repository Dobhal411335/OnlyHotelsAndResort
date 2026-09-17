"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
import { Camera } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const IMAGES_PER_SLIDE = 10;

function chunkImages(images, size) {
  const chunks = [];
  for (let i = 0; i < images.length; i += size) {
    chunks.push(images.slice(i, i + size));
  }
  return chunks;
}

function GallerySlide({ images, slideIndex, allImages }) {
  const slideImages = images.slice(0, IMAGES_PER_SLIDE);

  if (slideImages.length === 0) return null;

  return (
    <div className="relative">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5 md:gap-4">
        {slideImages.map((image, index) => (
          <div
            key={image.key || index}
            className="relative aspect-square overflow-hidden rounded-image"
          >
            <Image
              src={image.url}
              alt={`Gallery image ${slideIndex * IMAGES_PER_SLIDE + index + 1}`}
              fill
              loading="lazy"
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 20vw"
              className="object-cover"
            />
          </div>
        ))}
        {Array.from({
          length: Math.max(0, IMAGES_PER_SLIDE - slideImages.length),
        }).map((_, index) => (
          <div
            key={`placeholder-${index}`}
            className="aspect-square rounded-image bg-surface"
          />
        ))}
      </div>

      <Dialog>
        <DialogTrigger className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-button bg-heading/80 px-4 py-2 font-body text-sm text-white transition-opacity hover:bg-heading">
          <Camera className="size-4" />
          View gallery
        </DialogTrigger>
        <DialogContent className="max-h-[90vh] max-w-5xl overflow-y-auto sm:max-w-5xl">
          <DialogHeader>
            <DialogTitle className="font-heading text-2xl text-heading">
              Gallery
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
            {allImages.map((image, index) => (
              <div
                key={image.key || index}
                className="relative aspect-4/3 overflow-hidden rounded-image"
              >
                <Image
                  src={image.url}
                  alt={`Gallery detail ${index + 1}`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function HomeGallerySection() {
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await fetch("/api/gallerySection");
        const result = await res.json();
        setImages(
          result?.success && Array.isArray(result?.data?.images)
            ? result.data.images
            : []
        );
      } catch {
        setImages([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGallery();
  }, []);

  const slides = useMemo(
    () => chunkImages(images, IMAGES_PER_SLIDE),
    [images]
  );

  if (!isLoading && images.length === 0) return null;

  return (
    <section className="w-full overflow-hidden bg-surface py-10">
      <div className="mx-auto w-full max-w-7xl px-4 md:px-6">
        {isLoading ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5 md:gap-4">
            {Array.from({ length: IMAGES_PER_SLIDE }).map((_, index) => (
              <Skeleton key={index} className="aspect-square rounded-image" />
            ))}
          </div>
        ) : (
          <Carousel
            opts={{ align: "start", loop: slides.length > 1 }}
            plugins={[
              Autoplay({
                delay: 5000,
                stopOnInteraction: true,
              }),
            ]}
            className="w-full"
          >
            <CarouselContent className="ml-0">
              {slides.map((slideImages, index) => (
                <CarouselItem key={index} className="basis-full pl-0">
                  <GallerySlide
                    images={slideImages}
                    slideIndex={index}
                    allImages={images}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            {slides.length > 1 ? (
              <>
                <CarouselPrevious className="left-1 size-10 border-border bg-surface text-heading shadow-none hover:bg-background md:-left-4" />
                <CarouselNext className="right-1 size-10 border-border bg-surface text-heading shadow-none hover:bg-background md:-right-4" />
              </>
            ) : null}
          </Carousel>
        )}
      </div>
    </section>
  );
}
