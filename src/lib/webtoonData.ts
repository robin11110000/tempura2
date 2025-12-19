import { Manga, FeaturedMangaData } from "./types";
import manga1 from "@/assets/manga-1.jpg";
import manga2 from "@/assets/manga-2.jpg";
import manga3 from "@/assets/manga-3.jpg";
import manga4 from "@/assets/manga-4.jpg";
import manga5 from "@/assets/manga-5.jpg";
import manga6 from "@/assets/manga-6.jpg";
import manga7 from "@/assets/manga-7.jpg";
import manga8 from "@/assets/manga-8.jpg";
import manga9 from "@/assets/manga-9.jpg";
import featuredImage from "@/assets/featured-manga.jpg";

export async function fetchRecommendedManga(): Promise<Manga[]> {
  // Simulate an API call
  return new Promise((resolve) =>
    setTimeout(() => {
      resolve([
        {
          id: 1,
          image: manga1,
          title: "My lucky star",
          genre: "Romance",
        },
        {
          id: 2,
          image: manga2,
          title: "Only you",
          genre: "Drama",
        },
        {
          id: 3,
          image: manga3,
          title: "That day in the park",
          genre: "Fantasy",
        },
        {
          id: 4,
          image: manga4,
          title: "It may be love",
          genre: "Romance",
        },
        {
          id: 5,
          image: manga5,
          title: "I don't care anymore",
          genre: "Drama",
        },
        {
          id: 6,
          image: manga6,
          title: "Destiny",
          genre: "Fantasy",
        },
        {
          id: 7,
          image: manga7,
          title: "My love",
          genre: "Romance",
        },
        {
          id: 8,
          image: manga8,
          title: "Who are you",
          genre: "Mystery",
        },
        {
          id: 9,
          image: manga9,
          title: "Little flower",
          genre: "Romance",
        },
      ]);
    }, 500)
  );
}

export async function fetchFeaturedManga(): Promise<FeaturedMangaData> {
  return new Promise((resolve) =>
    setTimeout(() => {
      resolve({
        image: featuredImage,
        title: "Buscando a Camelia",
        chapter: "Chapter 12",
      });
    }, 300)
  );
}
