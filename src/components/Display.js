import React, { useState, useEffect } from "react";
import Axios from "axios";
import moment from "moment";

function Display() {
  const [val, setVal] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  let pageNumber = 1;
  const fetchData = () => {
    Axios.get(
      `https://api.github.com/search/repositories?q=created:>2021-08-13&sort=stars&order=desc&page=${pageNumber}

    `
    )
      .then((res) => {
        const newArr = [];
        res.data.items.forEach((p) => newArr.push(p));
        setVal((arr) => [...arr, ...newArr]);
        setLoading(false);
        setError(false);
        pageNumber += 1;
      })
      .catch(handleErrors);
  };

  const handleScroll = (e) => {
    if (
      window.innerHeight + e.target.documentElement.scrollTop + 1 >=
      e.target.documentElement.scrollHeight
    ) {
      fetchData();
    }
  };
  useEffect(() => {
    fetchData();
    window.addEventListener("scroll", handleScroll);
  });

  const handleErrors = (err) => {
    if (err.response || err.request) {
      setErrorMessage(
        "oops! error in connection :( try reloading page or check your internet connection"
      );
      setLoading(false);
      setError(true);
    }
  };
  return (
    <div>
      <div className="main">
        {val.map((item, index) => (
          <div className="sub-main-div" key={index}>
            <div className="img-div">
              <img src={item.owner.avatar_url} alt="" />
            </div>
            <div className="name-desc">
              <h3>{item.name}</h3>
              <p className="desc">{item.description}</p>
              <div className="counts">
                <p className="star">
                  Stars: <span>{item.stargazers_count}</span>
                </p>
                <p className="issues">
                  Issues: <span>{item.open_issues_count}</span>
                </p>
                <p className="time">
                  pushed at <span>{moment(item.pushed_at).fromNow()}</span> by{" "}
                  <span>{item.owner.login}</span>
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      {loading && <div className="loading"></div>}
      {error && <div className="error">{errorMessage}</div>}
    </div>
  );
}

export default Display;
