/* global daum, kakao */
/* global basicModal, openSidebar,basicModalContentDiv, sidebarContent, closeModal, removeSidebarContent, showStoresInfo */

const createStoreButton = document.getElementById('create-store-button')
const myStoreManagementButton = document.getElementById('my-store-management-button')
const sidebarSearchButton = document.getElementById('search-button')

// & 상품 등록 버튼 클릭
const createProduct = (e) => {
  basicModal.style.display = 'block'

  const { storeId } = e.target.dataset

  const h2 = document.createElement('h2')
  h2.textContent = '상품 등록'
  basicModalContentDiv.appendChild(h2)

  const createProductDiv = document.createElement('div')

  const productImageInput = document.createElement('input')
  productImageInput.type = 'file'
  productImageInput.id = 'product-image'
  productImageInput.name = 'product-image'
  const productImageLabel = document.createElement('label')
  productImageLabel.htmlFor = 'product-image'
  productImageLabel.textContent = '상품 이미지 업로드'
  createProductDiv.appendChild(productImageLabel)
  createProductDiv.appendChild(productImageInput)

  const productNameInput = document.createElement('input')
  productNameInput.type = 'text'
  productNameInput.id = 'product-name'
  productNameInput.name = 'product-name'
  const productNameLabel = document.createElement('label')
  productNameLabel.htmlFor = 'product-name'
  productNameLabel.textContent = '상품 이름'
  createProductDiv.appendChild(productNameLabel)
  createProductDiv.appendChild(productNameInput)

  const productPriceInput = document.createElement('input')
  productPriceInput.type = 'text'
  productPriceInput.id = 'product-price'
  productPriceInput.name = 'product-price'
  const productPriceLabel = document.createElement('label')
  productPriceLabel.htmlFor = 'product-price'
  productPriceLabel.textContent = '상품 가격'
  createProductDiv.appendChild(productPriceLabel)
  createProductDiv.appendChild(productPriceInput)

  const productDescriptionInput = document.createElement('input')
  productDescriptionInput.type = 'text'
  productDescriptionInput.id = 'product-description'
  productDescriptionInput.name = 'product-description'
  const productDescriptionLabel = document.createElement('label')
  productDescriptionLabel.htmlFor = 'product-description'
  productDescriptionLabel.textContent = '상품 설명'
  createProductDiv.appendChild(productDescriptionLabel)
  createProductDiv.appendChild(productDescriptionInput)

  // 상품의 개수
  const productTotalInput = document.createElement('input')
  productTotalInput.type = 'text'
  productTotalInput.id = 'product-total'
  productTotalInput.name = 'product-total'
  const productTotalLabel = document.createElement('label')
  productTotalLabel.htmlFor = 'product-total'
  productTotalLabel.textContent = '매장 내 상품의 개수'
  createProductDiv.appendChild(productTotalLabel)
  createProductDiv.appendChild(productTotalInput)

  const submitCreateProductButton = document.createElement('button')
  submitCreateProductButton.textContent = '상품 등록'

  // & 상품 등록 api 호출
  submitCreateProductButton.addEventListener('click', async () => {
    const name = productNameInput.value
    const price = productPriceInput.value
    const description = productDescriptionInput.value
    const total = productTotalInput.value

    const productImage = productImageInput.files[0]

    try {
      if (!productImage) {
        throw new Error('잠시 후 다시 시도해 주시길 바랍니다.')
      }

      const responsePresignedUrl = await fetch('/manager/presigned-url-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageType: productImage.type, foldername: 'product' }),
      })

      if (!responsePresignedUrl.ok) {
        throw new Error('잠시 후에 다시 시도해 주시길 바랍니다.')
      }

      const { key, presignedUrl } = await responsePresignedUrl.json()

      await fetch(
        presignedUrl,
        { method: 'PUT', body: productImage },
        {
          header: {
            'Content-Type': productImage.type,
          },
        }
      )

      const response = await fetch(`/manager/${storeId}/create-product`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, price, description, total, key }),
      })

      if (!response.ok) {
        throw new Error('잠시 후에 다시 시도해 주시길 바랍니다.')
      }

      alert('상품이 등록되었습니다.')
      closeModal()
    } catch (error) {
      alert('잠시 후에 다시 시도해 주시길 바랍니다.')
    }
  })

  createProductDiv.appendChild(submitCreateProductButton)
  basicModalContentDiv.appendChild(createProductDiv)
}

