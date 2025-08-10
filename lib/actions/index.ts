export * from '../actions'

// Legacy exports for compatibility
export const getBanners = () => []
export const getPostBySlug = (slug: string) => null
export const incrementPostViews = (id: string) => Promise.resolve()
export const getPublishedPosts = () => []