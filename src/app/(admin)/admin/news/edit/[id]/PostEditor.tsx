'use client'

import Editor from '@/components/editor/advanced-editor'
import { Tables } from '@/utils/database.types'
import { JSONContent } from 'novel'
import { useState } from 'react'

import { generateJSON } from '@tiptap/html'

import SubmitBtn from '@/app/_components/SubmitBtn'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import CodeBlock from '@tiptap/extension-code-block'
import Document from '@tiptap/extension-document'
import Heading from '@tiptap/extension-heading'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import { toast } from 'sonner'
import { updatePost } from '../../actions'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeftFromLine } from 'lucide-react'

export default function PostEditForm({ post }: { post: Tables<'posts'> }) {
  const [content, setContent] = useState<JSONContent>(
    generateJSON(post.contents, [
      Document,
      Paragraph,
      Text,
      CodeBlock,
      Heading,
    ]),
  )
  const router = useRouter()

  return (
    <form
      className='grid w-full grid-cols-6 items-center gap-6'
      action={(formData: FormData) => {
        updatePost(
          post.id,
          {
            tag: formData.get('tag') as string,
            title: formData.get('title') as string,
            description: formData.get('description') as string,
          },
          JSON.stringify(content),
        ).then((error) => {
          if (error) {
            toast.error(`更新失敗｜${error}`)
          } else {
            toast.success('文章更新成功')
            router.push('/admin/news')
          }
        })
      }}
    >
      <h2 className='col-span-5 text-xl font-bold'>
        <Button asChild variant='secondary' className='mr-5'>
          <Link href='/admin/news'>
            <ArrowLeftFromLine size={18} />
          </Link>
        </Button>
        編輯文章
      </h2>
      <SubmitBtn className='col-span-1' name='儲存並返回' />
      <Label className='col-span-2 text-lg'>標籤</Label>
      <Input
        className='col-span-4'
        type='text'
        name='tag'
        defaultValue={post.tag || ''}
      />
      <Label className='col-span-2 text-lg'>標題</Label>
      <Input
        className='col-span-4'
        type='text'
        name='title'
        defaultValue={post.title || ''}
      />
      <Label className='col-span-2 text-lg'>敘述</Label>
      <Textarea
        className='col-span-4'
        name='description'
        defaultValue={post.description || ''}
      />
      <Label className='col-span-3 text-lg'>文章內容</Label>
      <p className='col-span-3 text-slate-500'>
        輸入斜線可跳出樣式選單（Notion 形式）
      </p>
      <Editor
        className='col-span-6'
        onChange={setContent}
        initialValue={content}
      />
    </form>
  )
}
