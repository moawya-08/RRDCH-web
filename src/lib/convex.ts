import { ConvexReactClient } from 'convex/react'

const convexUrl = import.meta.env.VITE_CONVEX_URL || 'https://rightful-elephant-126.convex.cloud'

export const convex = new ConvexReactClient(convexUrl)
