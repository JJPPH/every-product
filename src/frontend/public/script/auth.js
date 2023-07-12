/* global basicModal, basicModalContentDiv, closeModal */

const loginButton = document.getElementById('login-button')
const RegisterButton = document.getElementById('register-button')
const logoutButton = document.getElementById('logout-button')
const myInfoButton = document.getElementById('my-info-button')

// & 로그인 버튼 클릭
if (loginButton) {
  loginButton.addEventListener('click', () => {
    basicModal.style.display = 'block'

    const h2 = document.createElement('h2')
    h2.textContent = '로그인'
    basicModalContentDiv.appendChild(h2)

    const loginDiv = document.createElement('div')

    const emailInput = document.createElement('input')
    emailInput.type = 'text'
    emailInput.id = 'email'
    emailInput.name = 'email'
    const emailLabel = document.createElement('label')
    emailLabel.htmlFor = 'email'
    emailLabel.textContent = '이메일'
    loginDiv.appendChild(emailLabel)
    loginDiv.appendChild(emailInput)

    const passwordInput = document.createElement('input')
    passwordInput.type = 'password'
    passwordInput.id = 'password'
    passwordInput.name = 'password'
    const passwordLabel = document.createElement('label')
    passwordLabel.htmlFor = 'password'
    passwordLabel.textContent = '비밀번호'
    loginDiv.appendChild(passwordLabel)
    loginDiv.appendChild(passwordInput)

    const submitLoginButton = document.createElement('button')
    submitLoginButton.textContent = '로그인'

    submitLoginButton.addEventListener('click', async () => {
      const email = emailInput.value
      const password = passwordInput.value
      try {
        const response = await fetch('/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        })

        if (!response.ok) {
          throw new Error('잠시 후에 다시 시도해 주시길 바랍니다.')
        }

        alert('로그인이 되었습니다.')
        // eslint-disable-next-line no-restricted-globals
        location.href = '/'
      } catch (error) {
        alert('잠시 후에 다시 시도해 주시길 바랍니다.')
      }
    })

    loginDiv.appendChild(submitLoginButton)

    basicModalContentDiv.appendChild(loginDiv)
  })
}

// & 회원가입 버튼 클릭
if (RegisterButton) {
  RegisterButton.addEventListener('click', () => {
    basicModal.style.display = 'block'

    const h2 = document.createElement('h2')
    h2.textContent = '회원가입'
    basicModalContentDiv.appendChild(h2)

    const registerDiv = document.createElement('div')

    const usernameInput = document.createElement('input')
    usernameInput.type = 'text'
    usernameInput.id = 'username'
    usernameInput.name = 'username'
    const usernameLabel = document.createElement('label')
    usernameLabel.htmlFor = 'username'
    usernameLabel.textContent = '이름'
    registerDiv.appendChild(usernameLabel)
    registerDiv.appendChild(usernameInput)

    const birthdayInput = document.createElement('input')
    birthdayInput.type = 'date'
    birthdayInput.id = 'birthday'
    birthdayInput.name = 'birthday'
    const birthdayLabel = document.createElement('label')
    birthdayLabel.htmlFor = 'birthday'
    birthdayLabel.textContent = '생년월일'
    registerDiv.appendChild(birthdayLabel)
    registerDiv.appendChild(birthdayInput)

    const emailInput = document.createElement('input')
    emailInput.type = 'text'
    emailInput.id = 'email'
    emailInput.name = 'email'
    const emailLabel = document.createElement('label')
    emailLabel.htmlFor = 'email'
    emailLabel.textContent = '이메일'
    registerDiv.appendChild(emailLabel)
    registerDiv.appendChild(emailInput)

    const passwordInput = document.createElement('input')
    passwordInput.type = 'password'
    passwordInput.id = 'password'
    passwordInput.name = 'password'
    const passwordLabel = document.createElement('label')
    passwordLabel.htmlFor = 'password'
    passwordLabel.textContent = '비밀번호'
    registerDiv.appendChild(passwordLabel)
    registerDiv.appendChild(passwordInput)

    const passwordConfirmationInput = document.createElement('input')
    passwordConfirmationInput.type = 'password'
    passwordConfirmationInput.id = 'password-confirmation'
    passwordConfirmationInput.name = 'password-confirmation'
    const passwordConfirmationLabel = document.createElement('label')
    passwordConfirmationLabel.htmlFor = 'password-confirmation'
    passwordConfirmationLabel.textContent = '비밀번호 확인'
    registerDiv.appendChild(passwordConfirmationLabel)
    registerDiv.appendChild(passwordConfirmationInput)

    const isManagerRadioBox = document.createElement('input')
    isManagerRadioBox.type = 'radio'
    isManagerRadioBox.id = 'manager'
    isManagerRadioBox.name = 'is-manager'
    isManagerRadioBox.value = true
    const isManagerLabel = document.createElement('label')
    isManagerLabel.textContent = '스토어 매니저'
    isManagerLabel.htmlFor = 'manager'
    registerDiv.appendChild(isManagerLabel)
    registerDiv.appendChild(isManagerRadioBox)

    const isNotManagerRadioBox = document.createElement('input')
    isNotManagerRadioBox.type = 'radio'
    isNotManagerRadioBox.id = 'not-manager'
    isNotManagerRadioBox.name = 'is-manager'
    isNotManagerRadioBox.value = false
    const isNotManagerLabel = document.createElement('label')
    isNotManagerLabel.textContent = '일반 사용자'
    isNotManagerLabel.htmlFor = 'not-manager'
    registerDiv.appendChild(isNotManagerLabel)
    registerDiv.appendChild(isNotManagerRadioBox)

    const submitRegisterButton = document.createElement('button')
    submitRegisterButton.textContent = '회원가입'

    submitRegisterButton.addEventListener('click', async () => {
      const username = usernameInput.value
      const email = emailInput.value
      const birthday = birthdayInput.value
      const password = passwordInput.value
      const passwordConfirmation = passwordConfirmationInput.value
      const isManager = document.querySelector('input[name="is-manager"]:checked').value
      try {
        const response = await fetch('/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, email, birthday, password, passwordConfirmation, isManager }),
        })

        if (!response.ok) {
          throw new Error('잠시 후에 다시 시도해 주시길 바랍니다.')
        }

        alert('회원가입이 되었습니다. 로그인을 해주시길 바랍니다.')
        // eslint-disable-next-line no-restricted-globals
        location.href = '/'
      } catch (error) {
        alert('잠시 후에 다시 시도해 주시길 바랍니다.')
      }
    })

    registerDiv.appendChild(submitRegisterButton)
    basicModalContentDiv.appendChild(registerDiv)
  })
}

