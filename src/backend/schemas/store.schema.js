const mongoose = require('mongoose')

const StoreSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    location: {
      address: {
        postCode: {
          type: Number,
          required: true,
        },
        roadAddress: {
          type: String,
          required: true,
        },
        jibunAddress: {
          type: String,
          required: true,
        },
        detailAddress: {
          type: String,
          required: true,
        },
        extraAddress: {
          type: String,
        },
      },
      lat: {
        type: Number,
        required: true,
      },
      lng: {
        type: Number,
        required: true,
      },
    },
    phone: {
      type: String,
      required: true,
    },
    image: {
      key: {
        type: String,
      },
      url: {
        type: String,
      },
    },
    category: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      required: false,
      default: '',
    },
    administratorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    managerName: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Store', StoreSchema)
