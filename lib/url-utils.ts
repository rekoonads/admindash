/**
 * URL generation utilities for the CMS
 * Handles both local development and production environments
 */

/**
 * Get the base URL for the frontend website
 * @returns Base URL string
 */
export function getBaseUrl(): string {
  // Always use localhost for development
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:3000';
  }
  
  // Production fallback
  return 'https://koodos.in';
}

/**
 * Generate article URL based on category and slug
 * @param categorySlug - Category slug
 * @param articleSlug - Article slug
 * @returns Full article URL
 */
export function generateArticleUrl(categorySlug: string, articleSlug: string): string {
  const baseUrl = getBaseUrl();
  return `${baseUrl}/article/${categorySlug}/${articleSlug}`;
}

/**
 * Generate category URL
 * @param categorySlug - Category slug
 * @returns Full category URL
 */
export function generateCategoryUrl(categorySlug: string): string {
  const baseUrl = getBaseUrl();
  return `${baseUrl}/category/${categorySlug}`;
}

/**
 * Check if we're in development environment
 * @returns boolean
 */
export function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development';
}

/**
 * Check if we're in production environment
 * @returns boolean
 */
export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}

/**
 * Get environment-specific configuration
 * @returns Environment config object
 */
export function getEnvironmentConfig() {
  return {
    isDevelopment: isDevelopment(),
    isProduction: isProduction(),
    baseUrl: getBaseUrl(),
    nodeEnv: process.env.NODE_ENV || 'development'
  };
}