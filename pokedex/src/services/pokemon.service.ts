import type { pokemonResponse } from '@/models/pokemon.model'
import { httpClient } from './main.service'
import type { pokemonDetail } from '@/models/pokemon.model'
const endpoint = 'pokemon'

export const getPokemons = () => httpClient.get<pokemonResponse>(endpoint)

export const getPokemonDetail = (id: number) => httpClient.get<pokemonDetail>(`pokemon/${id}`)
