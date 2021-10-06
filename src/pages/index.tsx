import { GetStaticProps } from 'next';
import Head from 'next/head';
import Prismic from '@prismicio/client';
import { FiCalendar, FiUser } from 'react-icons/fi';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({ postsPagination }: HomeProps): JSX.Element {
  return (
    <>
      <Head>
        <title>spacestravelers</title>
      </Head>

      <main className={styles.container}>
        <div className={styles.posts}>
          {postsPagination.results.map(post => (
            <a key={post.uid}>
              <strong>{post.data.title}</strong>
              <span>{post.data.subtitle}</span>
              <div>
                <FiCalendar />
                <time>{post.first_publication_date}</time>
                <FiUser style={{ marginLeft: 24 }} size={20} color="" />
                <p>{post.data.author}</p>
              </div>
            </a>
          ))}
        </div>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();
  const postsResponse = await prismic.query(
    [Prismic.predicates.at('document.type', 'posts')],
    {
      fetch: ['posts.title', 'posts.subtitle', 'posts.author'],
      pageSize: 100,
    }
  );

  const resultsSerialized = postsResponse.results.map(result => ({
    ...result,
    first_publication_date: format(
      new Date(result.first_publication_date),
      'dd MMM yyyy',
      {
        locale: ptBR,
      }
    ),
  }));

  return {
    props: {
      postsPagination: {
        ...postsResponse,
        results: resultsSerialized,
      },
    },
  };
};
