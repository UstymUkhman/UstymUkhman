import jsonConfig from '../../package.json'
import Platform from '@/utils/Platform'
import { useRoute } from 'vue-router'

let baseTitle = document.getElementsByTagName('title')[0].innerText
const domain = (jsonConfig as { domain?: string }).domain
const separatorIndex = baseTitle.indexOf(' | ')

if (separatorIndex > -1) baseTitle = baseTitle.slice(separatorIndex + 3)

interface MetaTags {
  readonly twitterDescription: HTMLMetaElement | null
  readonly ogDescription: HTMLMetaElement | null
  readonly description: HTMLMetaElement | null

  readonly twitterImage: HTMLMetaElement | null
  readonly ogImage: HTMLMetaElement | null

  readonly twitterTitle: HTMLMetaElement | null
  readonly ogTitle: HTMLMetaElement | null
  readonly title: HTMLTitleElement | null
  readonly ogURL: HTMLMetaElement | null
}

interface MetaData {
  readonly title?: string
  readonly image?: string
  readonly fullTitle?: boolean
  readonly description?: string
}

const tags: MetaTags = {
  twitterDescription: document.querySelector('meta[name="twitter:description"]'),
  ogDescription: document.querySelector('meta[property="og:description"]'),
  description: document.querySelector('meta[name="description"]'),

  twitterImage: document.querySelector('meta[name="twitter:image"]'),
  ogImage: document.querySelector('meta[property="og:image"]'),

  twitterTitle: document.querySelector('meta[name="twitter:title"]'),
  ogTitle: document.querySelector('meta[property="og:title"]'),
  ogURL: document.querySelector('meta[property="og:url"]'),
  title: document.getElementsByTagName('title')[0]
}

export default function (data: MetaData = {}): void {
  const fullTitle = data.title as string
  const pageTitle = data.title ? `${data.title} | ` : ''

  tags.title!.innerText = data.fullTitle ? fullTitle : pageTitle + baseTitle

  if (Platform.prerender) {
    const title = data.fullTitle ? fullTitle : data.title ? `${data.title} | ${baseTitle}` : baseTitle

    tags.twitterImage!.content = data.image ? `/public/img/${data.image}` : tags.twitterImage!.content
    tags.ogImage!.content = data.image ? `/public/img/${data.image}` : tags.ogImage!.content

    tags.twitterDescription!.content = data.description || tags.twitterDescription!.content
    tags.ogDescription!.content = data.description || tags.ogDescription!.content
    tags.description!.content = data.description || tags.description!.content

    tags.ogURL!.content = `${domain?.slice(0, -1)}${useRoute().fullPath}`
    tags.twitterTitle!.content = title
    tags.ogTitle!.content = title
    tags.title!.innerText = title

    setTimeout(() =>
      document.dispatchEvent(new Event('custom-post-render-event'))
    , 1000)
  }
}
