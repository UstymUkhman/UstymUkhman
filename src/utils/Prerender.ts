import jsonConfig from '../../package.json'
import Platform from '@/utils/Platform'
import { useRoute } from 'vue-router'

let baseTitle = document.getElementsByTagName('title')[0].innerText
const domain = (jsonConfig as { domain?: string }).domain
const separatorIndex = baseTitle.indexOf(' | ')

if (separatorIndex > -1) baseTitle = baseTitle.slice(separatorIndex + 3)

interface MetaTags {
  readonly twitterDescription: HTMLMetaElement
  readonly ogDescription: HTMLMetaElement
  readonly description: HTMLMetaElement

  readonly twitterImage: HTMLMetaElement
  readonly ogImage: HTMLMetaElement

  readonly twitterTitle: HTMLMetaElement
  readonly ogTitle: HTMLMetaElement
  readonly title: HTMLTitleElement
  readonly ogURL: HTMLMetaElement
}

interface MetaData {
  readonly title?: string
  readonly image?: string
  readonly fullTitle?: boolean
  readonly description?: string
}

const tags: MetaTags = {
  twitterDescription: document.querySelector('meta[name="twitter:description"]') as HTMLMetaElement,
  ogDescription: document.querySelector('meta[property="og:description"]') as HTMLMetaElement,
  description: document.querySelector('meta[name="description"]') as HTMLMetaElement,

  twitterImage: document.querySelector('meta[name="twitter:image"]') as HTMLMetaElement,
  ogImage: document.querySelector('meta[property="og:image"]') as HTMLMetaElement,

  twitterTitle: document.querySelector('meta[name="twitter:title"]') as HTMLMetaElement,
  ogTitle: document.querySelector('meta[property="og:title"]') as HTMLMetaElement,
  ogURL: document.querySelector('meta[property="og:url"]') as HTMLMetaElement,
  title: document.getElementsByTagName('title')[0]
}

export default function (data: MetaData = {}): void {
  const fullTitle = data.title as string
  const pageTitle = data.title ? `${data.title} | ` : ''

  tags.title.innerText = data.fullTitle ? fullTitle : pageTitle + baseTitle

  if (Platform.prerender) {
    const title = data.fullTitle ? fullTitle : data.title ? `${data.title} | ${baseTitle}` : baseTitle

    tags.twitterImage.content = data.image ? `/public/img/${data.image}` : tags.twitterImage.content
    tags.ogImage.content = data.image ? `/public/img/${data.image}` : tags.ogImage.content

    tags.twitterDescription.content = data.description || tags.twitterDescription.content
    tags.ogDescription.content = data.description || tags.ogDescription.content
    tags.description.content = data.description || tags.description.content

    tags.ogURL.content = `${domain?.slice(0, -1)}${useRoute().fullPath}`
    tags.twitterTitle.content = title
    tags.ogTitle.content = title
    tags.title.innerText = title

    setTimeout(() =>
      document.dispatchEvent(new Event('custom-post-render-event'))
    , 1000)
  }
}
