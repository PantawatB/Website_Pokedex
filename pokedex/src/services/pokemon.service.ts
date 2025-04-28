import type { PokemonResponse } from '@/models/pokemon.model'
import { httpClient } from './main.service'
import type { PokemonDetail } from '@/models/pokemon.model'
const endpoint = 'pokemon'

export const getPokemons = () => httpClient.get<PokemonResponse>(endpoint)

export const getPokemonDetail = (id: number) => httpClient.get<PokemonDetail>(`pokemon/${id}`)
