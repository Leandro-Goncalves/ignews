import { render, screen } from '@testing-library/react'
import { getSession, useSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import { mocked } from 'ts-jest/utils';
import Post, { getStaticProps, getStaticPaths } from '../../pages/posts/preview/[slug]';
import { getPrismicClient } from '../../service/prismic';

const post = {
    slug: "my-new-post",
    title: "My New Post",
    content: '<p>Post excerpt</p>',
    updatedAt: '10 de abril de 2021'
  };

jest.mock('next-auth/client');
const getSessionMocked = mocked(getSession)
const useSessionMocked = mocked(useSession)

jest.mock("../../service/prismic")
const getPrismicClientMocked = mocked(getPrismicClient)

jest.mock("next/router")
const useRouterMocked = mocked(useRouter)

describe('Posts preview page', () => {
  it('render correctly', () => {

    useSessionMocked.mockReturnValueOnce([null, false])

    render(<Post post={post}/>)

    expect(screen.getByText("My New Post")).toBeInTheDocument()
    expect(screen.getByText("Post excerpt")).toBeInTheDocument()
    expect(screen.getByText("Wanna continue reading?")).toBeInTheDocument()
  });

  it('redirects user to full post when user is subscribed', async () => {

    const pushMock = jest.fn()

    useSessionMocked.mockReturnValueOnce([{
      activeSubscription: 'fake-active-subscription'
    }, false] as any)

    useRouterMocked.mockReturnValueOnce({
      push: pushMock,
    } as any)

    render(<Post post={post}/>)

    expect(pushMock).toHaveBeenCalledWith('/posts/my-new-post')
  });
  it('teste', async () => {
    const response = await getStaticPaths({
      paths: [],
      fallback: 'blocking'
    } as any)

    expect(response).toEqual({
      paths: [],
      fallback: 'blocking'
    })
  });
  it('load initial data', async () => {

    getPrismicClientMocked.mockReturnValueOnce({
      getByUID: jest.fn().mockResolvedValueOnce({
        data: {
          title: [
            {type: 'heading', text:post.title}
          ],
          content: [
            { type: 'paragraph', text: 'Post excerpt'}
          ],
        },
        last_publication_date: '04-10-2021'
      })
    } as any)

    
    getSessionMocked.mockResolvedValueOnce({
      activeSubscription: 'fake-active-subscription'
    } as any)

    const response = await getStaticProps({
      params: {
        slug: post.slug
      }
    })

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          post: post
        }
      })
    )
  });
})