import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
    return (
        <Html>
            <Head>
                <link href="https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@200;300;400;600;700;900&display=swap"
                    rel="stylesheet" />
                <style>
                    {`  
                        * { 
                            font-family: Source Sans Pro, sans-serif !important; 
                            font-size: 18px;
                        }
                    `}
                </style>
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    )
}