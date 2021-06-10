import { render, screen, fireEvent } from '@testing-library/react'
import { mocked } from 'ts-jest/utils';
import { useSession, signIn } from 'next-auth/client';
import { useRouter } from 'next/router';
import { SubscribeButton } from '.';
import { api } from '../../service/api';

const MockUserActiveSubscription = {
  user:{
    name:"John Doe",
    email:"johndoe@hotmail.com",
    image:"johndoeimage.png"
  },
  activeSubscription: "activeSubscription",
  accessToken:"accessToken",
  expires: "1000"
}

jest.mock('next-auth/client')
const useSessionMocked = mocked(useSession)
const signInMocked = mocked(signIn)

jest.mock('next/router')
const useRouterMocked = mocked(useRouter)

jest.mock('../../service/api')
const apiMocked = mocked(api)

describe("SubscribeButton component", () => {

  it('renders correctly', () => {

    useSessionMocked.mockReturnValueOnce([null, false])

    render(
      <SubscribeButton/>
    )
    expect(screen.getByText("Subscribe now")).toBeInTheDocument()
  });

  it('redirects user to sign in when not authenticated', () => {

    useSessionMocked.mockReturnValueOnce([null, false])
    
    render(
      <SubscribeButton/>
    )

    const subscribeButton = screen.getByText("Subscribe now")

    fireEvent.click(subscribeButton)

    expect(signInMocked).toHaveBeenCalled()

  })

  it('redirects to posts when user already has a subscription', () => {

    useSessionMocked.mockReturnValueOnce([MockUserActiveSubscription, false])

    const pushMock = jest.fn();

    useRouterMocked.mockReturnValueOnce({
      push: pushMock,
    } as any)

    render(<SubscribeButton/> )

    const subscribeButton = screen.getByText("Subscribe now")

    fireEvent.click(subscribeButton)

    expect(pushMock).toHaveBeenCalled()

  });

})