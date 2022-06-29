
import React from 'react';
import Document, { Html, Head, Main, NextScript } from 'next/document';
import { ServerStyleSheet } from 'styled-components';

export default class MyDocument extends Document {
    static  async getInitialProps(ctx) {
            const sheet = new ServerStyleSheet();
            const originalRenderPage = ctx.renderPage;

        try {
            ctx.renderPage = () => originalRenderPage({
                enhanceApp: App => props => sheet.collectStyles(<App {...props} />),
            });
            const initialProps = await Document.getInitialProps(ctx);
            return {
                ...initialProps,
                styles: (
                    <>
                        {initialProps.styles}
                        {sheet.getStyleElement()}
                    </>
                )
            }
        } catch (error) {
            console.error(error);
        } finally {
            sheet.seal();
        }
    }
    // getInitialProps는 document나 app에서만 쓰는 serverside rendering method
    // app.js가 이걸로 감싸지면서 head, body 같은것도 수정 가능
    render() {
        return (
            <Html>
                <Head/>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        )
    }
}