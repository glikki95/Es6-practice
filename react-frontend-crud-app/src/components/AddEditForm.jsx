
import { useState } from "react";
import "./AddEditForm.css";

function AddEditForm({ currentTransaction, saveFormData }) {
  const [title, setTitle] = useState(currentTransaction?.title || "");
  const [author, setAuthor] = useState(currentTransaction?.author || "");
  const [category, setCategory] = useState(currentTransaction?.category || "");
  const [price, setPrice] = useState(currentTransaction?.price || "");

  const handleSubmit = (e) => {
    e.preventDefault();

    saveFormData({
      _id: currentTransaction?._id,
      title,
      author,
      category,
      price,
    });
  };

  return (
    <div className="form-container">
      <form className="add-edit-form" onSubmit={handleSubmit}>
        <h2>{currentTransaction ? "Edit Book" : "Add Book"}</h2>

        <label>Book Title:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <label>Author:</label>
        <input
          type="text"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          required
        />

        <label>Category:</label>
        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        />

        <label>Price:</label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />

        <button type="submit">Save Book</button>
      </form>
    </div>
  );
}

export default AddEditForm;
