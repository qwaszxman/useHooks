import React, { Component, useReducer, useEffect } from 'react'
import hardtack from 'hardtack'
import Pokemon from '../pokemon/cnt-pokemon'
import Search from '../search/cmp-search'
import ga from '../../utils/ga'

const initialState = {
  searchString: '',
  pokemonsIds: [],
  error: null
}

const PageActions = () => {
  const setError = (data) => { return { type: "error", data: data } }
  const reset = (data) => { return { type: "reset", data: data } }
  const update = (data) => { return { type: "update", data: data } }
  return {
    setError,
    reset,
    update,
  }

}

const PageReducer = (state, action) => {
  switch (action.type) {
    case "error":
      return state;

    case "update":
      return state;

      case "error":
        default:

      return state;
  }
}

const Page = (props) => {

  const [state, dispatch] = useReducer(PageReducer, initialState);

  useEffect(() => {
    props.getPokemons().then(action => {
      if (action.error) {
        dispatch(PageActions.setError(acion.payload.message))
      }
        
      const searchString = hardtack.get('searchString')
      const { pokemonsById, pokemonsAllIds } = props

      if (!searchString) {
        dispatch(PageActions.reset(pokemonsAllIds))
      }

      const pokemonsIds = pokemonsAllIds.filter(pokemonId => {
        const pokemon = pokemonsById[pokemonId]

        return pokemon.name.includes(searchString)
      })

      dispatch(PageActions.update({ids : pokemonsIds, searchString : searchString}))
    })

    ga.pageview(window.location.pathname + window.location.search)
  });

  const handleSearch = e => {
    const { target, currentTarget } = e;

    const value = currentTarget.value.toLowerCase().trim()
    const { pokemonsById, pokemonsAllIds } = props

    hardtack.set('searchString', value, {
      maxAge: '31536000'
    })

    if (value === '') {
      dispatch(PageActions.update)
      
      dispatch(PageActions.update({ids : pokemonsIds, searchString : searchString}))

    }

    const pokemonsIds = pokemonsAllIds.filter(pokemonId => {
      const pokemon = pokemonsById[pokemonId]

      return pokemon.name.includes(value)
    })

    dispatch(PageActions.update({ids : pokemonsIds, searchString : value}))
  }


  const { searchString, pokemonsIds, error } = state
  const { isFetched } = props

  const pokemons = pokemonsIds.map(pokemonId => {
    return (
      <li className="pokemons__item" key={pokemonId}>
        <Pokemon id={pokemonId} />
      </li>
    )
  })

  return (
    <div className="page">
      {error && <div className="page__error">{error}</div>}
      <div className="page__search">
        <Search onChange={handleSearch} value={searchString} />
      </div>
      {isFetched ? (
        <p>Loading...</p>
      ) : (
          <ul className="pokemons">{pokemons}</ul>
        )}
    </div>
  )
}

export default Page
