import { render, screen } from '@testing-library/react'
import { getSession } from 'next-auth/client';
import { mocked } from 'ts-jest/utils';
import Post, { getServerSideProps } from '../../pages/posts/[slug]';
import { getPrismicClient } from '../../service/prismic';

const post = {
    slug: "my-new-post",
    title: "My New Post",
    content: '<p>Post excerpt</p>',
    updatedAt: '10 de Abril'
  };

jest.mock('next-auth/client');
const getSessionMocked = mocked(getSession)

jest.mock("../../service/prismic")
const getPrismicClientMocked = mocked(getPrismicClient)

describe('Post page', () => {
  it('render correctly', () => {

    render(<Post post={post}/>)

    expect(screen.getByText("My New Post")).toBeInTheDocument()
    expect(screen.getByText("Post excerpt")).toBeInTheDocument()
  });

  it('redirects user if no subscription is found', async () => {

    getSessionMocked.mockResolvedValueOnce(null)

    const response = await getServerSideProps({ params: {
      slug: 'my-new-post'
    }} as any)

    expect(response).toEqual(
      expect.objectContaining({
        redirect: expect.objectContaining({
          destination: '/',
        })
      })
    )
  });
  it('load initial data', async () => {

    getPrismicClientMocked.mockReturnValueOnce({
      getByUID: jest.fn().mockResolvedValueOnce({
        data: {
          title: [
            {type: 'heading', text:'My new post'}
          ],
          content: [
            { type: 'paragraph', text: 'Post excerpt'}
          ],
        },
        last_publication_date: '04-01-2021'
      })
    } as any)

    
    getSessionMocked.mockResolvedValueOnce({
      activeSubscription: 'fake-active-subscription'
    } as any)

    const response = await getServerSideProps({ params: {
      slug: 'my-new-post'
    }} as any)

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          post: {
            slug: 'my-new-post',
            title: 'My new post',
            content: '<p>Post excerpt</p>',
            updatedAt: '01 de abril de 2021'
          }
        }
      })
    )
  });
})