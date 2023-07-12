/* global kakao,map */
/* global showMarker, sidebarContent, removeSidebarContent, showStoreInfoSidebar  */

const searchStoreOnMapButton = document.getElementById('search-store-on-map-button')

// & 스토어 정보 클릭 시 지도 이동 및 정보 표시
const clickStoreInfo = async (e) => {
  const { lat, lng, storeId } = e.currentTarget.dataset
  map.panTo(new kakao.maps.LatLng(lat, lng))
  setTimeout(showMarker, 500)
  showStoreInfoSidebar(storeId)
}

// & 여러 스토어들의 정보를 사이드바에 표시
const showStoresInfo = (stores) => {
  const storeListDiv = document.createElement('div')
  storeListDiv.classList.add('sidebar-list')

  stores.forEach((store) => {
    const storeInfoDiv = document.createElement('div')
    storeInfoDiv.classList.add('sidebar-info')
    storeInfoDiv.classList.add('store-sidebar-info')

    const storeImg = document.createElement('img')
    storeImg.alt = '스토어 이미지'
    storeImg.src = store.image.url
    storeInfoDiv.appendChild(storeImg)

    const storeNameDiv = document.createElement('div')
    storeNameDiv.classList.add('name-category')

    const storeName = document.createElement('h3')
    storeName.textContent = store.name

    const category = document.createElement('p')
    category.classList.add('category')
    category.textContent = store.category
    storeNameDiv.appendChild(storeName)
    storeNameDiv.appendChild(category)
    storeInfoDiv.appendChild(storeNameDiv)

    const manager = document.createElement('p')
    manager.textContent = `스토어 매니저 : ${store.managerName}`
    storeInfoDiv.appendChild(manager)

    const brand = document.createElement('p')
    brand.textContent = `브랜드 : ${store.brand}`
    storeInfoDiv.appendChild(brand)

    const location = document.createElement('p')
    location.textContent = `위치 : ${store.location.address.roadAddress}`
    storeInfoDiv.appendChild(location)

    const phone = document.createElement('p')
    phone.textContent = `전화번호 : ${store.phone}`
    storeInfoDiv.appendChild(phone)

    storeInfoDiv.dataset.storeId = store._id
    storeInfoDiv.dataset.lat = store.location.lat
    storeInfoDiv.dataset.lng = store.location.lng

    storeInfoDiv.addEventListener('click', clickStoreInfo)
    storeListDiv.appendChild(storeInfoDiv)
  })
  sidebarContent.appendChild(storeListDiv)
}

// & 현재 위치의 스토어 정보를 지도에 표시 및 사이드바에 표시
const showStoreOnCurrentMap = async () => {
  // 마커 표시
  showMarker()

  const bounds = map.getBounds()
  const swLatLng = bounds.getSouthWest()
  const neLatLng = bounds.getNorthEast()

  // 초기 스토어 리스트 출력
  try {
    const response = await fetch(`/store/store-location?swLat=${swLatLng.Ma}&swLng=${swLatLng.La}&neLat=${neLatLng.Ma}&neLng=${neLatLng.La}`)
    if (!response.ok) {
      throw new Error('잠시 후에 다시 시도해 주시길 바랍니다.')
    }

    const responseData = await response.json()
    removeSidebarContent()
    showStoresInfo(responseData.stores)
  } catch (error) {
    alert('잠시 후에 다시 시도해 주시길 바랍니다.')
  }
}

searchStoreOnMapButton.addEventListener('click', () => {
  showStoreOnCurrentMap()
})

window.addEventListener('DOMContentLoaded', async () => {
  showStoreOnCurrentMap()
})
