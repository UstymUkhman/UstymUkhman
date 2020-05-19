import { useRoute } from 'vue-router'
import Platform from './Platform'

const baseTitle: string = document.getElementsByTagName('title')[0].innerText

interface MetaTags {
  twitterDescription: HTMLMetaElement | null
  ogDescription: HTMLMetaElement | null
  description: HTMLMetaElement | null

  twitterImage: HTMLMetaElement | null
  ogImage: HTMLMetaElement | null

  twitterTitle: HTMLMetaElement | null
  ogTitle: HTMLMetaElement | null
  ogURL: HTMLMetaElement | null
}

const tags: MetaTags = {
  twitterDescription: document.querySelector('meta[name="twitter:description"]'),
  ogDescription: document.querySelector('meta[property="og:description"]'),
  description: document.querySelector('meta[name="description"]'),

  twitterImage: document.querySelector('meta[name="twitter:image"]'),
  ogImage: document.querySelector('meta[property="og:image"]'),

  twitterTitle: document.querySelector('meta[name="twitter:title"]'),
  ogTitle: document.querySelector('meta[property="og:title"]'),
  ogURL: document.querySelector('meta[property="og:url"]')
}

interface MetaData {
  title?: string
  image?: string
  fullTitle?: boolean
  description?: string
}

export default function (data: MetaData): void {
  const route = useRoute()
  const { matched, ...location } = route
  const title = document.getElementsByTagName('title')[0]

  if (title.innerText === baseTitle) {
    if (data.fullTitle && data.title) title.innerText = data.title
    else title.innerText = data.title ? `${data.title} | ${baseTitle}` : baseTitle
  }

  if (Platform.prerender) {
    tags.twitterImage!.content = data.image ? `/public/img/${data.image}` : tags.twitterImage!.content
    tags.ogImage!.content = data.image ? `/public/img/${data.image}` : tags.ogImage!.content

    tags.twitterDescription!.content = data.description || tags.twitterDescription!.content
    tags.ogDescription!.content = data.description || tags.ogDescription!.content
    tags.description!.content = data.description || tags.description!.content

    tags.ogURL!.content = `${window.location.origin}${location.fullPath}`
    tags.twitterTitle!.content = title.innerText
    tags.ogTitle!.content = title.innerText

    setTimeout(() => {
      document.dispatchEvent(new Event('custom-post-render-event'))
    }, 1000)
  }
}
