import { useDispatch } from 'react-redux'
import { useField } from '../hooks'
import { addBlog } from '../reducers/blogsReducer'
import Togglable from './Togglable'

const AddBlogForm = () => {
  const dispatch = useDispatch()
  const [title, titleInput] = useField('text')
  const [author, authorInput] = useField('text')
  const [url, urlInput] = useField('text')

  const add = (e) => {
    e.preventDefault()

    dispatch(
      addBlog({
        title,
        author,
        url
      })
    )

    Array.from([titleInput, authorInput, urlInput]).map((el) => el.clear())
  }
  return (
    <Togglable buttonLabel="add blog">
      <h2>Create new</h2>
      <form onSubmit={add}>
        <div>
          <label>
            Title:
            <input {...titleInput.props} data-test="blogForm:title" />
          </label>
          <br />
          <label>
            Author:
            <input {...authorInput.props} data-test="blogForm:author" />
          </label>
          <br />
          <label>
            url:
            <input {...urlInput.props} data-test="blogForm:url" />
          </label>
        </div>
        <button type="submit" data-test="blogForm:submit">
          create
        </button>
      </form>
    </Togglable>
  )
}

export default AddBlogForm
