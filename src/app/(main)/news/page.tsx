import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { createClient } from '@/utils/supabase/server'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default async function NewsPage() {
  const posts = await getPosts()

  return <PostList posts={posts} />
}

export async function getPosts(limit?: number) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .limit(limit || 100) // default limit to 100

  if (error) {
    console.error(error)
    return null
  }

  return data
}

export function PostList({ posts }: { posts: any[] | null }) {
  if (!posts) {
    return <p className='text-center'>目前還沒有新聞哦！</p>
  }

  return (
    <>
      {posts.map((post) => {
        return (
          <div key={post.id} className='p-4 mb-4'>
            <Link
              href={`/news/${post.id}`}
              className='flex flex-row items-center mb-3 gap-2'
            >
              <Badge>新聞</Badge>
              <Button variant='link' className='p-0'>
                <h2 className='text-xl font-bold'>{post.title}</h2>
              </Button>
              <ArrowRight size={22} />
            </Link>
            <p className='text-gray-500 pl-5'>{post.description}</p>
          </div>
        )
      })}
    </>
  )
}
