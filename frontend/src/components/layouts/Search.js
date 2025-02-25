import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Search() {
  const navigate = useNavigate();
  const location = useLocation();
  const [keyword, setKeyword] = useState("");
  const [showMobileInput, setShowMobileInput] = useState(false);
  const inputRef = useRef(null);
  const previousPathRef = useRef(location.pathname);

  useEffect(() => {
    if (keyword.trim() === "") {
      navigate(previousPathRef.current);
    } else {
      navigate(`/search/${keyword}`);
    }
  }, [keyword, navigate]);

  const searchHandler = (e) => {
    e.preventDefault();
    if (keyword.trim() === "") {
      toast.error("Please enter a keyword");
      return;
    }
    navigate(`/search/${keyword}`);
  };

  const clearKeyword = () => {
    setKeyword("");
    navigate(previousPathRef.current);
  };

  useEffect(() => {
    if (location.pathname === "/") {
      clearKeyword();
    } else if (!location.pathname.startsWith("/search")) {
      previousPathRef.current = location.pathname;
    }
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        setShowMobileInput(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (!location.pathname.startsWith("/search")) {
      setKeyword("");
    }
  }, [location]);

  return (
    <form onSubmit={searchHandler}>
      <div className="input-group search-container" ref={inputRef}>
        <input
          type="text"
          id="search_field"
          className="form-control desktop-search"
          placeholder="&#xf002;     Search Nystai Products"
          onChange={(e) => {
            setKeyword(e.target.value);
          }}
          value={keyword}
          style={{ textAlign: "left" }}
        />
      </div>
      <div
        className="search-icon-container"
        onClick={() => setShowMobileInput(!showMobileInput)}
      >
        <i className="fa fa-search search-icon" aria-hidden="true"></i>
      </div>
      <div>
        {showMobileInput && (
          <input
            type="text"
            id="mobile_search_field"
            className="form-control mobile-search"
            placeholder="Search Nystai Products"
            onChange={(e) => {
              setKeyword(e.target.value);
            }}
            value={keyword}
            autoFocus
            style={{ textAlign: "left" }}
          />
        )}
      </div>
    </form>
  );
}
