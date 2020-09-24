import Document, { Main, NextScript, Html, Head } from 'next/document'
import { ServerStyleSheet } from 'styled-components'

export default class extends Document {
  static async getInitialProps(ctx) {
    const sheet = new ServerStyleSheet()
    const originalRenderPage = ctx.renderPage
    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhaceApp: (App) => (props) =>
            sheet.collectStyles(<App {...props} />),
        })

      const initialProps = await Document.getInitialProps(ctx)

      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        ),
      }
    } finally {
      sheet.seal()
    }
  }

  render() {
    const lang = this.props.__NEXT_DATA__?.props?.pageProps?.locale || 'en'

    return (
      <Html lang={lang}>
        <Head>
        </Head>
        <body>
          <script dangerouslySetInnerHTML={{ __html: darkModeCode }} />
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}