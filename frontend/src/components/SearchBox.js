import React, {useState} from 'react'
import { useNavigate, useLocation} from 'react-router-dom'
import {Form, Button} from 'react-bootstrap'

function SearchBox() {

    const navigate = useNavigate()
    const location = useLocation()

    const [keyword, setKeyword] = useState('')

    const submitHandler = (e) => {
        e.preventDefault()

        if(keyword){
            navigate(`/?keyword=${keyword}&page=1`)
        } else{
            navigate(location.pathname)
        }
    }
  return (
    <Form onSubmit={submitHandler} className='d-flex mx-3' >
       <Form.Control 
          name='q'
          type='text'
          onChange={e => setKeyword(e.target.value)}
          className='mr-sm-2 ml-sm-2'
       >
         
       </Form.Control>

       <Button
        type='submit'
        variant='outline-success'
        className='p-2 mx-2'
       >
         Search
       </Button>
    </Form>
  )
}

export default SearchBox