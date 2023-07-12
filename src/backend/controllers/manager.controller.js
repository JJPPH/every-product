// eslint-disable-next-line import/no-extraneous-dependencies
const { PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3')
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner')
const { v4: uuid } = require('uuid')
require('dotenv').config()

const s3Client = require('../aws')

const Product = require('../schemas/product.schema')
const Store = require('../schemas/store.schema')

const createPresignedUrlWithClient = async (key) => {
  const command = new PutObjectCommand({ Bucket: process.env.AWS_S3_BUCKET_NAME, Key: key })
  const presignedUrl = await getSignedUrl(s3Client, command, { expiresIn: 300 })
  return presignedUrl
}

exports.createPresignedUrl = async (req, res, next) => {
  const { foldername, imageType } = req.body
  try {
    const key = `${foldername}/${uuid()}.${imageType.split('/')[1]}`
    const presignedUrl = await createPresignedUrlWithClient(key)
    return res.json({ key, presignedUrl })
  } catch (error) {
    return next(error)
  }
}

exports.createStore = async (req, res, next) => {
  const { storeName, category, phone, brand, postCode, roadAddress, jibunAddress, detailAddress, extraAddress, lat, lng, key } = req.body

  try {
    await Store.create({
      name: storeName,
      category,
      phone,
      brand,
      location: {
        address: { postCode, roadAddress, jibunAddress, detailAddress, extraAddress },
        lat,
        lng,
      },
      administratorId: req.user._id,
      managerName: req.user.username,
      image: {
        key,
        url: `${process.env.CDN_URL}/${key}`,
      },
    })

    res.json({ msg: '스토어가 등록되었습니다.' })
  } catch (error) {
    next(error)
  }
}

exports.getAllStoresManagement = async (req, res, next) => {
  try {
    const stores = await Store.find({ administratorId: req.user._id })

    res.json({ stores })
  } catch (error) {
    next(error)
  }
}

exports.createProduct = async (req, res, next) => {
  const { name, price, description, total, key } = req.body
  const { storeId } = req.params

  try {
    const store = await Store.findById(storeId)

    if (!store.administratorId.equals(req.user._id)) {
      return res.status(403).json({ msg: '권한이 없습니다.' })
    }

    await Product.create({
      name,
      price,
      description,
      total,
      storeId,
      image: {
        key,
        url: `${process.env.CDN_URL}/${key}`,
      },
    })

    return res.json({ msg: '상품이 등록되었습니다.' })
  } catch (error) {
    return next(error)
  }
}

exports.deleteStore = async (req, res, next) => {
  const { storeId } = req.params

  try {
    const store = await Store.findByIdAndDelete(storeId)

    if (!store.administratorId.equals(req.user._id)) {
      return res.status(403).json({ msg: '권한이 없습니다.' })
    }

    let inputCommand = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: store.image.key,
    }
    let command = new DeleteObjectCommand(inputCommand)
    await s3Client.send(command)

    const deletedProducts = await Product.find({ storeId })

    // eslint-disable-next-line no-restricted-syntax
    for (const product of deletedProducts) {
      inputCommand = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: product.image.key,
      }
      command = new DeleteObjectCommand(inputCommand)
      // eslint-disable-next-line no-await-in-loop
      await s3Client.send(command)
    }

    await Product.deleteMany({ storeId })

    return res.json({ msg: '스토어가 삭제되었습니다.' })
  } catch (error) {
    return next(error)
  }
}

exports.getProduct = async (req, res, next) => {
  const { storeId, productId } = req.params

  try {
    const product = await Product.findById(productId)

    if (!product.storeId.equals(storeId)) {
      return res.status(404).json({ msg: '해당 상품을 찾을 수 없습니다.' })
    }

    return res.json({
      name: product.name,
      price: product.price,
      description: product.description,
      total: product.total,
      msg: '해당 상품을 조회하였습니다.',
    })
  } catch (error) {
    return next(error)
  }
}

exports.editProduct = async (req, res, next) => {
  const { storeId, productId } = req.params

  const { name, price, description, total } = req.body
  try {
    const product = await Product.findById(productId)

    if (!product.storeId.equals(storeId)) {
      return res.status(404).json({ msg: '해당 상품을 찾을 수 없습니다.' })
    }

    const store = await Store.findById(storeId)

    if (!store.administratorId.equals(req.user._id)) {
      return res.status(403).json({ msg: '권한이 없습니다.' })
    }

    product.name = name
    product.price = price
    product.description = description
    product.total = total
    await product.save()

    return res.json({ msg: '해당 상품이 수정되었습니다.' })
  } catch (error) {
    return next(error)
  }
}

exports.deleteProduct = async (req, res, next) => {
  const { storeId, productId } = req.params

  try {
    const product = await Product.findByIdAndRemove(productId)

    if (!product.storeId.equals(storeId)) {
      return res.status(404).json({ msg: '해당 상품을 찾을 수 없습니다.' })
    }

    const store = await Store.findById(storeId)

    if (!store.administratorId.equals(req.user._id)) {
      return res.status(403).json({ msg: '권한이 없습니다.' })
    }

    const inputCommand = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: product.image.key,
    }
    const command = new DeleteObjectCommand(inputCommand)
    await s3Client.send(command)
    return res.json({ msg: '해당 상품이 삭제되었습니다.' })
  } catch (error) {
    return next(error)
  }
}
