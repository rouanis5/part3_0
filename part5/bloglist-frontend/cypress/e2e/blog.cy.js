// NB: i checked from the documentation (jan 24, 2022)
// that cypress supports arrow functions
describe('Blog app', () => {
  beforeEach(() => {
    cy.request('POST', '/api/testing/reset')
    cy.addUser({ username: 'user1', name: 'namedOne', password: '852654Suuuu!'
    })
    cy.visit('/')
  })

  it('Login form is shown', () => {
    cy.getBySelLike('login:form')
    cy.getBySel('login:username_input')
    cy.getBySel('login:password_input')
  })

  describe('Login', () => {
    beforeEach(() => {
      cy.getBySel('login:form').as('form')
      cy.getBySel('login:username_input').as('user')
      cy.getBySel('login:password_input').as('pass')
      cy.getBySel('login:submit').as('btn')
    })
    it('succeeds with correct credentials', () => {
      cy.get('@user').type('user1')
      cy.get('@pass').type('852654Suuuu!')
      cy.get('@btn').click()

      cy.contains('namedOne login')
      cy.contains('namedOne logged in')
      cy.get('@form').should('not.exist')
    })

    it('fails with wrong credentials', () => {
      cy.get('@user').type('user1')
      cy.get('@pass').type('wrong')
      cy.get('@btn').click()
      // Optional bonus exercise:
      // Check that the notification shown
      // with unsuccessful login is displayed red.
      cy.contains('invalid username or password')
        .should('have.css', 'color', 'rgb(255, 0, 0)')
        .and('have.css', 'border-style', 'solid')
        .and('have.css', 'border-color', 'rgb(255, 0, 0)')

      cy.should('not.have.text', 'namedOne logged in')
      cy.get('@form')
    })
  })

  describe('When logged in', () => {
    const blog = {
      title: 'my first Blog',
      author: 'robot',
      url: 'https://en.wikipedia.org/wiki/'
    }
    beforeEach(() => {
      // log in user here
      cy.login({ username: 'user1', password: '852654Suuuu!' })
    })

    it('A blog can be created', () => {
      cy.contains('add blog').click()

      cy.getBySel('blogForm:title')
        .as('i:title')
      cy.getBySel('blogForm:author')
        .as('i:author')
      cy.getBySel('blogForm:url')
        .as('i:url')

      cy.get('@i:title').type(blog.title)
      cy.get('@i:author').type(blog.author)
      cy.get('@i:url').type(blog.url)

      cy.getBySel('blogForm:submit').click()

      cy.getBySel('blog:title')
        .contains(blog.title)
        .parent().as('blogHeader')
        .find('button').click()

      cy.get('@i:title')
        .invoke('val')
        .should('be.empty')
      cy.get('@i:author')
        .invoke('val')
        .should('be.empty')
      cy.get('@i:url')
        .invoke('val')
        .should('be.empty')

      cy.get('@blogHeader').parent().as('blog')
      cy.get('@blog').contains(blog.url)
      cy.get('@blog').contains('likes 0')
      cy.get('@blog').contains(blog.author)
    })

    describe('When the blog is created !', () => {
      beforeEach(() => {
        cy.addBlog(blog)

        cy.getBySel('blog:title')
          .contains(blog.title)
          .parent()
          .as('blogHeader')

        cy.get('@blogHeader').find('button').as('showBtn').click()
        cy.get('@blogHeader').parent().as('blog')
      })
      it('A blogs can be liked', () => {
        cy.get('@blog').contains('likes 0')
        cy.get('@blog').getBySel('blog:like').click().as('callback')
        cy.get('@blog').contains('likes 1')
      })

      it('A blog can be deleted', () => {
        cy.get('@blog').getBySel('blog:delete').click()
        cy.contains(blog.title).should('not.have.exist')

        //refresh
        cy.visit('/')
        cy.contains(blog.title).should('not.have.exist')
      })

      it('A blog cannot be deleted only its owner', () => {
        // login from another user
        const user = {
          username: 'random',
          password: 'random'
        }
        cy.addUser(user)
        cy.login(user)

        cy.get('@showBtn').click()
        cy.get('@blog').getBySel('blog:delete').click()

        cy.getBySel('notification-error').should('have.exist')
        cy.contains(blog.title).should('have.exist')

      })
    })
  })
})