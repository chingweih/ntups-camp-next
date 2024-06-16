import { Tables } from '@/utils/database.types'
import { supabaseAdmin } from '@/utils/supabase/admin'
import { notFound } from 'next/navigation'
import PostEditForm from './PostEditor'

export default async function EditPostPage({
  params,
}: {
  params: { id: string }
}) {
  const post = await getPost(parseInt(params.id))

  if (!post) return notFound()

  return <PostEditForm post={post} />
}

async function getPost(id: number): Promise<Tables<'posts'> | null> {
  const { data, error } = await supabaseAdmin
    .from('posts')
    .select('*')
    .eq('id', id)

  if (error) return null

  return data[0]
}
