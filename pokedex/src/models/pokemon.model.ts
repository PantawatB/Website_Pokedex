export interface pokemon {
  name: string
  url: string
}
export interface pokemonResponse {
  count: number
  next: string | null
  previous: string | null
  results: pokemon[]
}
export interface pokemonDetail {
  id: number
  name: string
  base_experience: number
  height: number
  weight: number
}
