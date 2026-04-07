import { onMounted } from 'vue'

export function useMeta(metaConfig) {
  const defaultTitle = 'Konsultasi Regional PDRB Kasulampua'

  const updateMeta = (config) => {
    if (config.title) {
      document.title = `${config.title} - ${defaultTitle}`
    }

    const tags = [
      { property: 'og:title', content: config.title || defaultTitle },
      { property: 'og:description', content: config.description },
      { property: 'og:image', content: config.image },
      { name: 'description', content: config.description },
      { name: 'twitter:title', content: config.title || defaultTitle },
      { name: 'twitter:description', content: config.description },
      { name: 'twitter:image', content: config.image },
    ]

    tags.forEach((tag) => {
      if (!tag.content) return

      const selector = tag.property 
        ? `meta[property="${tag.property}"]` 
        : `meta[name="${tag.name}"]`
      
      let element = document.querySelector(selector)
      
      if (!element) {
        element = document.createElement('meta')
        if (tag.property) element.setAttribute('property', tag.property)
        if (tag.name) element.setAttribute('name', tag.name)
        document.head.appendChild(element)
      }
      
      element.setAttribute('content', tag.content)
    })
  }

  onMounted(() => {
    if (metaConfig) {
      updateMeta(metaConfig)
    }
  })

  // Optional: reset to defaults on unmount if needed
  // onUnmounted(() => { ... })

  return { updateMeta }
}
