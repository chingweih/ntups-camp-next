import { colors } from '@/lib/custom-colors'

export const postStyles = {
  h1: 'text-2xl font-bold my-8',
  h2: 'text-xl font-bold mb-5 mt-10',
  h3: 'text-lg font-bold mb-3',
  h4: 'text-base font-bold mb-3',
  p: 'text-base my-3 leading-relaxed',
  ul: 'list-disc pl-5 my-5',
  ol: 'list-decimal pl-5 my-5',
  li: 'mb-1',
  a: {
    className: 'underline',
    color: colors.primaryBlue,
  },
  img: {
    className: 'w-full my-5 rounded',
    width: 50,
    height: 30,
  },
}
