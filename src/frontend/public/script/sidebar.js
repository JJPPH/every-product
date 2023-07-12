const sidebar = document.getElementById('sidebar')
const sidebarContent = document.getElementById('sidebar-content')
const sidebarToggleButton = document.getElementById('sidebar-toggle-button')

const sidebarWidth = 400

// & 사이드바 열기
const openSidebar = () => {
  sidebar.style.left = '0'
  sidebarToggleButton.style.left = `${sidebarWidth}px`
}

// & 사이드바 컨텐츠를 제거
const removeSidebarContent = () => {
  while (sidebarContent.firstChild) {
    sidebarContent.removeChild(sidebarContent.firstChild)
  }
}

// & 사이드바 토글 버튼 클릭
sidebarToggleButton.addEventListener('click', () => {
  if (!sidebar.style.left || sidebar.style.left === `-${sidebarWidth}px`) {
    openSidebar()
  } else {
    sidebar.style.left = `-${sidebarWidth}px`
    sidebarToggleButton.style.left = '0'
    removeSidebarContent()
  }
})
