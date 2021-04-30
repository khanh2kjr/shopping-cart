import { Box, Container, Grid, makeStyles, Paper, Typography } from '@material-ui/core'
import productApi from 'api/productApi'
import ProductSkeletonList from 'features/Product/components/ProductSkeletonList'
import React, { useEffect, useState } from 'react'
import ProductFilter from '../components/ProductFilter'
import ProductList from '../components/ProductList'
import ProductPagination from '../components/ProductPagination'
import ProductSort from '../components/ProductSort'
import FilterViewer from './../components/FilterViewer';

const useStyles = makeStyles((theme) => ({
  root: {},
  left: {
    width: '360px'
  },
  right: {
    flex: '1 1 0'
  },
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '20px'
  },
  pb20: {
    paddingBottom: '20px'
  },
  filterByCategory: {
    backgroundColor: '#CCCCCC',
    display: 'inline-block',
    padding: '5px',
    borderRadius: '5px',
    marginLeft: theme.spacing(2),
    marginTop: theme.spacing(2),
    '& > span': {
      marginLeft: theme.spacing(1),
      verticalAlign: 'middle'
    },
    '& > svg': {
      marginLeft: theme.spacing(1),
      verticalAlign: 'middle',
      cursor: 'pointer'
    }
  },
  productIsNull: {
    textAlign: 'center',
    fontSize: '1.2rem',
    marginTop: theme.spacing(1)
  }
}))

export default function ListPage() {
  const classes = useStyles()

  const [productList, setProductList] = useState([])
  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    _page: 1,
    _limit: 8,
    _sort: 'salePrice:ASC'
  })
  const [pagination, setPagination] = useState({
    limit: 8,
    total: 10,
    page: 1
  })
  
  useEffect(() => {
    const fetchProductList = async () => {
      try {
        const response = await productApi.getAll(filters)
        const { data, pagination } = response
        const count = data.length

        setProductList(data)
        setPagination(pagination)
        setCount(count)
        setLoading(false)
      } catch (error) {
        console.log('Failed to fetch product list: ', error)
      }
    }

    fetchProductList()
  }, [filters])

  const renderNewFilters = (filters, newParam, newValueParam) => {
    return {
      ...filters,
      [newParam]: newValueParam
    }
  }

  const handlePageChange = (newPage) => {
    const newFilters = renderNewFilters(filters, '_page', newPage)

    setFilters(newFilters)
  }

  const handleSortChange = (newSort) => {
    const newFilters = renderNewFilters(filters, '_sort', newSort)

    setFilters(newFilters)
  }

  const handleFilterChange = (newFilters) => {
    setFilters({
      ...filters,
      ...newFilters
    })
  }

  const handleViewerChange = (newValues) => {
    setFilters(newValues)
  }

  return (
    <Box>
      <Container>
        <Grid container spacing={1}>
          <Grid className={classes.left} item>
            <Paper elevation={0}>
              <ProductFilter filters={filters} onFilterChange={handleFilterChange} />
            </Paper>
          </Grid>
          <Grid className={classes.right} item>
            <Paper elevation={0} className={classes.pb20}>
              <Box>
                <ProductSort
                  onSortChange={handleSortChange}
                  currentSort={filters._sort}
                />
                <FilterViewer filters={filters} onViewerChange={handleViewerChange} />
              </Box>
              {!count && !loading ? (
                <Typography className={classes.productIsNull}>
                  Không có sản phẩm tương ứng
                </Typography>
              ) : (
                ''
              )}
              {loading ? (
                <ProductSkeletonList length={pagination.limit} />
              ) : (
                <ProductList productList={productList} />
              )}
              <Box className={classes.pagination}>
                <ProductPagination
                  count={Math.ceil(pagination.total / pagination.limit)}
                  page={pagination.page}
                  onPageChange={handlePageChange}
                />
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}
