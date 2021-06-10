import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { mocked } from 'ts-jest/utils';
import { signIn, signOut, useSession } from 'next-auth/client';
import { SignInButton } from '.';

const MockUser = {
  user:{
    name:"John Doe",
    email:"johndoe@hotmail.com",
    image:"johndoeimage.png"
  },
  accessToken:"accessToken",
  expires: "1000"
}

jest.mock('next-auth/client')
const useSessionMocked = mocked(useSession)
const signOutMocked = mocked(signOut)
const signInMocked = mocked(signIn)

describe("SignInButton component", () => {

  it('renders correctly when user is not authenticated', () => {

    useSessionMocked.mockReturnValueOnce([null, false])

    render(
      <SignInButton/>
    )
    expect(screen.getByText("Sign in with GitHub")).toBeInTheDocument()
  });

  it('renders correctly when user is authenticated', () => {

    useSessionMocked.mockReturnValueOnce([MockUser, false])
    render(
      <SignInButton/>
    )
    expect(screen.getByText(MockUser.user.name)).toBeInTheDocument()
  });

  // it('signIn user on click signIn button', async () => {

  //   useSessionMocked.mockReturnValueOnce([null, false])

  //   const signInButtonFunction = jest.fn();

  //   signInMocked.mockReturnValueOnce(signInButtonFunction as any)

  //   const {debug} = render(
  //     <SignInButton/>
  //   )

  //   const signInButton = screen.getByText("Sign in with GitHub")

  //   fireEvent.click(signInButton)

  //   debug()

  //   return expect(signInButtonFunction).toHaveBeenCalled()
  // })

})