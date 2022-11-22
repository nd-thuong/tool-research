import { useEffect, useState } from "react";


const Index = () => {
  const [url, setUrl] = useState();
  useEffect(() => {
    const src = localStorage.getItem('dataUrl');
    if (src) {
      console.log('here')
      console.log(src)
      setUrl(src);
    }
  }, []);

  return (
    <div>
      {url && <img src={url} alt="view" />}
    </div>
  )
};

export default Index;
