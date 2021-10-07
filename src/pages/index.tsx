import { GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import Prismic from '@prismicio/client';
import { FiCalendar, FiUser } from 'react-icons/fi';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import { useCallback, useState } from 'react';
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
  const [posts, setPosts] = useState(postsPagination.results);

  const handlePaginate = useCallback(() => {
    fetch(postsPagination.next_page).then(response => {
      response.json().then(data => {
        setPosts(state => [...state, ...data.results]);
      });
    });
  }, [postsPagination.next_page]);

  return (
    <>
      <Head>
        <title>spacestravelers</title>
      </Head>

      <main className={styles.container}>
        <div className={styles.posts}>
          {posts.map(post => (
            <Link key={post.uid} href={`post/${post.uid}`}>
              <a>
                <strong>{post.data.title}</strong>
                <span>{post.data.subtitle}</span>
                <div>
                  <FiCalendar />
                  <time>
                    {format(
                      new Date(post.first_publication_date),
                      'dd MMM yyyy',
                      {
                        locale: ptBR,
                      }
                    )}
                  </time>
                  <FiUser style={{ marginLeft: 24 }} size={20} color="" />
                  <p>{post.data.author}</p>
                </div>
              </a>
            </Link>
          ))}
        </div>
        {postsPagination.next_page && (
          <button type="button" onClick={handlePaginate}>
            Carregar mais posts
          </button>
        )}
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
    }
  );

  console.log(postsResponse);

  return {
    props: {
      postsPagination: postsResponse,
    },
  };
};
