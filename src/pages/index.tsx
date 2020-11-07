import { InferGetServerSidePropsType } from 'next'
import Link from 'next/link'
import PrismicDOM from 'prismic-dom'
import Prismic from 'prismic-javascript'

import { Document } from 'prismic-javascript/types/documents'
import { Title } from '@/styles/pages/Home'
import SEO from '@/components/SEO'
import { client } from '@/lib/prismic'

export const getServerSideProps = async () => {
  const products: Document[] = (await client().query([
    Prismic.Predicates.at('document.type', 'product')
  ])).results
  

  return {
    props: {
      products
    }
  }
}

export default function Home({ products }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <div>
      <SEO
        title="DevCommerce, your top ecommerce"
        image="boost.png"
        shouldExcludeTitleSuffix
      />
      <section>
        <Title>Products</Title>

        <ul>
          {products.map(product => {
            return (
              <li key={product.id}>
                <Link href={`/catalog/products/${product.uid}`}>
                  <a>
                    {PrismicDOM.RichText.asText(product.data.title)}
                  </a>
                </Link>
              </li>
            )
          })}
        </ul>
      </section>
    </div>
  )
}
