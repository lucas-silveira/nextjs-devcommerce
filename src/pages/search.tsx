import { GetServerSideProps } from "next"
import { Router, useRouter } from "next/router"
import { FormEvent, useState } from "react"
import Prismic from 'prismic-javascript'
import PrismicDOM from 'prismic-dom'
import { Document } from 'prismic-javascript/types/documents'
import Link from "next/link"
import { client } from "@/lib/prismic"
import { Title } from "@/styles/pages/Home"

type SearchProps = {
  searchResults: Document[];
}

export default function Search({ searchResults }: SearchProps) {
  const router = useRouter()
  const [search, setSearch] = useState('')

  function handleSearch(event: FormEvent) {
    event.preventDefault()
    router.push(`/search?q=${encodeURIComponent(search)}`)
    setSearch('')
  }

  return (
    <div>
      <form onSubmit={handleSearch}>
        <input type="text" value={search} onChange={event => setSearch(event.target.value)} />
        <button type="submit">Search</button>
      </form>

      <section>
        <ul>
          {searchResults.map(product => {
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

export const getServerSideProps: GetServerSideProps<SearchProps> = async context => {
  const { q } = context.query

  if (!q) return { props: { searchResults: [] } }

  const searchResults = (await client().query([
    Prismic.Predicates.at('document.type', 'product'),
    Prismic.Predicates.fulltext('my.product.title', String(q))
  ])).results

  return {
    props: { searchResults }
  }
}