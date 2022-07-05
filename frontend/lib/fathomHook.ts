import { LoadOptions, load, trackPageview } from 'fathom-client'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

const FathomHook = () => {
  const { events } = useRouter()
  const nodeEnv = process.env.NODE_ENV
  const eventType = 'routeChangeComplete'
  const siteId = process.env.NEXT_PUBLIC_FATHOM_SITE_ID
  const excludedDomains = process.env.NEXT_PUBLIC_FATHOM_EXCLUDED_DOMAINS?? ""
  const includedDomains = process.env.NEXT_PUBLIC_FATHOM_INCLUDED_DOMAINS?? ""

  useEffect(() => {
    if (nodeEnv !== 'production' || !siteId) return
    let loadOptions: LoadOptions = {}

    if (includedDomains.length) {
      loadOptions.includedDomains = includedDomains.split(',')
    }

    if (excludedDomains.length) {
      loadOptions.excludedDomains = excludedDomains.split(',')
    }

    load(siteId, loadOptions)
    events.on(eventType, trackPageview)

    return () => events.off(eventType, trackPageview)
  }, [])

  return {}
}

export default FathomHook