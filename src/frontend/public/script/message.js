/* global basicModalContentDiv, basicModal, closeModal */

const myMessageButton = document.getElementById('my-message-button')

// & 받은 메세지 또는 보낸 메세지 보기
const showMessage = async (listDiv, received = true) => {
  while (listDiv.firstChild) {
    listDiv.removeChild(listDiv.firstChild)
  }
  let response
  try {
    // 받은 메세지 보여주기
    if (received) {
      response = await fetch('/message/received-messages')
    } else {
      // 보낸 메세지 보여주기
      response = await fetch('/message/sent-messages')
    }

    if (!response.ok) {
      throw new Error('잠시 후에 다시 시도해 주시길 바랍니다.')
    }

    const responseData = await response.json()

    responseData.messages.forEach((message) => {
      const messageDiv = document.createElement('div')
      messageDiv.classList.add('message')

      const messageUser = document.createElement('p')
      if (received) {
        messageUser.textContent = `보낸 사람 : ${message.senderName}`
      } else {
        messageUser.textContent = `받은 사람 : ${message.recipientName}`
      }
      messageDiv.appendChild(messageUser)

      const content = document.createElement('p')
      content.textContent = `메세지 내용 : ${message.content}`
      messageDiv.appendChild(content)

      listDiv.appendChild(messageDiv)
    })
  } catch (error) {
    alert('잠시 후에 다시 시도해 주시길 바랍니다.')
  }
}

if (myMessageButton) {
  myMessageButton.addEventListener('click', () => {
    basicModal.style.display = 'block'

    const h2 = document.createElement('h2')
    h2.textContent = '메세지함'
    basicModalContentDiv.appendChild(h2)

    const messageBoxDiv = document.createElement('div')
    const messageListDiv = document.createElement('div')

    const showSentMessageButton = document.createElement('button')
    showSentMessageButton.textContent = '보낸 메세지'
    showSentMessageButton.addEventListener('click', () => {
      showMessage(messageListDiv, false)
    })

    const showReceivedMessageButton = document.createElement('button')
    showReceivedMessageButton.textContent = '받은 메세지'
    showReceivedMessageButton.addEventListener('click', () => {
      showMessage(messageListDiv, true)
    })

    const writeMessageButton = document.createElement('button')
    writeMessageButton.textContent = '메세지 작성'

    // & 메세지 작성 클릭
    writeMessageButton.addEventListener('click', () => {
      while (messageBoxDiv.firstChild) {
        messageBoxDiv.removeChild(messageBoxDiv.firstChild)
      }
      const recipientInput = document.createElement('input')
      recipientInput.type = 'text'
      recipientInput.id = 'recipient'
      recipientInput.name = 'recipient'
      const recipientLabel = document.createElement('label')
      recipientLabel.htmlFor = 'recipient'
      recipientLabel.textContent = '받는 이'
      messageBoxDiv.appendChild(recipientLabel)
      messageBoxDiv.appendChild(recipientInput)

      const contentTextarea = document.createElement('textarea')
      contentTextarea.style.resize = 'none'
      contentTextarea.id = 'content'
      contentTextarea.name = 'content'
      contentTextarea.rows = 20
      contentTextarea.cols = 45
      const contentLabel = document.createElement('label')
      contentLabel.htmlFor = 'content'
      contentLabel.textContent = '메세지 내용'

      const submitMessageButton = document.createElement('button')
      submitMessageButton.textContent = '메세지 보내기'

      // & 메세지 보내기 api 호출
      submitMessageButton.addEventListener('click', async () => {
        const recipientName = recipientInput.value
        const content = contentTextarea.value
        try {
          const response = await fetch('/message/send-message', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ recipientName, content }),
          })

          if (!response.ok) {
            throw new Error('잠시 후에 다시 시도해 주시길 바랍니다.')
          }

          alert('메세지가 보내졌습니다.')
          closeModal()
        } catch (error) {
          alert('잠시 후에 다시 시도해 주시길 바랍니다.')
        }
      })

      messageBoxDiv.appendChild(recipientLabel)
      messageBoxDiv.appendChild(recipientInput)
      messageBoxDiv.appendChild(contentLabel)
      messageBoxDiv.appendChild(contentTextarea)
      messageBoxDiv.appendChild(submitMessageButton)
    })

    // & 초기에는 받은 메시지를 보여주기
    showMessage(messageListDiv)

    const notice = document.createElement('p')
    notice.textContent = '메세지는 최신순으로 10개까지 보입니다.'

    messageBoxDiv.appendChild(showSentMessageButton)
    messageBoxDiv.appendChild(showReceivedMessageButton)
    messageBoxDiv.appendChild(messageListDiv)
    messageBoxDiv.appendChild(notice)
    messageBoxDiv.appendChild(writeMessageButton)

    basicModalContentDiv.appendChild(messageBoxDiv)
  })
}
