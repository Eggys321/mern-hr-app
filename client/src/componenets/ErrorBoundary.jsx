import React from "react";
import errorImg from "../assets/errorImg.svg";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("Unhandled error in the app:", error, info);
  }

  handleReload = () => {
    this.setState({ hasError: false });
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      return (
        <main className="container text-center pt-5">
          <img src={errorImg} alt="error" style={{ width: "40%" }} />
          <h1>Something went wrong</h1>
          <p className="text-muted">
            An unexpected error occurred. Try reloading the page - if it keeps
            happening, please let an admin know.
          </p>
          <button className="btn btn-primary" onClick={this.handleReload}>
            Back to Dashboard
          </button>
        </main>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
