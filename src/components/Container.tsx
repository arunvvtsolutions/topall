'use client';

import Head from 'next/head';
import { useRouter } from 'next/navigation';
import type { Metadata } from 'next';
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL } from '@/constants/seo/seo-variables';

type Meta = {
  title?: string | null;
  description?: string | null;
  image?: string | null;
  url?: string | null;
};

type Props = {
  meta: Meta;
  children: React.ReactNode;
};

const PageSeo = ({ meta, children }: Props) => {
  const router = useRouter();
  const image = meta.image || '/site-image.png';
  const title = meta.title || SITE_NAME;
  const url = meta.url || `${SITE_URL}`;
  const description = meta.description || SITE_DESCRIPTION;

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta property="og:title" content={title} />
        <meta property="og:url" content={url} />
        <meta property="og:image" content="/og-card.png" />
        <meta name="description" content={description} />
        <meta property="og:description" content={description} />
        <meta name="twitter:card" content={image ? 'summary_large_image' : 'summary'} />
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest.json" />
        <link rel="shortcut icon" href="/favicon/favicon.ico" />
        {/* jitsu */}
        <script
          src="https://t.jitsu.com/s/lib.js"
          data-key="js.uxpblgw96dqb9jnr0av8cn.1ah6m0kxdlr94z91azeb9p"
          data-init-only="false"
          defer
        ></script>
        {/* plausible */}
        <script defer data-domain="topall.app" src="https://plausible.io/js/script.js"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `window.jitsu = window.jitsu || (function(){(window.jitsuQ = window.jitsuQ || []).push(arguments);})`
          }}
        />
        {/* googletagmanager */}
        {/* eslint-disable-next-line @next/next/next-script-for-ga */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){
            w[l]=w[l]||[];
            w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});
            var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';
            j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
            f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-T6XX84W');`
          }}
        />
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-T6XX84W"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          ></iframe>
        </noscript>
      </Head>
      {children}
    </>
  );
};

export default PageSeo;
