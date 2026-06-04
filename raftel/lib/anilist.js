
const SEARCH_ANIME = `
  query SearchAnime($search: String) {
    Page(perPage: 10) {
      media(search: $search, type: ANIME) {
        id
        title { romaji }
        coverImage { medium }
      }
    }
  }
`
export async function searchAnime(search) {
    if(!search) return []
    const res = await fetch("https://graphql.anilist.co" ,{
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            query: SEARCH_ANIME,
            variables: { search }
        })
    })
        const data = await res.json()
        return data.data.Page.media
}
 
