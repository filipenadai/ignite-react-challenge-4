import { GetStaticPaths, GetStaticProps } from 'next';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { FiCalendar, FiUser, FiClock } from 'react-icons/fi';

import { RichText } from 'prismic-dom';
import { useMemo } from 'react';
import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps): JSX.Element {
  const timeToRead = useMemo(() => {
    const content = post.data.content.map(i =>
      i.body.map(b => RichText.asText(b.text))
    );

    const wordsContent = content.map(text => text.map(i => i.split(' ')));

    console.log(wordsContent.length);
  }, [post]);
  return (
    <main className={styles.container}>
      <img src={post.data.banner.url} alt="banner" />
      <div className={styles.content}>
        <strong>{post.data.title}</strong>
        <div>
          <FiCalendar />
          <time>
            {format(new Date(post.first_publication_date), 'dd MMM yyyy', {
              locale: ptBR,
            })}
          </time>
          <FiUser style={{ marginLeft: 24 }} size={20} color="" />
          <p>{post.data.author}</p>
          <FiClock style={{ marginLeft: 24 }} size={20} color="" />
          <p>4 min</p>
        </div>
      </div>
    </main>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient();
  const posts = await prismic.query('posts', {});
  const ids = posts.results.map(result => ({
    params: {
      slug: result.uid,
    },
  }));

  return {
    paths: ids,
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params;

  const prismic = getPrismicClient();
  const post = await prismic.getByUID('posts', String(slug), {});

  return {
    props: {
      post,
    },
  };
};
