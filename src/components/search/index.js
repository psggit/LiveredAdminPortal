import React, {useState, useEffect} from 'react'
import './search.scss'
import Icon from './../icon'

const Search = ({searchText, clearSearch, search, placeholder}) => {
  const [searchQuery, setSearchQueryText] = useState("")

  useEffect(() => {
    console.log("serach tex", searchText)
    setSearchQueryText(searchText ? searchText : "")
  }, [searchText])

  const clearSearchText = () => {
    setSearchQueryText("")
    clearSearch()
  }

  const setSearchQuery = (e) => {
    console.log("tes", e.target.value)
    setSearchQueryText(e.target.value)
    if(!e.target.value.length) {
      clearSearchText()
    }
  }

  const handleSearch = (e) => {
    if (e.keyCode === 13 && searchQuery.length) {
      search(searchQuery)
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
        placeholder={placeholder} 
        value={searchQuery}
        onChange={(e) => setSearchQuery(e)}
        onKeyDown={(e) => handleSearch(e)}
      />
      {
        searchQuery ? 
        <span className="search-icon cross" onClick={clearSearchText}>
          <Icon name="cross" />
        </span> : 
        ''
      }
    </div>
  )
}

export default Search