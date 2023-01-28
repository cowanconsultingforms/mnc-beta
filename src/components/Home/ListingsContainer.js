import React from "react";
import SearchForm from "./SearchForm";

const ListingsContainer =({searchQuery})=>{
    return(
        <div>
        <SearchForm data = {searchQuery} />
        </div>
    )
}
