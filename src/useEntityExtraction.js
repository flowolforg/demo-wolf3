import { useEffect, useState } from 'react'
import axios from 'axios'


export default function useEntityExtraction(text, pageN) {

  const [entities, setEntities] = useState([])
  const [updated, setUpdate] = useState(false)
  const [error, setError] = useState(false)
  //const [encodedText, setEncodedText] = useState("")

  /*useEffect(() => {
    setEncodedText()
  }, [text])*/


  /*useEffect(() => {
    console.log("Debug 33"+text)
    setEntities([])
  }, [text])*/

  useEffect(() => {

    setUpdate(false)
//setEncodedText(encodeURIComponent(text));

let encodedText= encodeURIComponent(text)


//text="The+carbon+footprint+of+Bitcoin+has+drawn+wide+attention%2C+but+Bitcoin%26%2339%3Bs+long-term+impact+on+the+climate+remains+uncertain.+Here+we+present+a+framework+to+overcome+uncertainties+in+previous+estimates+and+project+Bitcoin%26%2339%3Bs+electricity+consumption+and+carbon+footprint+in+the+long+term.+If+we+assume+Bitcoin%26%2339%3Bs+market+capitalization+grows+in+line+with+the+one+of+gold%2C+we+find+that+the+annual+electricity+consumption+of+Bitcoin+may+increase+from+60+to+400+TWh+between+2020+and+2100.+The+future+carbon+footprint+of+Bitcoin+strongly+depends+on+the+decarbonization+pathway+of+the+electricity+sector.+If+the+electricity+sector+achieves+carbon+neutrality+by+2050%2C+Bitcoin%26%2339%3Bs+carbon+footprint+has+peaked+already"
let cancel   
axios({
        method: 'GET',
        url: 'https://api.dandelion.eu/datatxt/nex/v1/?%2Cabstract%2Ctypes%2Ccategories%2Clod&top_entities=8&text='+encodedText+'&min_confidence=0.8&country=-1&token=f65a2644720e43bb8e8b567abd29dc7e',
       
        cancelToken: new axios.CancelToken(c => cancel = c)
        
      }).then((res) => {
        console.log("Debug 4"+'https://api.dandelion.eu/datatxt/nex/v1/?%2Cabstract%2Ctypes%2Ccategories%2Clod&top_entities=8&text='+encodedText+'&min_confidence=0.8&country=-1&token=f65a2644720e43bb8e8b567abd29dc7e')
          //console.log(res)
        
          //console.log(...res.data.topEntities.map(b => b.uri))
          //console.log(...res.data.annotations.map(b => b.spot))
     
          //let uniqueArray = [...new Set( [...res.data.annotations.map(b => b.spot)] )];
       
        
          //setEntities( [...new Set([...res.data.annotations.map(b => b.spot)] )]  );
              

          console.log("DEBUG 5 "+res.data.annotations.map(b => b.spot))
          setEntities( res.data.annotations.map(b => b.spot))
          setUpdate(true);
          console.log("DEBUG 6 "+updated)


        }).catch(e => {
          if (axios.isCancel(e)) return
          setError(true)
        })
        return () => cancel()
      },  [text, pageN])

     

  return {entities, updated }
}
