"use client"

import { useEffect } from 'react'
import Script from 'next/script'

declare global {
  interface Window {
    fbq: any
    pixelId: string
  }
}

export default function PixelManager() {
  useEffect(() => {
    // Initialize Facebook Pixel Original
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('init', '2350369725357420')
      window.fbq('track', 'PageView')
      
      // Initialize Facebook Pixel Novo
      window.fbq('init', '1258450491879496')
      window.fbq('track', 'PageView')
    }
  }, [])

  return (
    <>
      {/* Meta Pixel Original */}
      <Script id="facebook-pixel" strategy="afterInteractive">
        {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '2350369725357420');
          fbq('track', 'PageView');
          fbq('init', '1258450491879496');
          fbq('track', 'PageView');
        `}
      </Script>

      {/* Utmify Pixel */}
      <Script id="utmify-pixel" strategy="afterInteractive">
        {`
          window.pixelId = "6866499592b79dbafc78f878";
          var a = document.createElement("script");
          a.setAttribute("async", "");
          a.setAttribute("defer", "");
          a.setAttribute("src", "https://cdn.utmify.com.br/scripts/pixel/pixel.js");
          document.head.appendChild(a);
        `}
      </Script>

      {/* Novo Utmify Pixel */}
      <Script id="utmify-pixel-new" strategy="afterInteractive">
        {`
          window.pixelId = "685891b70625ccf1fd3a54bc";
          var a = document.createElement("script");
          a.setAttribute("async", "");
          a.setAttribute("defer", "");
          a.setAttribute("src", "https://cdn.utmify.com.br/scripts/pixel/pixel.js");
          document.head.appendChild(a);
        `}
      </Script>

      {/* Utmify UTM Script */}
      <Script
        src="https://cdn.utmify.com.br/scripts/utms/latest.js"
        data-utmify-prevent-xcod-sck=""
        data-utmify-prevent-subids=""
        strategy="afterInteractive"
        async
        defer
      />

      {/* Meta Pixel NoScript Original */}
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          src="https://www.facebook.com/tr?id=2350369725357420&ev=PageView&noscript=1"
          alt=""
        />
      </noscript>

      {/* Meta Pixel NoScript Novo */}
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          src="https://www.facebook.com/tr?id=1258450491879496&ev=PageView&noscript=1"
          alt=""
        />
      </noscript>
    </>
  )
} 