// & 로그아웃 버튼 클릭
if (logoutButton) {
  logoutButton.addEventListener('click', async () => {
    try {
      const response = await fetch('/auth/logout', {
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error('잠시 후에 다시 시도해 주시길 바랍니다.')
      } else {
        alert('로그아웃되었습니다.')
        // eslint-disable-next-line no-restricted-globals
        location.href = '/'
      }
    } catch (error) {
      alert('잠시 후에 다시 시도해 주시길 바랍니다.')
    }
  })
}

// & 나의 정보 버튼 클릭
if (myInfoButton) {
  myInfoButton.addEventListener('click', async () => {
    try {
      const response = await fetch('/auth/my-info')

      if (!response.ok) {
        throw new Error('잠시 후에 다시 시도해 주시길 바랍니다.')
      }

      const responseData = await response.json()

      basicModal.style.display = 'block'

      const h2 = document.createElement('h2')
      h2.textContent = '나의 정보 수정'
      basicModalContentDiv.appendChild(h2)

      const myInfoDiv = document.createElement('div')

      const usernameInput = document.createElement('input')
      usernameInput.type = 'text'
      usernameInput.id = 'username'
      usernameInput.name = 'username'
      usernameInput.value = responseData.username
      const usernameLabel = document.createElement('label')
      usernameLabel.htmlFor = 'username'
      usernameLabel.textContent = '이름'
      myInfoDiv.appendChild(usernameLabel)
      myInfoDiv.appendChild(usernameInput)

      const birthdayInput = document.createElement('input')
      birthdayInput.type = 'date'
      birthdayInput.id = 'birthday'
      birthdayInput.name = 'birthday'
      const birthdayDate = new Date(responseData.birthday)
      const formattedBirthday = birthdayDate.toISOString().split('T')[0]
      birthdayInput.value = formattedBirthday
      const birthdayLabel = document.createElement('label')
      birthdayLabel.htmlFor = 'birthday'
      birthdayLabel.textContent = '생년월일'
      myInfoDiv.appendChild(birthdayLabel)
      myInfoDiv.appendChild(birthdayInput)

      const emailInput = document.createElement('input')
      emailInput.type = 'text'
      emailInput.id = 'email'
      emailInput.name = 'email'
      emailInput.value = responseData.email
      const emailLabel = document.createElement('label')
      emailLabel.htmlFor = 'email'
      emailLabel.textContent = '이메일'
      myInfoDiv.appendChild(emailLabel)
      myInfoDiv.appendChild(emailInput)

      const submitEditMyInfoButton = document.createElement('button')
      submitEditMyInfoButton.textContent = '정보 수정'

      // & 나의 정보 버튼 클릭 시 나의 정보 수정 api 호출
      submitEditMyInfoButton.addEventListener('click', async () => {
        const username = usernameInput.value
        const email = emailInput.value
        const birthday = birthdayInput.value
        try {
          // eslint-disable-next-line no-shadow
          const response = await fetch('/auth/edit-my-info', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, birthday }),
          })

          if (!response.ok) {
            throw new Error('잠시 후에 다시 시도해 주시길 바랍니다.')
          }

          alert('나의 정보가 변경되었습니다.')
          closeModal()
        } catch (error) {
          alert('잠시 후에 다시 시도해 주시길 바랍니다.')
        }
      })

      myInfoDiv.appendChild(submitEditMyInfoButton)

      const hr1 = document.createElement('hr')
      myInfoDiv.appendChild(hr1)

      const passwordInput = document.createElement('input')
      passwordInput.type = 'password'
      passwordInput.id = 'password'
      passwordInput.name = 'password'
      const passwordLabel = document.createElement('label')
      passwordLabel.htmlFor = 'password'
      passwordLabel.textContent = '현재 비밀번호'
      myInfoDiv.appendChild(passwordLabel)
      myInfoDiv.appendChild(passwordInput)

      const newPasswordInput = document.createElement('input')
      newPasswordInput.type = 'password'
      newPasswordInput.id = 'password'
      newPasswordInput.name = 'password'
      const newPasswordLabel = document.createElement('label')
      newPasswordLabel.htmlFor = 'password'
      newPasswordLabel.textContent = '새 비밀번호'
      myInfoDiv.appendChild(newPasswordLabel)
      myInfoDiv.appendChild(newPasswordInput)

      const newPasswordConfirmationInput = document.createElement('input')
      newPasswordConfirmationInput.type = 'password'
      newPasswordConfirmationInput.id = 'password-confirmation'
      newPasswordConfirmationInput.name = 'password-confirmation'
      const newPasswordConfirmationLabel = document.createElement('label')
      newPasswordConfirmationLabel.htmlFor = 'password-confirmation'
      newPasswordConfirmationLabel.textContent = '새 비밀번호 확인'
      myInfoDiv.appendChild(newPasswordConfirmationLabel)
      myInfoDiv.appendChild(newPasswordConfirmationInput)

      const submitEditPasswordButton = document.createElement('button')
      submitEditPasswordButton.textContent = '비밀번호 수정'

      submitEditPasswordButton.addEventListener('click', async () => {
        const password = passwordInput.value
        const newPassword = newPasswordInput.value
        const newPasswordConfirmation = newPasswordConfirmationInput.value
        try {
          // eslint-disable-next-line no-shadow
          const response = await fetch('/auth/edit-password', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password, newPassword, newPasswordConfirmation }),
          })

          if (!response.ok) {
            throw new Error('잠시 후에 다시 시도해 주시길 바랍니다.')
          }

          alert('비밀번호가 변경되었습니다.')
          closeModal()
        } catch (error) {
          alert('잠시 후에 다시 시도해 주시길 바랍니다.')
        }
      })

      myInfoDiv.appendChild(submitEditPasswordButton)

      const hr2 = document.createElement('hr')
      myInfoDiv.appendChild(hr2)

      const deleteAccountButton = document.createElement('button')
      deleteAccountButton.textContent = '계정 삭제'
      deleteAccountButton.style.backgroundColor = 'red'

      deleteAccountButton.addEventListener('click', async () => {
        try {
          // eslint-disable-next-line no-shadow
          const response = await fetch('/auth/delete-account', { method: 'DELETE' })

          if (!response.ok) {
            throw new Error('잠시 후에 다시 시도해 주시길 바랍니다.')
          }

          alert('계정이 삭제되었습니다.')
          closeModal()
          // eslint-disable-next-line no-restricted-globals
          location.href = '/'
        } catch (error) {
          alert('잠시 후에 다시 시도해 주시길 바랍니다.')
        }
      })

      myInfoDiv.appendChild(deleteAccountButton)

      basicModalContentDiv.appendChild(myInfoDiv)
    } catch (error) {
      alert('잠시 후에 다시 시도해 주시길 바랍니다.')
    }
  })
}
