const API_URL = 'https://graphql.datocms.com'
const DATOCMS_API_TOKEN = 'f692817ba3e7d4447ebd6feb6b713c'
const API_TOKEN = process.env.f692817ba3e7d4447ebd6feb6b713c
async function fetchAPI(query, variables = {}, preview) {
  const res = await fetch(API_URL + (preview ? '/preview' : ''), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${API_TOKEN}`,
    },
    body: JSON.stringify({
      query: query.replace('\n', '').trim().startsWith('query')
        ? query
        : `
        query MyQuery($locale: SiteLocale) {
          ${query}
          ${globalQueries}
        }
      `,
      variables,
    }),
  })

  const json = await res.json()

  if (json.errors) {
    console.error(json.errors)
    throw new Error('API fetch failed')
  }

  return json.data
}

const globalQueries = `
  header(locale: $locale) {
    title
    subtitle
  }
`

const commonPageQueries = `
  metaTags {
    title
    description
  }
`

export async function fetchData(
  resource: string,
  { locale = 'en', preview = false, slug = null } = {}
) {
  switch (resource) {
    case 'homepage':
      return fetchAPI(
        `
        homepage(locale: en) {
          title subtitle
          ${commonPageQueries}
        }
        `,
        { locale },
        preview
      )   

async function getAllPostsWithSlug(locale, preview = false) {
  const data = await fetchAPI(
    `
    query allPostsWithSlug($locale: SiteLocale) {
      allPosts(locale: en) {
        slug
      }
    }
`,
    { locale },
    preview
  )

  return data.allPosts
}

async function getPostBySlug(slug, locale, preview = false) {
  const data = await fetchAPI(
    `
    query getPostBySlug($locale: SiteLocale, $slug: String) {
      post(locale: $locale, filter: {slug: {eq: $slug}}) {
        slug
        title
        date
        image {
          url(imgixParams: {fm: jpg, q:60})
          alt
          title
          blurUpThumb(imgixParams: {fm: jpg, q:60})
        }
        body(markdown: true)
        ${commonPageQueries}
      }
      ${globalQueries}
    }
  `,
    { locale, slug },
    preview
  )

  return data
}}}