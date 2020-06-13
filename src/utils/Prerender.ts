import Platform from '@/utils/Platform'
import { useRoute } from 'vue-router'

const baseTitle = document.getElementsByTagName('title')[0].innerText

interface MetaTags {
  readonly twitterDescription: HTMLMetaElement | null
  readonly ogDescription: HTMLMetaElement | null
  readonly description: HTMLMetaElement | null

  readonly twitterImage: HTMLMetaElement | null
  readonly ogImage: HTMLMetaElement | null

  readonly twitterTitle: HTMLMetaElement | null
  readonly ogTitle: HTMLMetaElement | null
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
  ogURL: document.querySelector('meta[property="og:url"]')
}

export default function (data: MetaData = {}): void {
  const title = document.getElementsByTagName('title')[0]
  if (data.title && title.innerText.includes('|')) return

  if (data.fullTitle && data.title) title.innerText = data.title
  else title.innerText = data.title ? `${data.title} | ${baseTitle}` : baseTitle

  if (Platform.prerender) {
    tags.twitterImage!.content = data.image ? `/public/img/${data.image}` : tags.twitterImage!.content
    tags.ogImage!.content = data.image ? `/public/img/${data.image}` : tags.ogImage!.content

    tags.twitterDescription!.content = data.description || tags.twitterDescription!.content
    tags.ogDescription!.content = data.description || tags.ogDescription!.content
    tags.description!.content = data.description || tags.description!.content

    tags.ogURL!.content = `${window.location.origin}${useRoute().fullPath}`
    tags.twitterTitle!.content = title.innerText
    tags.ogTitle!.content = title.innerText

    setTimeout(() => {
      document.dispatchEvent(new Event('custom-post-render-event'))
    }, 1000)
  }
}
