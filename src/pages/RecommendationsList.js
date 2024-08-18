import React, { useEffect, useState } from 'react';
import axios from 'axios';

const RecommendationList = () => {
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    // Obtener las recomendaciones de la base de datos
    const fetchRecommendations = async () => {
      try {
        const response = await axios.get('/api/recommendations');
        setRecommendations(response.data);
      } catch (error) {
        console.error('Error al obtener las recomendaciones:', error);
      }
    };

    fetchRecommendations();
  }, []);

  return (
    <div>
      <h2>Lista de Recomendaciones</h2>
      <ul>
        {recommendations.map((recommendation) => (
          <li key={recommendation._id}>
            <h3>{recommendation.book.title}</h3>
            <p>Usuario: {recommendation.user.username}</p>
            <p>Puntuación: {recommendation.score}</p>
            <p>Descripción: {recommendation.description}</p>
            <p>Fecha: {new Date(recommendation.createdAt).toLocaleDateString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecommendationList;
