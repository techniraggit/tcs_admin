import LoaderGif from "../assets/images/loader.gif";

function Loader() {
  return (
    <div className="loader-wrap"><img className="loader" src={LoaderGif} alt="gif" /></div>
  )
}

export default Loader;
