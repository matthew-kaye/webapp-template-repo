import Head from 'next/head';

export default function Home() {
  return (
    <>
      <Head>
        <title>Webapp Template</title>
      </Head>
      <main className="page">
        <section className="hero">
          <h1>Hello World</h1>
          <p className="lede">App is ready to go.</p>
        </section>
      </main>
    </>
  );
}
