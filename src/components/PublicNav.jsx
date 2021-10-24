import React from "react";
import { Link, withRouter } from "react-router-dom";

function PublicNav(props) {
  return (
    <div className="navigation">
      <nav class="navbar navbar-expand navbar-dark bg-dark">
        <div class="container">
          <Link class="navbar-brand" to="/todolist">
            Personal TodoList
          </Link>

          <div>
            <ul class="navbar-nav ml-auto">
              <li
                class={`nav-item  ${
                  props.location.pathname === "/todolist" ? "active" : ""
                }`}
              >
                <Link class="nav-link" to="/todolist">
                  Log In
                </Link>
              </li>
              <li
                class={`nav-item  ${
                  props.location.pathname === "/signup" ? "active" : ""
                }`}
              >
                <Link class="nav-link" to="/signup">
                  Create Account
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}
export default withRouter(PublicNav);