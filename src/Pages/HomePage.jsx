import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";

export default function HomePage() {
  let [articles, setArticles] = useState([]);
  let [totalResults, setTotalResults] = useState(0);

  let [q, setQ] = useState("");
  let [language, setLanguage] = useState("");

  let [page, setPage] = useState(1);
  let [searchParams] = useSearchParams();

  async function getAPIData(q, language) {
    let response = await fetch(
      `https://newsapi.org/v2/everything?q=${q}&language=${language}&page=1&pageSize=24&sortBy=publishedAt&apiKey=044ffff0d98e49b4b5a90be88d9bc55e`,
    );
    response = await response.json();

    if (response.status == "ok") {
      setArticles(response.articles);
      setTotalResults(response.totalResults);
    }
  }

  async function fetchMore() {
    setPage(page + 1);
    let response = await fetch(
      `https://newsapi.org/v2/everything?q=${q}&language=${language}&page=${page}&pageSize=24&sortBy=publishedAt&apiKey=044ffff0d98e49b4b5a90be88d9bc55e`,
    );
    response = await response.json();

    if (response.status == "ok") {
      setArticles(articles.concat(response.articles));
    }
  }

  useEffect(() => {
    let q = searchParams.get("q") || "India";
    let language = searchParams.get("language") || "hi";
    getAPIData(q, language);
    setQ(q);
    setLanguage(language);
  }, [searchParams]);
  return (
    <div className="container-fluid my-3">
      <h5 className="text-center text-capitalize">{q} Article</h5>

      <InfiniteScroll
        dataLength={articles.length}
        next={fetchMore}
        hasMore={articles.length < totalResults}
        loader={
          <div className="text-center py-5">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        }
      >
        <div className="row">
          {articles.map((item, index) => {
            return (
              <div className="col-xl-2 col-lg-3 col-md-4 col-sm-6" key={index}>
                <div className="card">
                  <img
                    src={item.urlToImage}
                    height={250}
                    className="card-img-top"
                    alt="..."
                  />
                  <div className="card-body">
                    <h5 className="card-title">{item.title}</h5>
                    <div className="source">
                      <p>{item.source?.name}</p>
                      <p>{new Date(item.publishedAt).toLocaleDateString()}</p>
                    </div>
                    <p className="card-text">{item.description}</p>
                    <a href="#" className="btn btn-primary">
                      Read Full Article
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </InfiniteScroll>
    </div>
  );
}
