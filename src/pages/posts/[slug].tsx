import { motion } from "framer-motion";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/client";
import Head from "next/head";
import { RichText } from "prismic-dom";
import { getPrismicClient } from "../../service/prismic";

import styles from  './post.module.scss'

interface Post {
  slug: string;
  title: string;
  content: string;
  updatedAt: string;
}

interface PostProps {
  post:Post
}

const fadeUp = {
  initial: {
    y: 60,
    opacity: 0
  },
  animate: {
    y: 0,
    opacity: 1,
  }
}

const fadeDown = {
  initial: {
    y: -60,
    opacity: 0
  },
  animate: {
    y: 0,
    opacity: 1,
  }
}

const fadeLeft = {
  initial: {
    x: -100,
    opacity: 0
  },
  animate: {
    x: 0,
    opacity: 1,
  }
}

const stagger = {
  animate: {
    transition: {
      staggerChildren: .12
    }
  }
}

export default function Post({ post }:PostProps) {
  return(
    <>
      <Head>
        <title>{post.title}</title>
      </Head>
      <main className={styles.container}
      >
        <motion.article
          className={styles.post}
          initial="initial"
          animate="animate"
          variants={stagger}
        >
          <motion.h1 variants={fadeDown}>{post.title}</motion.h1>
          <motion.time variants={fadeLeft}>{post.updatedAt}</motion.time>
          <motion.div
            variants={fadeUp}
            className={styles.postContent}
            dangerouslySetInnerHTML={{__html:post.content}}
          />
        </motion.article>
      </main>
    </>
  );
}

export const getServerSideProps:GetServerSideProps = async ({ req, params }) => {

  const session = await getSession({req})
  const { slug } = params;

  // @ts-ignore
  if(!session?.activeSubscription) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }

  const prismic = getPrismicClient(req)

  const response = await prismic.getByUID('publication', String(slug), {})

  const post = {
    slug,
    title: RichText.asText(response.data.title),
    content: RichText.asHtml(response.data.content),
    updatedAt: new Date(response.last_publication_date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    })
  }

  return({
    props:{
      post
    }
  })

}