import React from 'react'
import Head from 'next/head'

const ErrorPage: React.FC<{ statusCode: number }> = ({ statusCode }) => {
  const title = 'Error'

  return (
    <>
      <Head>
        <meta property='og:site_name' content={title} />
        <meta property='og:title' content={title} />

        <title>{title}</title>
      </Head>

      <div className="">
        <main className="">
          <h1>Error Loading Page</h1>

          {statusCode && <p>Error code: {statusCode}</p>}

          <img src='/error.png' alt='Error' className="" />
        </main>
      </div>
    </>
  )
}
export default ErrorPage