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
  sprites?: {
    front_default?: string
    back_default?: string
    other?: {
      'official-artwork'?: {
        front_default?: string
      }
      home?: {
        front_default?: string
      }
      'dream-world'?: {
        front_default?: string
      }
    }
  }
  types?: Array<{
    slot: number
    type: {
      name: string
      url: string
    }
  }>
}
