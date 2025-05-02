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
  abilities?: Array<{
    ability: {
      name: string
      url: string
    }
    is_hidden: boolean
    slot: number
  }>
  sprites?: {
    front_default?: string
    front_shiny?: string
    back_default?: string
    back_shiny?: string
    other?: {
      'official-artwork'?: {
        front_default?: string
        front_shiny?: string
      }
      home?: {
        front_default?: string
        front_shiny?: string
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

export interface PokemonSpecies {
  id: number
  name: string
  gender_rate: number
  has_gender_differences: boolean
  evolution_chain: {
    url: string
  }
  flavor_text_entries: Array<{
    flavor_text: string
    language: {
      name: string
      url: string
    }
    version: {
      name: string
      url: string
    }
  }>
  genera: Array<{
    genus: string
    language: {
      name: string
      url: string
    }
  }>
  is_baby: boolean
  is_legendary: boolean
  is_mythical: boolean
}

export interface EvolutionChain {
  id: number
  chain: ChainLink
}

export interface ChainLink {
  species: {
    name: string
    url: string
  }
  evolution_details: Array<{
    min_level?: number
    trigger?: {
      name: string
      url: string
    }
    item?: {
      name: string
      url: string
    }
  }> | null
  evolves_to: ChainLink[]
}

export interface TypeRelation {
  name: string
  url: string
}

export interface DamageRelations {
  double_damage_from: TypeRelation[]
  double_damage_to: TypeRelation[]
  half_damage_from: TypeRelation[]
  half_damage_to: TypeRelation[]
  no_damage_from: TypeRelation[]
  no_damage_to: TypeRelation[]
}
