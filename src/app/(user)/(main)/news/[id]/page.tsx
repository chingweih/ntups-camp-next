import parse, {
  domToReact,
  attributesToProps,
  Element,
  HTMLReactParserOptions,
  DOMNode,
} from 'html-react-parser'
import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { Url } from 'next/dist/shared/lib/router/router'
import { colors } from '@/lib/custom-colors'
import Image from 'next/image'
import { shimmerPlaceholder } from '@/lib/image-placeholder'
import { Metadata, ResolvingMetadata } from 'next'
import { postStyles } from './post-styles'

const options: HTMLReactParserOptions = {
  replace: (domNode) => {
    const typedDomNode = domNode as Element

    if (typedDomNode.attribs && typedDomNode.name === 'a') {
      const props = attributesToProps(typedDomNode.attribs)
      return (
        <Link
          href={props.href as Url}
          {...props}
          className={postStyles.a.className}
          style={{ color: postStyles.a.color }}
          target='_blank'
        >
          {typedDomNode.children &&
            domToReact(typedDomNode.children as DOMNode[], options)}
        </Link>
      )
    }

    if (typedDomNode.attribs && typedDomNode.name === 'h1') {
      return (
        <h1 className={postStyles.h1}>
          {typedDomNode.children &&
            domToReact(typedDomNode.children as DOMNode[], options)}
        </h1>
      )
    }

    if (typedDomNode.attribs && typedDomNode.name === 'h2') {
      return (
        <h2 className={postStyles.h2}>
          {typedDomNode.children &&
            domToReact(typedDomNode.children as DOMNode[], options)}
        </h2>
      )
    }

    if (typedDomNode.attribs && typedDomNode.name === 'h3') {
      return (
        <h3 className={postStyles.h3}>
          {typedDomNode.children &&
            domToReact(typedDomNode.children as DOMNode[], options)}
        </h3>
      )
    }

    if (typedDomNode.attribs && typedDomNode.name === 'h4') {
      return (
        <h4 className={postStyles.h4}>
          {typedDomNode.children &&
            domToReact(typedDomNode.children as DOMNode[], options)}
        </h4>
      )
    }

    if (typedDomNode.attribs && typedDomNode.name === 'p') {
      return (
        <p className={postStyles.p}>
          {typedDomNode.children &&
            domToReact(typedDomNode.children as DOMNode[], options)}
        </p>
      )
    }

    if (typedDomNode.attribs && typedDomNode.name === 'ul') {
      return (
        <ul className={postStyles.ul}>
          {typedDomNode.children &&
            domToReact(typedDomNode.children as DOMNode[], options)}
        </ul>
      )
    }

    if (typedDomNode.attribs && typedDomNode.name === 'ol') {
      return (
        <ol className={postStyles.ol}>
          {typedDomNode.children &&
            domToReact(typedDomNode.children as DOMNode[], options)}
        </ol>
      )
    }

    if (typedDomNode.attribs && typedDomNode.name === 'li') {
      return (
        <li className={postStyles.li}>
          {typedDomNode.children &&
            domToReact(typedDomNode.children as DOMNode[], options)}
        </li>
      )
    }

    if (typedDomNode.attribs && typedDomNode.name === 'img') {
      const props = attributesToProps(typedDomNode.attribs)
      return (
        <Image
          width={postStyles.img.width}
          height={postStyles.img.height}
          sizes='100%'
          src={props.src as string}
          {...props}
          className={postStyles.img.className}
          alt={(props.alt as string) || 'blog-image'}
          placeholder='blur'
          blurDataURL={shimmerPlaceholder(50, 50)}
        />
      )
    }

    return false
  },
}

export default async function NewsPost({ params }: { params: { id: string } }) {
  const postContents = await getPostContents(params.id)

  if (!postContents) {
    notFound()
  }

  return (
    <>
      <>
        <div
          className='sticky top-14 flex flex-row items-center justify-start gap-3 pt-2'
          style={{ backgroundColor: colors.pageBackground }}
        >
          <Badge className='mb-3'>新聞</Badge>
          <h1 className='mb-3 text-xl font-bold'>{postContents.title}</h1>
        </div>
        <p className='text-gray-500'>{postContents.description}</p>
        <div className='mt-6 px-2'>{parse(postContents.contents, options)}</div>
      </>
    </>
  )
}

async function getPostContents(id: string) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('id', id)
    .limit(1)

  if (error) {
    console.error(error)
    return null
  }

  return data[0]
}

type Props = {
  params: { id: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const id = params.id

  const postTitle = (await getPostContents(id))?.title

  return {
    title: postTitle,
  }
}
