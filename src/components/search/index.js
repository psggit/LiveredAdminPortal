import React, { useState, useEffect } from 'react'
import './search.scss'
import Icon from './../icon'

const Search = (props) => {
  console.log("props", props)
  //const [searchQuery, setSearchQueryText] = useState("")

  // useEffect(() => {
  //   console.log("serach tex", searchText)
  //   setSearchQueryText(searchText ? searchText : "")
  // }, [searchText])

  // const clearSearchText = () => {
  //   setSearchQueryText("")
  //   clearSearch()
  // }

  // const setSearchQuery = (e) => {
  //   console.log("tes", e.target.value)
  //   setSearchQueryText(e.target.value)
  //   if (!e.target.value.length) {
  //     clearSearchText()
  //   }
  // }

  const handleSearch = (e) => {
    console.log("keycode", e.which, e.keycode)
    if (e.keyCode === 13) {
      props.handleSearch()
    }
  }

  return (
    <div className="search--box">
      <span
        className="search-icon search"
        onClick={(e) => handleSearch(e)}
      >
        <Icon name="search" />
      </span>
      <input
        placeholder={props.placeholder}
        value={props.searchText}
        onChange={(e) => props.setSearchText(e.target.value)}
        onKeyDown={(e) => handleSearch(e)}
      />
      {
        props.searchText ?
          <span className="search-icon cross" onClick={() => props.clearSearch()}>
            <Icon name="cross" />
          </span> :
          ''
      }
    </div>
  )
}

export default Search