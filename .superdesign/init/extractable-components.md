# Extractable components
No standalone layout components: header and footer markup is duplicated inline in each static HTML page. Keep these basic primitives inline in drafts.

## FavoriteCard
- Sources: pages/favorites/books.html, movies.html, tv_shows.html
- Category: basic
- Description: Title, author/year, description, action button; personal note injected by subpage.js.
- Props: destination or modal id
- Hardcoded: fonts, labels, styling

## CategoryLink
- Source: pages/favorites/index.html
- Category: basic
- Description: Link with personal note on hover.
- Props: href
- Hardcoded: category label and notes
