import React from 'react'
import styled from 'styled-components'
import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

const API_ENDPOINT = 'https://student-json-api.lidemy.me/comments'
const Page = styled.div`
  width: 300px;
  margin: 0 auto;
`
const Title = styled.h1`
  color: #333;
`
const MessageForm = styled.form`
  margin-top: 16px;
`

const MessageTextArea = styled.textarea`
  display: block;
  width: 100%;
`
const SubmitButton = styled.button`
  margin-top: 16px;
  border-radius: 5px;
`

const MessageList = styled.div`
  margin-top: 16px;
`

const MessageContainer = styled.div`
  border-radius: 5px;
  border: 1px black solid;
  padding: 5px;

  &:not(:first-child) {
    margin-top: 8px;
  }
`

const MessageHead = styled.div`
  display: flex;
  border-bottom: 1px black solid;
  align-items: center;
  justify-content: space-between;
`

const MessageAuthor = styled.div`
  font-size: 14px;
`

const MessageTime = styled.div``

const MessageBody = styled.div`
  margin-top: 5px;
  font-size: 16px;
`

const ErrorMessage = styled.div`
 margin-top: 16px;
 color: red;
`
function Message({ author, time, children }) {
  return (
    <MessageContainer>
      <MessageHead>
        <MessageAuthor>{author}</MessageAuthor>
        <MessageTime>{time}</MessageTime>
      </MessageHead>
      <MessageBody>{children}</MessageBody>
    </MessageContainer>
  )
}

Message.propTypes = {
  author: PropTypes.string,
  time: PropTypes.string,
  children: PropTypes.node,
}

export default function App() {
  const [messages, setMessages] = useState(null)
  const [apiError, setApiError] = useState(null)
  const [value, setValue] = useState()
  const [isLoadingPostMessage, setIsLoadingPostMessage] = useState(false)

  const handleTextAreaChange = e => {
    setValue(e.target.value)
  }

  const handleFormSubmit = e => {
    e.preventDefault()
    if (isLoadingPostMessage) {
      return
    }
    setIsLoadingPostMessage(true)
    fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
          nickname: 'huli',
          body: value
      })
    })
    .then(res => res.json())
    .then(data => {
      setIsLoadingPostMessage(false)
      if (data.ok === 0) {
        setApiError(data.message)
      }
      setValue('')
      getComments()
    })
    .catch(err => {
      setIsLoadingPostMessage(false)
      setApiError(err.toString())
    })
  }

  const handleTextAreaFocus = e => {
    setApiError(null)
  }

  const getComments = () => {
    return fetch(`${API_ENDPOINT}?_sort=createdAt&_order=desc`)
      .then((res) => res.json())
      .then((data) => {
        console.log('done')
        setMessages(data)
      })
      .catch((err) => {
        setApiError(err.message.toString())
      })
  }

  const Loading = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.5);
    font-size: 30px;
    color: white
  `

  useEffect(() => {
    getComments()
  },[])

  return (
    <Page>
      {isLoadingPostMessage && <Loading>Loading...</Loading>}
      <Title>留言板</Title>
      <MessageForm onSubmit={handleFormSubmit}>
        <MessageTextArea value={value} onChange={handleTextAreaChange} onFocus={handleTextAreaFocus} rows={10}/>
        <SubmitButton>送出留言</SubmitButton>
      </MessageForm>
      {apiError && (
        <ErrorMessage>
          {apiError}
        </ErrorMessage>
      )}
      <MessageList>
      {messages && messages.length === 0 && <div>No message</div>}
      {messages && messages.map(message => (
        <Message key={message.id} author={message.nickname} time={new Date(Number(message.createdAt)).toLocaleString()}>
          {message.body}
        </Message>
      ))}
      </MessageList>
    </Page>
  )
}
