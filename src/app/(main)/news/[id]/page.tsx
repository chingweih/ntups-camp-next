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

const options: HTMLReactParserOptions = {
  replace: (domNode) => {
    const typedDomNode = domNode as Element

    if (typedDomNode.attribs && typedDomNode.name === 'a') {
      const props = attributesToProps(typedDomNode.attribs)
      return (
        <Link
          href={props.href as Url}
          {...props}
          className='underline'
          style={{ color: colors.primaryBlue }}
          target='_blank'
        >
          {typedDomNode.children &&
            domToReact(typedDomNode.children as DOMNode[], options)}
        </Link>
      )
    }

    if (typedDomNode.attribs && typedDomNode.name === 'h1') {
      return (
        <h1 className='text-2xl font-bold mb-3'>
          {typedDomNode.children &&
            domToReact(typedDomNode.children as DOMNode[], options)}
        </h1>
      )
    }

    if (typedDomNode.attribs && typedDomNode.name === 'h2') {
      return (
        <h2 className='text-xl font-bold mb-3'>
          {typedDomNode.children &&
            domToReact(typedDomNode.children as DOMNode[], options)}
        </h2>
      )
    }

    if (typedDomNode.attribs && typedDomNode.name === 'h3') {
      return (
        <h3 className='text-lg font-bold mb-3'>
          {typedDomNode.children &&
            domToReact(typedDomNode.children as DOMNode[], options)}
        </h3>
      )
    }

    if (typedDomNode.attribs && typedDomNode.name === 'h4') {
      return (
        <h4 className='text-base font-bold mb-3'>
          {typedDomNode.children &&
            domToReact(typedDomNode.children as DOMNode[], options)}
        </h4>
      )
    }

    if (typedDomNode.attribs && typedDomNode.name === 'p') {
      return (
        <p className='text-base mb-3'>
          {typedDomNode.children &&
            domToReact(typedDomNode.children as DOMNode[], options)}
        </p>
      )
    }

    if (typedDomNode.attribs && typedDomNode.name === 'ul') {
      return (
        <ul className='list-disc pl-5 mb-3'>
          {typedDomNode.children &&
            domToReact(typedDomNode.children as DOMNode[], options)}
        </ul>
      )
    }

    if (typedDomNode.attribs && typedDomNode.name === 'ol') {
      return (
        <ol className='list-decimal pl-5 mb-3'>
          {typedDomNode.children &&
            domToReact(typedDomNode.children as DOMNode[], options)}
        </ol>
      )
    }

    if (typedDomNode.attribs && typedDomNode.name === 'li') {
      return (
        <li className='mb-1'>
          {typedDomNode.children &&
            domToReact(typedDomNode.children as DOMNode[], options)}
        </li>
      )
    }

    if (typedDomNode.attribs && typedDomNode.name === 'img') {
      const props = attributesToProps(typedDomNode.attribs)
      return (
        <Image
          width={50}
          height={30}
          sizes='100%'
          src={props.src as string}
          {...props}
          className='w-full my-5 rounded'
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
          className='flex flex-row items-center justify-start gap-3 sticky top-14 pt-2'
          style={{ backgroundColor: colors.pageBackground }}
        >
          <Badge className='mb-3'>新聞</Badge>
          <h1 className='text-xl font-bold mb-3'>{postContents.title}</h1>
        </div>
        <p className='text-gray-500'>{postContents.description}</p>
        <div className='px-2 mt-6'>{parse(postContents.contents, options)}</div>
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
