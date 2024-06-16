import { supabaseAdmin } from '@/utils/supabase/admin'
import NewsTable from './NewsTable'

export default async function NewsPage() {
  const posts = await getPosts()

  return <NewsTable posts={posts} />
}

async function getPosts() {
  const { data, error } = await supabaseAdmin
    .from('posts')
    .select('*')
    .order('order', { ascending: true })

  if (error) return null

  return data
}
