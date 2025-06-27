import Footer from "../components/Footer"
import WeatherCard from "../components/WeatherCard"
import Navbar from "../components/Navbar"
import SearchBar from "../components/Searchbar"

const HomePage = () => {

    const handleSearch = (city: string) => {
        console.log("Searched: ", city)
    }
    return(
        <>
        <Navbar/>
        <SearchBar onSearch={handleSearch}/>
        <WeatherCard/>
        <Footer/>
        </>
    )
}
export default HomePage