const basicModal = document.getElementById('basic-modal')
const basicModalContentDiv = document.getElementById('basic-modal-content')
const basicModalCloseButton = document.getElementById('basic-modal-close-button')

// & 모달 닫기
const closeModal = () => {
  while (basicModalContentDiv.firstChild) {
    basicModalContentDiv.removeChild(basicModalContentDiv.firstChild)
  }
  basicModal.style.display = 'none'
}

// & 모달 닫기 버튼 클릭
basicModalCloseButton.addEventListener('click', closeModal)
