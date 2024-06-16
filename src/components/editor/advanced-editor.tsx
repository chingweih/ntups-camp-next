'use client'
import React, { useEffect, useState } from 'react'
import {
  EditorRoot,
  EditorCommand,
  EditorCommandItem,
  EditorCommandEmpty,
  EditorContent,
  type JSONContent,
  EditorCommandList,
  EditorBubble,
} from 'novel'
import { ImageResizer, handleCommandNavigation } from 'novel/extensions'
import { defaultExtensions } from './extensions'
import { NodeSelector } from './selectors/node-selector'
import { LinkSelector } from './selectors/link-selector'
import { ColorSelector } from './selectors/color-selector'

import { TextButtons } from './selectors/text-buttons'
import { slashCommand, suggestionItems } from './slash-command'
import { handleImageDrop, handleImagePaste } from 'novel/plugins'
import { uploadFn } from './image-upload'
import { Separator } from '../ui/separator'

import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Heading from '@tiptap/extension-heading'
import Image from '@tiptap/extension-image'

import { postStyles } from '@/app/(user)/(main)/news/[id]/post-styles'
import { mergeAttributes } from '@tiptap/core'
import { cn } from '@/lib/utils'

const extensions = [
  ...defaultExtensions,
  slashCommand,
  Document,
  Image,
  Paragraph.configure({ HTMLAttributes: { class: postStyles.p } }),
  Heading.configure({
    levels: [1, 2, 3, 4],
  }).extend({
    levels: [1, 2, 3, 4],
    renderHTML({ node, HTMLAttributes }) {
      const level: 1 | 2 | 3 | 4 = this.options.levels.includes(
        node.attrs.level,
      )
        ? node.attrs.level
        : this.options.levels[0]
      const classes: {
        1: string
        2: string
        3: string
        4: string
      } = {
        1: postStyles.h1,
        2: postStyles.h2,
        3: postStyles.h3,
        4: postStyles.h4,
      }
      return [
        `h${level}`,
        mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
          class: `${classes[level]}`,
        }),
        0,
      ]
    },
  }),
]

interface EditorProp {
  initialValue?: JSONContent
  onChange: (value: JSONContent) => void
  className?: string
}
const Editor = ({ initialValue, onChange, className }: EditorProp) => {
  const [openNode, setOpenNode] = useState(false)
  const [openColor, setOpenColor] = useState(false)
  const [openLink, setOpenLink] = useState(false)

  return (
    <EditorRoot>
      <EditorContent
        className={cn('rounded-xl border p-4', className)}
        {...(initialValue && { initialContent: initialValue })}
        extensions={extensions}
        editorProps={{
          handleDOMEvents: {
            keydown: (_view, event) => handleCommandNavigation(event),
          },
          handlePaste: (view, event) => handleImagePaste(view, event, uploadFn),
          handleDrop: (view, event, _slice, moved) =>
            handleImageDrop(view, event, moved, uploadFn),
          attributes: {
            class: `prose prose-lg dark:prose-invert prose-headings:font-title font-default focus:outline-none max-w-full`,
          },
        }}
        onUpdate={({ editor }) => {
          onChange(editor.getJSON())
        }}
        slotAfter={<ImageResizer />}
      >
        <EditorCommand className='z-50 h-auto max-h-[330px] overflow-y-auto rounded-md border border-muted bg-background px-1 py-2 shadow-md transition-all'>
          <EditorCommandEmpty className='px-2 text-muted-foreground'>
            No results
          </EditorCommandEmpty>
          <EditorCommandList>
            {suggestionItems.map((item) => (
              <EditorCommandItem
                value={item.title}
                onCommand={(val) => item.command?.(val)}
                className={`flex w-full items-center space-x-2 rounded-md px-2 py-1 text-left text-sm hover:bg-accent aria-selected:bg-accent`}
                key={item.title}
              >
                <div className='flex h-10 w-10 items-center justify-center rounded-md border border-muted bg-background'>
                  {item.icon}
                </div>
                <div>
                  <p className='font-medium'>{item.title}</p>
                  <p className='text-xs text-muted-foreground'>
                    {item.description}
                  </p>
                </div>
              </EditorCommandItem>
            ))}
          </EditorCommandList>
        </EditorCommand>

        <EditorBubble
          tippyOptions={{
            placement: 'top',
          }}
          className='flex w-fit max-w-[90vw] overflow-hidden rounded-md border border-muted bg-background shadow-xl'
        >
          <Separator orientation='vertical' />
          <NodeSelector open={openNode} onOpenChange={setOpenNode} />
          <Separator orientation='vertical' />

          <LinkSelector open={openLink} onOpenChange={setOpenLink} />
          <Separator orientation='vertical' />
          <TextButtons />
          <Separator orientation='vertical' />
          <ColorSelector open={openColor} onOpenChange={setOpenColor} />
        </EditorBubble>
      </EditorContent>
    </EditorRoot>
  )
}

export default Editor
