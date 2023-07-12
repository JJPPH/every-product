/* global kakao */

/* global showStoreInfoSidebar */

// & 스토어의 마커
let storeMarkers = []

const mapContainer = document.getElementById('map')
const mapOption = {
  center: new kakao.maps.LatLng(37.5054526406193, 126.959677678275),
  level: 3,
}

const map = new kakao.maps.Map(mapContainer, mapOption)

// & 지도 마커 클릭 시 이벤트 함수 반환
const getMarkerClickEventFunction = (storeId) => {
  return async () => {
    showStoreInfoSidebar(storeId)
  }
}

// & 가게 마커 정보 api 호출 및 마커 표시
const showMarker = async () => {
  const bounds = map.getBounds()

  const swLatLng = bounds.getSouthWest()
  const neLatLng = bounds.getNorthEast()
  try {
    const response = await fetch(`/store/store-location?swLat=${swLatLng.Ma}&swLng=${swLatLng.La}&neLat=${neLatLng.Ma}&neLng=${neLatLng.La}`)
    const responseData = await response.json()

    // 각 마커의 클릭 이벤트 리스너 제거 및 숨김
    for (let i = 0; i < storeMarkers.length; i += 1) {
      storeMarkers[i].setMap(null)
    }

    storeMarkers = []
    for (let i = 0; i < responseData.stores.length; i += 1) {
      // 마커를 생성
      const marker = new kakao.maps.Marker({
        map, // 마커를 표시할 지도
        position: new kakao.maps.LatLng(responseData.stores[i].location.lat, responseData.stores[i].location.lng), // 마커를 표시할 위치
      })

      marker.setMap(map)

      const infoWindow = new kakao.maps.InfoWindow({
        content: `<div class="info-window">${responseData.stores[i].name}</div>`,
      })

      kakao.maps.event.addListener(marker, 'mouseover', () => {
        infoWindow.open(map, marker)
      })

      kakao.maps.event.addListener(marker, 'mouseout', () => {
        infoWindow.close()
      })

      const storeMakerClickEventListener = getMarkerClickEventFunction(responseData.stores[i]._id)

      kakao.maps.event.addListener(marker, 'click', storeMakerClickEventListener)
      storeMarkers.push(marker)
    }
  } catch (error) {
    alert('잠시 후에 다시 시도해 주시길 바랍니다.')
  }
}

// & 지도 드래그 시 해당 영역의 스토어 조회
kakao.maps.event.addListener(map, 'dragend', () => {
  showMarker()
})
