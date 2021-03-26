import { motion } from 'framer-motion';
import { GetStaticProps } from 'next';
import Head from 'next/head';
import React from 'react';
import { SubscribeButton } from '../components/SubscribeButton';
import { stripe } from '../service/stripe';

import styles from './home.module.scss';

interface HomeProps {
  product: {
    productId: string;
    amount: number;
  }
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

export default function Home({product}:HomeProps) {
  return (
    <motion.div
    exit={{opacity: 0}}
    variants={stagger}
    initial="initial"
    animate="animate">
      <Head>
        <title>Home | ig.news</title>
      </Head>
      <main className={styles.contentContainer}>
        <motion.section
          className={styles.hero}  
        >
          <motion.span
            variants={fadeUp}
          >👏 Hey, welcome</motion.span>
          <motion.h1
            variants={fadeUp}
          >News about <br/> the <span>React</span> world</motion.h1>
          <motion.p
            variants={fadeUp}
          >
            Get acess to all the publications <br/>
            <span>for {product.amount} month</span>
          </motion.p>
          <motion.div
            variants={fadeUp}
          >
            <SubscribeButton priceId={product.productId}/>
          </motion.div>
        </motion.section>

        <img src="/images/avatar.svg" alt="Girl conding"/>
      </main>
    </motion.div>
  )
}

export const getStaticProps: GetStaticProps = async () => {

  const price = await stripe.prices.retrieve('price_1IXqviCvPa5yXI8xBvETMAFy')

  const product = {
    priceId: price.id,
    amount: new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price.unit_amount / 100),
  }

  return {
    props:{
      product
    },
    revalidate: 60 * 60 * 24 //24 hours
  }
}