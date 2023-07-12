const mongoose = require('mongoose')

const Store = require('../schemas/store.schema')
const Product = require('../schemas/product.schema')

exports.getStoreLocation = async (req, res, next) => {
  try {
    const { swLat, swLng, neLat, neLng } = req.query
    const stores = await Store.find({
      'location.lat': { $gt: swLat, $lt: neLat },
      'location.lng': { $gt: swLng, $lt: neLng },
    })

    return res.json({ stores, msg: '현재 위치의 스토어를 조회하였습니다.' })
  } catch (error) {
    return next(error)
  }
}

exports.getStoreInfo = async (req, res, next) => {
  try {
    const { storeId } = req.params

    if (!mongoose.Types.ObjectId.isValid(storeId)) {
      return res.status(400).json({ msg: '잘못된 형식의 id입니다.' })
    }

    const store = await Store.findById(storeId)

    if (!store) {
      return res.status(404).json({ msg: '해당 스토어는 없는 스토어입니다.' })
    }

    const products = await Product.find({ storeId })

    let isManager = false
    if (req.user && store.administratorId.equals(req.user._id)) {
      isManager = true
    }

    return res.json({ store, products, isManager, msg: '스토어 정보를 성공적으로 조회하였습니다.' })
  } catch (error) {
    return next(error)
  }
}

exports.getStoreSearch = async (req, res, next) => {
  try {
    const { searchInput, searchOption } = req.query

    let stores
    if (searchOption === 'category' || searchOption === 'brand') {
      const query = {}
      query[searchOption] = { $regex: searchInput }
      stores = await Store.find(query)
    } else {
      stores = await Store.find({ 'location.address.roadAddress': { $regex: searchInput } })
    }

    return res.json({ stores, msg: '해당 조건의 스토어를 조회하였습니다.' })
  } catch (error) {
    return next(error)
  }
}
