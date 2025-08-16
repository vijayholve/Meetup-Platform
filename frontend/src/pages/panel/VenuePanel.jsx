import React from 'react'
import VenueList from '../../components/list/VenueList'
import Header from '../../components/dashboard/Header'

const VenuePanel = () => {

  return (
    <>
    <Header link='/venue/create'  title="Venue " link_text='Create venue' />
    <VenueList/>
    </>
  )
}

export default VenuePanel