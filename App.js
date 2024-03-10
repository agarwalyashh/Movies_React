import React, {Fragment, useEffect, useRef, useState} from 'react';
import MovieDetails from "./MovieDetails";
import Search from "./Search";
import Loader from "./Loader";
import WatchedSummary from "./WatchedSummary";
import WatchedMovie from "./WatchedMovie";

const key="1c58307e";
export default function App() {
    const [movies, setMovies] = useState([]);
    const [isLoading,setIsLoading] =useState(false)
    const [isError,setIsError] = useState("")
    const [query, setQuery] = useState("");
    const [selectedId,setSelectedId] = useState(null)
    const [watched, setWatched] = useState([]);

    function handleSelectedId(id){
        setSelectedId((selectedId)=>id===selectedId?null:id)
    }
    function handleCloseMovie(){
        setSelectedId(null)
    }
    function handleAddWatched(movie) {
        setWatched((watched) => [...watched, movie]);
    }

    function handleDeleteWatched(id) {
        setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
    }

    // useEffect nahi use karne se infinite loop ban jaega of re-rendering while updating state and then fetching data again, useEffect solves that problem
    //side effect in React is any interaction b/w react component and  outside world. Side Effects should not be in render logic
    //useEffect is like an event listener which listens each time a dependency is changed and it executes that effect again
    useEffect(function(){
        const controller = new window.AbortController()
        const signal = controller.signal
        async function fetchMovie()
        {
            try{
                setIsLoading(true)
                setIsError("")
                setMovies([])
                const res = await fetch(`https://www.omdbapi.com/?apikey=${key}&s=${query}`,{signal});

                if (!res.ok)
                    throw new Error("Something went wrong")

                const data = await res.json()

                if(data.Response==='False')
                {
                    throw new Error("Movie Not Found")
                }
                setMovies(data.Search);
                setIsError("")
            }
            catch (err){
                if(err.name!=='AbortError')
                setIsError(err.message)
            }
            finally {
                setIsLoading(false)
            }
        }
        if(query.length<3)
        {
            setMovies([])
            setIsError("")
            return
        }
        handleCloseMovie()
        fetchMovie()
        return function (){
            controller.abort()
        }

    }, [query]);
    return (

        <Fragment>
            <Navbar>
                <Search query={query} setQuery={setQuery}/>
                <NumResults movies={movies}/>
            </Navbar>
            <Main>
                <Box>
                    {!isError?(isLoading?<Loader/>:<MovieList movies={movies} onSelectedId={handleSelectedId}/>):<ErrorMessage message={isError}/>}
                </Box>
                <Box>
                    {selectedId?<MovieDetails
                            onCloseMovie={handleCloseMovie}
                            selectedId={selectedId}
                            onAddWatched={handleAddWatched}
                            watched={watched}
                        />:
                        <Fragment>
                            <WatchedSummary watched={watched}/>
                            <WatchedMovieList watched={watched} onDeleteWatched={handleDeleteWatched}/>
                        </Fragment>}
                </Box>
            </Main>
        </Fragment>
    );
}
function ErrorMessage({message})
{
    return(
        <p className="error">{message}</p>
    )
}
function Navbar({children})
{
    return(
            <nav className="nav-bar">
                <Logo/>
                {children}
            </nav>
    )
}
function NumResults({movies})
{
    return(
        <p className="num-results">
            Found <strong>{movies.length}</strong> results
        </p>
    )
}
function Logo()
{
    return(
        <div className="logo">
            <span role="img">🍿</span>
            <h1>usePopcorn</h1>
        </div>
    )
}


function Box({children})
{
    const [isOpen, setIsOpen] = useState(true);

    return(
        <div className="box">
            <button
                className="btn-toggle"
                onClick={() => setIsOpen((open) => !open)}
            >
                {isOpen ? "–" : "+"}
            </button>
            {isOpen && (
                children
            )}
        </div>
    )
}

function MovieList({movies,onSelectedId})
{
    return(
        <ul className="list list-movies">
            {movies && movies.map((movie) => (
                <Movie movie={movie} key={movie.imdbID} onSelectedId={onSelectedId}/>
            ))}
        </ul>
    )
}
function Movie({movie,onSelectedId})
{
    return(
        <li onClick={()=>{onSelectedId(movie.imdbID)}}>
            <img src={movie.Poster} alt={`${movie.Title} poster`} />
            <h3>{movie.Title}</h3>
            <div>
                <p>
                    <span>🗓</span>
                    <span>{movie.Year}</span>
                </p>
            </div>
        </li>
    )
}
function WatchedMovieList({watched,onDeleteWatched})
{
    return(
        <ul className="list">
            {watched.map((movie) => (
            <WatchedMovie movie={movie} key={movie.imdbID} onDeleteWatched={onDeleteWatched }/>
            ))}
        </ul>
    )
}
function Main({children})
{
    return(
        <main className="main">
            {children}
        </main>
    )
}