// & 우편 번호 찾기 버튼 클릭
const showPostalCodePopup = () => {
  new daum.Postcode({
    oncomplete(data) {
      const roadAddr = data.roadAddress // 도로명 주소 변수
      let extraRoadAddr = '' // 참고 항목 변수

      // 법정동명이 있을 경우 추가
      // 법정동의 경우 마지막 문자가 "동/로/가"로 끝남
      if (data.bname !== '' && /[동|로|가]$/g.test(data.bname)) {
        extraRoadAddr += data.bname
      }
      // 건물명이 있고, 공동주택일 경우 추가
      if (data.buildingName !== '' && data.apartment === 'Y') {
        extraRoadAddr += extraRoadAddr !== '' ? `, ${data.buildingName}` : data.buildingName
      }
      // 표시할 참고항목이 있을 경우, 괄호까지 추가한 최종 문자열을 생성
      if (extraRoadAddr !== '') {
        extraRoadAddr = ` (${extraRoadAddr})`
      }

      // 우편번호와 주소 정보를 해당 필드에 삽입
      document.getElementById('postcode').value = data.zonecode
      document.getElementById('roadAddress').value = roadAddr
      document.getElementById('jibunAddress').value = data.jibunAddress

      // 참고항목 문자열이 있을 경우 해당 필드에 삽입
      if (roadAddr !== '') {
        document.getElementById('extraAddress').value = extraRoadAddr
      } else {
        document.getElementById('extraAddress').value = ''
      }
    },
  }).open()
}

