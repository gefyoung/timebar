import { ChangeEvent, FormEvent, useRef } from 'react'
// import fs from 'fs'

export default function HorizontalGraph() {

  const inputRef = useRef<HTMLInputElement>(null)

  const icsUrl = 'https://newapi.timeflip.io/api/ics/ab7a3206-de2f-8cae-838b-45bd387aacff'
  

  const fileUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      console.log(event.target.files[0])
      try {
      const reader = new FileReader()
      reader.onload = function (event) {
        console.log(event.target?.result)
      }
      const file = event.target.files[0]
      const read = reader.readAsText(file)
      const shit = csvToArray(JSON.stringify(read))
      console.log('shit', shit)
      //@ts-ignore
      // document.write(read)
      // console.log('read', read)
    } catch (err) {
      console.log(err)
    }
    }
  }

//@ts-ignore
  function csvToArray(str, delimiter = ",") {
    // slice from start of text to the first \n index
    // use split to create an array from string by delimiter
    const headers = str.slice(0, str.indexOf("\n")).split(delimiter);
  
    // slice from \n index + 1 to the end of the text
    // use split to create an array of each csv value row
    const rows = str.slice(str.indexOf("\n") + 1).split("\n");
    //@ts-ignore
    const arr = rows.map(function (row) {
      const values = row.split(delimiter);
      //@ts-ignore
      const el = headers.reduce(function (object, header, index) {
        object[header] = values[index];
        return object;
      }, {});
      return el;
    })
    return arr
  }

 

  const fakeData = {

  }

  return (
    <div>
      <div>
        <input onChange={(e) => fileUpload(e)} type="file" accept=".csv"></input>
      </div>
      im to be a bar graph
    </div>
  )
}