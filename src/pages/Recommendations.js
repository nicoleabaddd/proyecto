import React, { useState, useEffect } from 'react';
import RecommendationsList from './RecommendationsList'; // Ajusta la ruta según la estructura de carpetas

const fetchRecommendations = () => [
  {
    _id: '1',
    user: 'John Doe',
    book: 'The Great Gatsby',
    score: 5,
    createdAt: new Date().toISOString(),
    description: 'A classic novel set in the Roaring Twenties.',
  },
  {
    _id: '2',
    user: 'Jane Smith',
    book: '1984',
    score: 4,
    createdAt: new Date().toISOString(),
    description: 'A dystopian novel about totalitarianism.',
  },
];

const Recommendations = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedRecommendation, setSelectedRecommendation] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      setRecommendations(fetchRecommendations());
      setLoading(false);
    }, 1000);
  }, []);

  const handleEditClick = (rec) => {
    setSelectedRecommendation(rec);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedRecommendation(null);
  };

  const handleAddRecommendation = (newRec) => {
    setRecommendations(prev => [
      ...prev,
      { ...newRec, _id: Date.now().toString(), createdAt: new Date().toISOString() },
    ]);
    setShowForm(false); // Cierra el formulario después de añadir
  };

  if (loading) return <div style={styles.container}>Loading...</div>;

  return (
    <div style={styles.container}>
      <h2>Book Recommendations</h2>

      {/* Botón para mostrar el formulario de agregar nueva recomendación */}
      <button onClick={() => setShowForm(true)} style={styles.addButton}>Add New Recommendation</button>

      {showForm && (
        <RecommendationForm
          recommendation={selectedRecommendation}
          onClose={handleCloseForm}
          onSave={(updatedRec) => {
            if (selectedRecommendation) {
              setRecommendations(prev =>
                prev.map(rec => rec._id === updatedRec._id ? updatedRec : rec)
              );
            } else {
              handleAddRecommendation(updatedRec);
            }
            handleCloseForm();
          }}
        />
      )}

      <ul style={styles.list}>
        {recommendations.length > 0 ? (
          recommendations.map((rec) => (
            <li key={rec._id} style={styles.item}>
              <h3 style={styles.bookTitle}>{rec.book}</h3>
              <p style={styles.user}>Recommended by: {rec.user}</p>
              <p style={styles.score}>Score: {rec.score} / 5</p>
              <p style={styles.date}>Date: {new Date(rec.createdAt).toLocaleDateString()}</p>
              {rec.description && <p style={styles.description}>{rec.description}</p>}
              <button onClick={() => handleEditClick(rec)}>Edit</button>
            </li>
          ))
        ) : (
          <li style={styles.item}>No recommendations available.</li>
        )}
      </ul>
    </div>
  );
};

// Componente de formulario de recomendación
const RecommendationForm = ({ recommendation, onClose, onSave }) => {
  const [formData, setFormData] = useState(recommendation || { book: '', description: '', score: 1 });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div style={styles.formContainer}>
      <h3>{recommendation ? 'Edit Recommendation' : 'Add Recommendation'}</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Book:</label>
          <input
            type="text"
            name="book"
            value={formData.book}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Description:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Score:</label>
          <input
            type="number"
            name="score"
            value={formData.score}
            onChange={handleChange}
            min="1"
            max="5"
            required
          />
        </div>
        <button type="submit">{recommendation ? 'Update' : 'Create'}</button>
        <button type="button" onClick={onClose}>Cancel</button>
      </form>
    </div>
  );
};

// Estilos en línea
const styles = {
  container: {
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
  },
  list: {
    listStyleType: 'none',
    padding: '0',
  },
  item: {
    border: '1px solid #ddd',
    padding: '10px',
    marginBottom: '10px',
    borderRadius: '5px',
    backgroundColor: '#f9f9f9',
  },
  bookTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '5px',
  },
  user: {
    fontSize: '16px',
    marginBottom: '5px',
  },
  score: {
    fontSize: '16px',
    marginBottom: '5px',
  },
  date: {
    fontSize: '14px',
    color: '#888',
    marginBottom: '10px',
  },
  description: {
    fontSize: '14px',
    color: '#333',
  },
  formContainer: {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    backgroundColor: '#fff',
  },
  addButton: {
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#686868',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginBottom: '20px',
  },
};

export default Recommendations;
