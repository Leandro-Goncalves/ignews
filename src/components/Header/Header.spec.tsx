import { render, screen } from '@testing-library/react';
import { mocked } from 'ts-jest/utils';
import { useSession } from 'next-auth/client';
import { Header } from '.';

jest.mock('next/router', () => {
  return {
    useRouter() {
      return {
        asPath: '/'
      }
    }
  }
})

jest.mock('next-auth/client')
const nextAuthMocked = mocked(useSession)

describe("Header component", () => {

  nextAuthMocked.mockReturnValueOnce([null, false])

  it('renders correctly', () => {
    render(
      <Header/>
    )
  
    expect(screen.getByText("Home")).toBeInTheDocument()
    expect(screen.getByText("Posts")).toBeInTheDocument()
  });

})