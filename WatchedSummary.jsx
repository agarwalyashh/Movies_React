import React from 'react';

const average = (arr) =>
    arr.reduce((acc, cur) => acc + cur, 0) / (arr.length || 1); // Ensure division by non-zero

export default function WatchedSummary({ watched }) {

    const avgImdbRating = average(watched.map((movie) => Number(movie.imdbRating)));
    const avgUserRating = average(watched.map((movie) => Number(movie.userRating)));
    const avgRuntime = average(watched.map((movie) => Number(movie.runtime)));

    return (
        <div className="summary">
            <h2>Movies you watched</h2>
            <div>
                <p>
                    <span>#️⃣</span>
                    <span>{watched.length} movies</span>
                </p>
                <p>
                    <span>⭐️</span>
                    <span>{avgImdbRating.toFixed(2)}</span>
                </p>
                <p>
                    <span>🌟</span>
                    <span>{avgUserRating.toFixed(2)}</span>
                </p>
                <p>
                    <span>⏳</span>
                    <span>{avgRuntime.toFixed(2)} min</span>
                </p>
            </div>
        </div>
    );
}
