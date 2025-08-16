import React from 'react'
import CityList from '../../components/list/CityList'
import Header from '../../components/dashboard/Header'

const CityPanel = () => {

  return (
    <>
    <Header link='/city/create'  title="City " link_text='Create city' />
    <CityList/>
    </>
  )
}

export default CityPanel