import React, { useState, useEffect, useCallback, useRef } from "react";
import Axios from "axios";
import moment from "moment";

function Display() {
  const [val, setVal] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageNumber, setPageNumber] = useState(1);
  const [inComplete, setInComplete] = useState(false);

  const observe = useRef();
  useEffect(() => {
    Axios.get(
      `https://api.github.com/search/repositories?q=created:>2021-08-13&sort=stars&order=desc&page=${pageNumber}

    `
    ).then((res) => {
      //console.log(res.data.incomplete_results);
      setInComplete(res.data.incomplete_results);
      console.log(inComplete);
      console.log(pageNumber);
      setVal(res.data.items);
      setLoading(false);
    });
  }, [pageNumber, inComplete]);

  const lastElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observe.current) observe.current.disconnect();
      observe.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && inComplete) {
          console.log("visible");
          setPageNumber((prev) => prev + 1);
          console.log(pageNumber);
        }
      });
      if (node) observe.current.observe(node);
    },
    [loading, inComplete, pageNumber]
  );
  return (
    <div>
      <div className="main">
        {val.map((item, index) => {
          if (item.length === index + 1) {
            return (
              <div ref={lastElementRef} className="sub-main-div" key={item.id}>
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
                    <p>
                      pushed at <span>{moment(item.pushed_at).fromNow()}</span>{" "}
                      by <span>{item.owner.login}</span>
                    </p>
                  </div>
                </div>
              </div>
            );
          } else {
            return (
              <div className="sub-main-div" key={item.id}>
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
                    <p>
                      pushed at <span>{moment(item.pushed_at).fromNow()}</span>{" "}
                      by <span>{item.owner.login}</span>
                    </p>
                  </div>
                </div>
              </div>
            );
          }
        })}
      </div>
      {loading && <div className="loading"></div>}
    </div>
  );
}

export default Display;
