'use client'

import Script from 'next/script'

const FB_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID

export function FacebookPixel() {
    if (!FB_PIXEL_ID) {
        return null
    }

    return (
        <>
            <Script
                id="fb-pixel"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                    __html: `
                        !function(f,b,e,v,n,t,s)
                        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                        n.queue=[];t=b.createElement(e);t.async=!0;
                        t.src=v;s=b.getElementsByTagName(e)[0];
                        s.parentNode.insertBefore(t,s)}(window, document,'script',
                        'https://connect.facebook.net/en_US/fbevents.js');
                        fbq('init', '${FB_PIXEL_ID}');
                        fbq('track', 'PageView');
                    `,
                }}
            />
            <noscript>
                <img
                    height="1"
                    width="1"
                    style={{ display: 'none' }}
                    src={`https://www.facebook.com/tr?id=${FB_PIXEL_ID}&ev=PageView&noscript=1`}
                    alt=""
                />
            </noscript>
        </>
    )
}

// Helper functions to track custom events
export function trackFBEvent(eventName: string, params?: Record<string, unknown>) {
    if (typeof window !== 'undefined' && (window as any).fbq) {
        (window as any).fbq('track', eventName, params)
    }
}

// Pre-built event trackers
export const fbEvents = {
    ctaClick: (label: string) => trackFBEvent('Lead', { content_name: label }),
    socialClick: (platform: string) => trackFBEvent('Lead', { content_name: platform, content_category: 'Social Media' }),
    formSubmit: (formType: string) => trackFBEvent('Contact', { content_name: formType }),
    spotifyPlay: () => trackFBEvent('ViewContent', { content_name: 'Spotify Player', content_type: 'music' }),
}
