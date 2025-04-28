export interface Pokemon {
  name: string
  url: string
}
export interface PokemonResponse {
  count: number
  next: string | null
  previous: string | null
  results: Pokemon[]
}
export interface PokemonDetail {
  id: number
  name: string
  base_experience: number
  height: number
  weight: number
}
