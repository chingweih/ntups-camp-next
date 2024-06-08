import { MetadataRoute } from 'next'
import { getPosts } from './(main)/news/page'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPosts()
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || 'https://ntupscamp.ethanhuang.me'

  const postIds =
    posts?.map((post) => {
      return {
        url: `${baseUrl}/news/${post.id}`,
        lastModified: new Date(post.created_at),
      }
    }) || []

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/bank`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/bank/transfer`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/news`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/upload`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/logout`,
      lastModified: new Date(),
    },
    ...postIds,
  ]
}
