'use server'
import 'server-only'

import { TablesInsert, TablesUpdate } from '@/utils/database.types'
import { supabaseAdmin } from '@/utils/supabase/admin'
import { generateHTML } from '@tiptap/html'
import { revalidatePath } from 'next/cache'

import { JSONContent } from 'novel'
import { customExtensions } from './tiptap-extensions'

export async function deletePost(id: number) {
  const { error } = await supabaseAdmin.from('posts').delete().eq('id', id)

  revalidatePath('/admin/news')
  return error
}

export async function fetchAndUploadImage(src: string) {
  const res = await fetch(src)
  const blob = await res.blob()

  const { data, error } = await supabaseAdmin.storage
    .from('assets')
    .upload(`image-${Date.now()}`, blob)

  if (error) {
    console.error(error)
    return null
  }

  const url = supabaseAdmin.storage.from('assets').getPublicUrl(data.path)

  return url.data.publicUrl
}

export async function updatePost(
  id: number,
  metadata: TablesUpdate<'posts'>,
  postContents: string,
) {
  const postJson: JSONContent = JSON.parse(postContents)

  const parsedContents = await Promise.all<Promise<JSONContent>>(
    postJson.content?.map(async (content) => {
      if (content.type === 'image') {
        if (content.attrs?.src?.startsWith(process.env.SUPABASE_URL)) {
          return content
        }

        const url = content.attrs?.src
        const publicUrl = await fetchAndUploadImage(url)
        return {
          ...content,
          attrs: {
            ...content.attrs,
            src: publicUrl,
          },
        }
      } else {
        return content
      }
    }) ?? [],
  )

  if (parsedContents.length !== 0) {
    postJson.content = parsedContents
  }

  const html = generateHTML(postJson, customExtensions)

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
  const { data: ogOrder, error: dbError } = await supabaseAdmin
    .from('posts')
    .select('order')
    .order('order', { ascending: false })
    .limit(1)

  if (dbError) {
    console.error(dbError)
    return { error: dbError.message }
  }

  data.order = ogOrder?.[0]?.order ? ogOrder[0].order * 2 : 10000

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

export async function updatePostOrder(postId: number, newIndex: number) {
  const { data, error } = await supabaseAdmin
    .from('posts')
    .select('id, order')
    .order('order', { ascending: true })

  if (error) {
    console.error(error)
    return error.message
  }

  if (data[newIndex]?.id === postId) return

  const newOrderBefore = newIndex == 0 ? 0 : data[newIndex - 1]?.order
  const newOrderAfter = newIndex == data.length - 1 ? 0 : data[newIndex]?.order

  let newOrder = 0

  if (newOrderBefore === 0) {
    newOrder = newOrderAfter! / 2
  } else if (newOrderAfter === 0) {
    newOrder = newOrderBefore! * 2
  } else {
    newOrder = (newOrderBefore! + newOrderAfter!) / 2
  }

  const { error: updateError } = await supabaseAdmin
    .from('posts')
    .update({ order: newOrder })
    .eq('id', postId)

  if (updateError) {
    console.error(updateError)
    return updateError.message
  }

  revalidatePath('/admin/news')
}