// & 신규 스토어 등록 버튼
if (createStoreButton) {
  createStoreButton.addEventListener('click', async () => {
    basicModal.style.display = 'block'

    const h2 = document.createElement('h2')
    h2.textContent = '신규 스토어 등록'
    basicModalContentDiv.appendChild(h2)

    const newStoreDiv = document.createElement('div')

    const storeImageInput = document.createElement('input')
    storeImageInput.type = 'file'
    storeImageInput.id = 'store-image'
    storeImageInput.name = 'store-image'
    const storeImageLabel = document.createElement('label')
    storeImageLabel.htmlFor = 'store-image'
    storeImageLabel.textContent = '스토어 이미지 업로드'
    newStoreDiv.appendChild(storeImageLabel)
    newStoreDiv.appendChild(storeImageInput)

    const storeNameInput = document.createElement('input')
    storeNameInput.type = 'text'
    storeNameInput.id = 'store-name'
    storeNameInput.name = 'store-name'
    const storeNameLabel = document.createElement('label')
    storeNameLabel.htmlFor = 'store-name'
    storeNameLabel.textContent = '스토어 이름'
    newStoreDiv.appendChild(storeNameLabel)
    newStoreDiv.appendChild(storeNameInput)

    const storeCategoryInput = document.createElement('input')
    storeCategoryInput.type = 'text'
    storeCategoryInput.id = 'store-category'
    storeCategoryInput.name = 'store-category'
    const storeCategoryLabel = document.createElement('label')
    storeCategoryLabel.htmlFor = 'store-category'
    storeCategoryLabel.textContent = '카테고리'
    newStoreDiv.appendChild(storeCategoryLabel)
    newStoreDiv.appendChild(storeCategoryInput)

    const storePhoneInput = document.createElement('input')
    storePhoneInput.type = 'text'
    storePhoneInput.id = 'store-phone'
    storePhoneInput.name = 'store-phone'
    const storePhoneLabel = document.createElement('label')
    storePhoneLabel.htmlFor = 'store-phone'
    storePhoneLabel.textContent = '전화 번호'
    newStoreDiv.appendChild(storePhoneLabel)
    newStoreDiv.appendChild(storePhoneInput)

    const storeBrandInput = document.createElement('input')
    storeBrandInput.type = 'text'
    storeBrandInput.id = 'store-brand'
    storeBrandInput.name = 'store-brand'
    storeBrandInput.placeholder = '개인 사업자의 경우 없어도 됩니다.'
    const storeBrandLabel = document.createElement('label')
    storeBrandLabel.htmlFor = 'store-brand'
    storeBrandLabel.textContent = '브랜드명'
    newStoreDiv.appendChild(storeBrandLabel)
    newStoreDiv.appendChild(storeBrandInput)

    // 우편번호 찾기 버튼 생성
    const postalCodeSearchButton = document.createElement('button')
    postalCodeSearchButton.textContent = '우편번호 찾기'
    postalCodeSearchButton.addEventListener('click', showPostalCodePopup)
    newStoreDiv.appendChild(postalCodeSearchButton)

    // 우편번호 입력 필드 생성
    const postcodeInput = document.createElement('input')
    postcodeInput.type = 'text'
    postcodeInput.id = 'postcode'
    postcodeInput.placeholder = '우편번호'
    newStoreDiv.appendChild(postcodeInput)

    // 도로명주소 입력 필드 생성
    const roadAddressInput = document.createElement('input')
    roadAddressInput.type = 'text'
    roadAddressInput.id = 'roadAddress'
    roadAddressInput.placeholder = '도로명주소'
    newStoreDiv.appendChild(roadAddressInput)

    // 지번주소 입력 필드 생성
    const jibunAddressInput = document.createElement('input')
    jibunAddressInput.type = 'text'
    jibunAddressInput.id = 'jibunAddress'
    jibunAddressInput.placeholder = '지번주소'
    newStoreDiv.appendChild(jibunAddressInput)

    // 상세주소 입력 필드 생성
    const detailAddressInput = document.createElement('input')
    detailAddressInput.type = 'text'
    detailAddressInput.id = 'detailAddress'
    detailAddressInput.placeholder = '상세주소'
    newStoreDiv.appendChild(detailAddressInput)

    // 참고항목 입력 필드 생성
    const extraAddressInput = document.createElement('input')
    extraAddressInput.type = 'text'
    extraAddressInput.id = 'extraAddress'
    extraAddressInput.placeholder = '참고항목'
    newStoreDiv.appendChild(extraAddressInput)

    const submitCreateStoreButton = document.createElement('button')
    submitCreateStoreButton.textContent = '등록'

    // & 신규 스토어 등록 api 호출
    submitCreateStoreButton.addEventListener('click', async () => {
      const storeName = storeNameInput.value
      const category = storeCategoryInput.value
      const phone = storePhoneInput.value
      const brand = storeBrandInput.value

      const postCode = postcodeInput.value
      const roadAddress = roadAddressInput.value
      const jibunAddress = jibunAddressInput.value
      const detailAddress = detailAddressInput.value
      const extraAddress = extraAddressInput.value

      const storeImage = storeImageInput.files[0]

      const geocoder = new kakao.maps.services.Geocoder()

      let lat = null
      let lng = null
      geocoder.addressSearch(roadAddressInput.value, async (result, status) => {
        try {
          if (!storeImage) {
            throw new Error('잠시 후 다시 시도해 주시길 바랍니다.')
          }

          if (status === kakao.maps.services.Status.OK) {
            // 좌표 확인
            lat = result[0].y
            lng = result[0].x
          } else {
            throw new Error('주소를 다시 입력해주시길 바랍니다.')
          }

          const responsePresignedUrl = await fetch('/manager/presigned-url-image', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ imageType: storeImage.type, foldername: 'store' }),
          })

          if (!responsePresignedUrl.ok) {
            throw new Error('잠시 후에 다시 시도해 주시길 바랍니다.')
          }

          const { key, presignedUrl } = await responsePresignedUrl.json()

          await fetch(
            presignedUrl,
            { method: 'PUT', body: storeImage },
            {
              header: {
                'Content-Type': storeImage.type,
              },
            }
          )

          const response = await fetch('/manager/create-store', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              storeName,
              category,
              phone,
              brand,
              postCode,
              roadAddress,
              jibunAddress,
              detailAddress,
              extraAddress,
              lat,
              lng,
              key,
            }),
          })

          if (!response.ok) {
            throw new Error('잠시 후에 다시 시도해 주시길 바랍니다.')
          }

          alert('신규 스토어가 등록되었습니다.')
          closeModal()
        } catch (error) {
          alert('잠시 후에 다시 시도해 주시길 바랍니다.')
        }
      })
    })

    newStoreDiv.appendChild(submitCreateStoreButton)
    basicModalContentDiv.appendChild(newStoreDiv)
  })
}

