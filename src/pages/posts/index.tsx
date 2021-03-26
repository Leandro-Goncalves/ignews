import { GetStaticProps } from 'next';
import Head from 'next/head';
import { getPrismicClient } from '../../service/prismic';
import styles from './styles.module.scss';
import Prismic from '@prismicio/client'
import { RichText } from 'prismic-dom'
import Link from 'next/link';
import { useSession } from 'next-auth/client';
import { motion } from 'framer-motion';

interface Posts {
  slug: string;
  title: string;
  excerpt: string;
  updatedAt: string;
}

interface PostsProps {
  posts:  Posts[]
}

const fadeUp = {
  initial: {
    y: 60,
    opacity: 0
  },
  animate: {
    y: 0,
    opacity: 1,
    transition: {
      duratuon: 0.6
    }
  }
}

const stagger = {
  animate: {
    transition: {
      staggerChildren: .12
    }
  }
}

export default function Posts({ posts }: PostsProps) {

  const [session] = useSession();

  return(
    <>
      <Head>
        <title>Posts | Ignews</title>
      </Head>
      <motion.main
        className={styles.container}
        variants={stagger}
        initial="initial"
        animate="animate"
      >
        <div className={styles.posts}>
          {posts.map(post => (
            // @ts-ignore
            <Link href={session?.activeSubscription ? `/posts/${post.slug}` : `/posts/preview/${post.slug}`}>
              <motion.a
                variants={fadeUp}
                key={post.slug}
              >
                <time>{post.updatedAt}</time>
                <strong>{post.title}</strong>
                <p>{post.excerpt}</p>
              </motion.a>
            </Link>
          ))}
        </div>
      </motion.main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient()

  const response = await prismic.query([
    Prismic.predicates.at('document.type', 'publication')
  ], {
    fetch: ['publication.title', 'publication.content'],
    pageSize: 100
  })

  const posts = response.results.map(post => {
    return {
      slug: post.uid,
      title: RichText.asText(post.data.title),
      excerpt: post.data.content.find(content => content.type === 'paragraph')?.text ?? '',
      updatedAt: new Date(post.last_publication_date).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      })
    }
  })

  return {
    props: {
      posts
    }
  }
}