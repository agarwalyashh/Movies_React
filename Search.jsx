import React,{useRef,useEffect} from "react"

export default function Search({query,setQuery})
{
    //useRef is used to select and store DOM elements. Updating refs will be remembered but not re-rendered
    const inputelement=useRef(null)
    useEffect(() => {
        inputelement.current.focus() //current is a property of useRef
    }, []);
    return(

        // useEffect(function () {
        //   const el = document.querySelector(".search");
        //   console.log(el);
        //   el.focus();
        // }, []); // hamesha jab load ho tab search bar pe cursor rahe, but this is not declarative or react way to do things. so useRef
        <input
            className="search"
            type="text"
            placeholder="Search movies..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            ref={inputelement} //querySelector use karke input select karna would be an imperative way, like this we have done it in a declarative way
        />
    )
}