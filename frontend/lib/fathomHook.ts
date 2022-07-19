import { LoadOptions, load, trackPageview } from 'fathom-client'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

const FathomHook = () => {
  const { events } = useRouter()
  const nodeEnv = process.env.NODE_ENV
  const eventType = 'routeChangeComplete'
  const siteId = process.env.NEXT_PUBLIC_FATHOM_SITE_ID
  const fathomCustomUrl = process.env.NEXT_PUBLIC_FATHOM_CUSTOM_URL
 
  useEffect(() => {
    if (nodeEnv !== 'production' || !siteId) return
    
    let loadOptions: LoadOptions = {
      url: fathomCustomUrl
    }

    load(siteId, loadOptions)
    events.on(eventType, trackPageview)

    return () => events.off(eventType, trackPageview)
  }, [])

  return {}
}

export default FathomHook