
import "./Header.css";

function Header({ handleAdd }) {
  return (
    <header className="header-container">
      <h1 className="header-title">Books Management App</h1>
      <button className="header-button" onClick={handleAdd}>
        Add Book
      </button>
    </header>
  );
}

export default Header;
