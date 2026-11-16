
import { useEffect, useState } from "react";
import AddEditForm from "./components/AddEditForm";
import Header from "./components/Header";
import "./App.css";

const API_URL = "https://books-api-xcu9.onrender.com/api/v1/books";

function App() {
  const [books, setBooks] = useState([]);
  const [currentBook, setCurrentBook] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetchBooks = async () => {
    try {
      const response = await fetch(API_URL);
      const result = await response.json();
      setBooks(result.data || []);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleAdd = () => {
    setCurrentBook(null);
    setShowForm(true);
  };

  const handleEdit = (book) => {
    setCurrentBook(book);
    setShowForm(true);
  };

  const saveFormData = async (book) => {
    try {
      const isEdit = Boolean(book._id);

      const response = await fetch(
        isEdit ? `${API_URL}/${book._id}` : API_URL,
        {
          method: isEdit ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: book.title,
            author: book.author,
            category: book.category,
            price: Number(book.price),
          }),
        }
      );

      if (!response.ok) throw new Error("Unable to save book");

      setShowForm(false);
      setCurrentBook(null);
      await fetchBooks();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this book?")) return;

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Unable to delete book");

      await fetchBooks();
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="app-container">
      <Header handleAdd={handleAdd} />

      <h2>Books</h2>

      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Category</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {books.map((book) => (
            <tr key={book._id}>
              <td>{book.title}</td>
              <td>{book.author}</td>
              <td>{book.category}</td>
              <td>{book.price}</td>
              <td>
                <button onClick={() => handleEdit(book)}>Edit</button>
                <button onClick={() => handleDelete(book._id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {books.length === 0 && <p>No books found.</p>}

      {showForm && (
        <AddEditForm
          currentTransaction={currentBook}
          saveFormData={saveFormData}
        />
      )}
    </div>
  );
}

export default App;
