import React from 'react'
import Header from '../../components/dashboard/Header'
import CategoryList from '../../components/list/CategoryList'

const CategoryPanel = () => {

  return (
    <>
    <Header link='/category/create'  title="Category " link_text='Create category' />
    <CategoryList/>
    </>
  )
}

export default CategoryPanel