// & 스토어 삭제 버튼 클릭
const deleteStore = async (e) => {
  const { storeId } = e.target.dataset
  try {
    const response = await fetch(`/manager/${storeId}`, { method: 'delete' })

    if (!response.ok) {
      throw new Error('잠시 후에 다시 시도해 주시길 바랍니다.')
    }
    removeSidebarContent()
    alert('삭제 완료되었습니다.')
  } catch (error) {
    alert('잠시 후에 다시 시도해 주시길 바랍니다.')
  }
}

// & 만약 사용자가 스토어의 매니저인 경우 상품 수정을 위한 클릭
const getProductInfo = async (storeId, productId) => {
  try {
    const response = await fetch(`/manager/${storeId}/product/${productId}`)

    if (!response.ok) {
      throw new Error('잠시 후에 다시 시도해 주시길 바랍니다.')
    }

    const responseData = await response.json()
    basicModal.style.display = 'block'

    const h2 = document.createElement('h2')
    h2.textContent = '상품 수정'
    basicModalContentDiv.appendChild(h2)

    const editProductDiv = document.createElement('div')

    const productNameInput = document.createElement('input')
    productNameInput.type = 'text'
    productNameInput.id = 'product-name'
    productNameInput.name = 'product-name'
    productNameInput.value = responseData.name
    const productNameLabel = document.createElement('label')
    productNameLabel.htmlFor = 'product-name'
    productNameLabel.textContent = '상품 이름'
    editProductDiv.appendChild(productNameLabel)
    editProductDiv.appendChild(productNameInput)

    const productPriceInput = document.createElement('input')
    productPriceInput.type = 'text'
    productPriceInput.id = 'product-price'
    productPriceInput.name = 'product-price'
    productPriceInput.value = responseData.price
    const productPriceLabel = document.createElement('label')
    productPriceLabel.htmlFor = 'product-price'
    productPriceLabel.textContent = '상품 가격'
    editProductDiv.appendChild(productPriceLabel)
    editProductDiv.appendChild(productPriceInput)

    const productDescriptionInput = document.createElement('input')
    productDescriptionInput.type = 'text'
    productDescriptionInput.id = 'product-description'
    productDescriptionInput.name = 'product-description'
    productDescriptionInput.value = responseData.description
    const productDescriptionLabel = document.createElement('label')
    productDescriptionLabel.htmlFor = 'product-description'
    productDescriptionLabel.textContent = '상품 설명'
    editProductDiv.appendChild(productDescriptionLabel)
    editProductDiv.appendChild(productDescriptionInput)

    const productTotalInput = document.createElement('input')
    productTotalInput.type = 'text'
    productTotalInput.id = 'product-total'
    productTotalInput.name = 'product-total'
    productTotalInput.value = responseData.total
    const productTotalLabel = document.createElement('label')
    productTotalLabel.htmlFor = 'product-total'
    productTotalLabel.textContent = '매장 내 상품의 개수'
    editProductDiv.appendChild(productTotalLabel)
    editProductDiv.appendChild(productTotalInput)

    const submitEditProductButton = document.createElement('button')
    submitEditProductButton.textContent = '상품 수정'

    // & 상품 수정 api 호출
    submitEditProductButton.addEventListener('click', async () => {
      const name = productNameInput.value
      const price = productPriceInput.value
      const description = productDescriptionInput.value
      const total = productTotalInput.value

      try {
        const responseEditProduct = await fetch(`/manager/${storeId}/product/${productId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, price, description, total }),
        })

        if (responseEditProduct.ok) {
          throw new Error('잠시 후에 다시 시도해 주시길 바랍니다.')
        }

        alert('상품이 수정되었습니다.')
        closeModal()
      } catch (error) {
        alert('잠시 후에 다시 시도해 주시길 바랍니다.')
      }
    })

    editProductDiv.appendChild(submitEditProductButton)

    const submitDeleteProductButton = document.createElement('button')
    submitDeleteProductButton.textContent = '상품 삭제'

    // & 상품 삭제 api 호출
    submitDeleteProductButton.addEventListener('click', async () => {
      try {
        // eslint-disable-next-line no-shadow
        const response = await fetch(`/manager/${storeId}/product/${productId}`, {
          method: 'DELETE',
        })

        if (!response.ok) {
          throw new Error('잠시 후에 다시 시도해 주시길 바랍니다.')
        }

        alert('상품이 삭제되었습니다.')
        closeModal()
      } catch (error) {
        alert('잠시 후에 다시 시도해 주시길 바랍니다.')
      }
    })
    editProductDiv.appendChild(submitDeleteProductButton)

    basicModalContentDiv.appendChild(editProductDiv)
  } catch (error) {
    alert('잠시 후에 다시 시도해 주시길 바랍니다.')
  }
}

// & 나의 스토어 관리 버튼 클릭
if (myStoreManagementButton) {
  myStoreManagementButton.addEventListener('click', async () => {
    try {
      const response = await fetch('/manager/management')

      if (!response.ok) {
        throw new Error('잠시 후에 다시 시도해 주시길 바랍니다.')
      }
      removeSidebarContent()

      const responseData = await response.json()

      showStoresInfo(responseData.stores)
    } catch (error) {
      alert('잠시 후에 다시 시도해 주시길 바랍니다.')
    }
  })
}

// & 사이드바에 스토어 정보 표시
// eslint-disable-next-line no-unused-vars
const showStoreInfoSidebar = async (storeId) => {
  removeSidebarContent()
  try {
    const response = await fetch(`/store/${storeId}`)

    if (!response.ok) {
      throw new Error('잠시 후에 다시 시도해 주시길 바랍니다.')
    }

    const responseData = await response.json()

    removeSidebarContent()

    if (responseData.isManager) {
      const storeManagementDiv = document.createElement('div')
      storeManagementDiv.classList.add('store-management-button-container')

      const createProductButton = document.createElement('button')
      createProductButton.textContent = '상품 등록'
      createProductButton.dataset.storeId = storeId
      createProductButton.classList.add('store-management-button')
      createProductButton.addEventListener('click', createProduct)

      const deleteStoreButton = document.createElement('button')
      deleteStoreButton.textContent = '스토어 삭제'
      deleteStoreButton.dataset.storeId = storeId
      deleteStoreButton.classList.add('store-management-button')
      deleteStoreButton.addEventListener('click', deleteStore)

      storeManagementDiv.appendChild(createProductButton)
      storeManagementDiv.appendChild(deleteStoreButton)

      sidebarContent.appendChild(storeManagementDiv)
    }

    const storeDiv = document.createElement('div')
    storeDiv.classList.add('sidebar-list')

    // 상품 정보
    responseData.products.forEach((product) => {
      const productDiv = document.createElement('div')
      productDiv.classList.add('sidebar-info')

      const productImg = document.createElement('img')
      productImg.alt = '상품 이미지'
      productImg.src = product.image.url
      productDiv.appendChild(productImg)

      const productName = document.createElement('h3')
      productName.textContent = product.name
      productDiv.appendChild(productName)

      const infoUl = document.createElement('ul')

      const price = document.createElement('li')
      price.textContent = `${product.price}원`
      infoUl.appendChild(price)

      const total = document.createElement('li')
      total.textContent = `매장 내 ${product.total}개 남아 있음`
      infoUl.appendChild(total)

      const description = document.createElement('li')
      description.textContent = `${product.description}`
      infoUl.appendChild(description)

      productDiv.appendChild(infoUl)

      if (responseData.isManager) {
        productDiv.addEventListener('click', () => {
          getProductInfo(storeId, product._id)
        })
      }

      storeDiv.appendChild(productDiv)
    })
    sidebarContent.appendChild(storeDiv)
  } catch (error) {
    alert('잠시 후에 다시 시도해 주시길 바랍니다.')
  }
  openSidebar()
}

// & 사이드바의 검색
sidebarSearchButton.addEventListener('click', async () => {
  const searchInput = document.getElementById('search-input').value
  const searchOption = document.getElementById('search-option').value

  try {
    const response = await fetch(`/store/search?searchInput=${encodeURIComponent(searchInput)}&searchOption=${encodeURIComponent(searchOption)}`)

    if (!response.ok) {
      throw new Error('잠시 후에 다시 시도해 주시길 바랍니다.')
    }

    const responseData = await response.json()

    removeSidebarContent()
    showStoresInfo(responseData.stores)
  } catch (error) {
    alert('잠시 후에 다시 시도해 주시길 바랍니다.')
  }
})
