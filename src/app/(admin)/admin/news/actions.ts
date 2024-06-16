'use server'
import 'server-only'

import { TablesInsert, TablesUpdate } from '@/utils/database.types'
import { supabaseAdmin } from '@/utils/supabase/admin'
import { generateHTML } from '@tiptap/html'
import { revalidatePath } from 'next/cache'

import Bold from '@tiptap/extension-bold'
import CodeBlock from '@tiptap/extension-code-block'
import Document from '@tiptap/extension-document'
import Heading from '@tiptap/extension-heading'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import Image from '@tiptap/extension-image'

export async function deletePost(id: number) {
  const { error } = await supabaseAdmin.from('posts').delete().eq('id', id)

  revalidatePath('/admin/news')
  return error
}

export async function updatePost(
  id: number,
  metadata: TablesUpdate<'posts'>,
  postContents: string,
) {
  const html = generateHTML(JSON.parse(postContents), [
    Document,
    Paragraph,
    Text,
    CodeBlock,
    Heading,
    Bold,
    Image,
  ])

  const { error } = await supabaseAdmin
    .from('posts')
    .update({
      contents: html,
      ...metadata,
    })
    .eq('id', id)

  if (error) {
    console.error(error)
    return error.message
  }

  revalidatePath('/admin/news')
  revalidatePath(`/admin/news/edit/${id}`)
}

export async function newPost(data: TablesInsert<'posts'>) {
  const { data: id, error } = await supabaseAdmin
    .from('posts')
    .insert(data)
    .select('id')

  if (error || !id || id.length === 0) {
    console.error(error)
    return { error: error?.message }
  }

  revalidatePath('/admin/news')
  revalidatePath(`/admin/news/edit/${id[0].id}`)
  return { id: id[0].id }
}
