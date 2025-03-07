// lib/rateLimiter.ts
import { RateLimiterMemory } from "rate-limiter-flexible";

export const rateLimiter = new RateLimiterMemory({
  points: 10, // maksymalnie 10 żądań
  duration: 60, // w ciągu 60 sekund
});
