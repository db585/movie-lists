import React, { Component } from 'react'
import '../css/style.css'
import { Redirect, Link } from 'react-router-dom'
import { withRouter } from 'react-router'
import { FacebookShareButton, TwitterShareButton } from 'react-share'

import '../css/MakeList.css'
import { connect } from 'react-redux'
import axios from 'axios'
import App from '../App.js'
import Modal from 'react-modal'

class SearchListResults extends Component {
  constructor(props) {
    super(props)
    this.state = { searchQuery: '', results: [] }
    this.startSearch = this.startSearch.bind(this)
    this.displayTags = this.displayTags.bind(this)
  }
  startSearch() {
    let that = this
    console.log('getting item id')
    let path = window.location.pathname
    console.log('path', path)
    let pathArr = path.split('/')
    console.log('pathArr', pathArr)
    let tail = pathArr[pathArr.length - 1]
    console.log('tail', tail)
    // this.setState({ searchQuery: searchQuery });
    let searchQueryArr = tail.split('%20')
    let searchQuery = searchQueryArr.join(' ')

    console.log('searchQueryArr', searchQueryArr)
    console.log('searchQuery', searchQuery)
    console.log('Fetching from endpoint lists/wildSearch')
    axios({
      method: 'post',
      url: '/api/lists/wildsearch',
      data: { search: searchQuery }
    }).then(response => {
      console.log('response', response)
      if (searchQuery !== that.state.searchQuery) {
        that.setState({
          results: response.data.sortedRankedLists,
          searchQuery: searchQuery
        })
      }
    })
  }
  displayTags(tagList) {
    let that = this
    return tagList.split(' ^^ ').map((elem, index) => {
      return (
        <Link to={'/searchtags/' + elem}>
          <span className>
            {elem}
            <span name={index} className="fas fa-tag" />
          </span>
        </Link>
      )
    })
  }

  displayResults() {
    //results is an array of lists
    console.log('displaying results')
    let resultsToDom = elem => {
      return (
        <li>
          <Link to={'/lists/' + elem._id}>
            <div>{elem.name}</div>
          </Link>
          <FacebookShareButton
            url={window.location.origin + '/lists/' + elem._id}
            className={'fab fa-facebook'}
          />
          <TwitterShareButton
            url={window.location.origin + '/lists/' + elem._id}
            className={'fab fa-twitter-square'}
          />
          <div>{elem.description}</div>
          <span>Tags: </span>
          <span>{this.displayTags(elem.tags)}</span>
        </li>
      )
    }
    return this.state.results.map(resultsToDom)
  }

  render() {
    window.onhashchange = () => {
      this.startSearch()
    }
    this.startSearch()
    return (
      <ol onhashchange={window.onhashchange}>
        There are no results by that name
        {this.displayResults()}
      </ol>
    )
  }
}

export default SearchListResults
